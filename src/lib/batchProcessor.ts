/**
 * src/lib/batchProcessor.ts
 * ──────────────────────────────────────────────────────────────────────────────
 * Excel/CSV 批量处理：解析 → 校验（必填：性别/年龄/身高/体重）→ 逐字段评分 → 输出
 *
 * 设计原则：
 * - 只有性别、年龄、身高、体重为必填；其余测量字段可选
 * - 有数据 → 计算该项得分；无数据 → 0分（无分）
 * - 总分/综合评级：始终计算（缺失字段以0分计入）
 * - 性别接受：1/男/Male/M（男）或 0/女/Female/F（女）
 * ──────────────────────────────────────────────────────────────────────────────
 */

import * as XLSX from 'xlsx';
import type { PartialScoreResult, BatchResult, BatchRowResult, Gender, AgeGroup, ItemScore, OverallGrade } from '../types';
import { getAgeGroup, isOlderGroup, scoreHW, scoreAscZero, scoreAscEmpty, scoreDescEmpty } from './scorer';
import {
  LUNG_CAPACITY, STEP_INDEX, GRIP_STRENGTH,
  PUSHUPS, SITUPS, VERTICAL_JUMP,
  SIT_AND_REACH, REACTION_TIME, SINGLE_LEG_STAND,
} from '../data/scoringTables';

// ─── 内部类型：部分输入（只有 gender/age/height/weight 必填） ─────────────────

interface PartialPersonInput {
  name?: string;
  gender: Gender;
  age: number;
  height: number;
  weight: number;
  // 可选测量字段（undefined = 数据未提供）
  lungCapacity?: number;
  stepIndex?: number;
  gripStrength?: number;
  pushups?: number;
  situps?: number;
  verticalJump?: number;
  sitAndReach?: number;
  reactionTime?: number;
  singleLegStand?: number;
}

// ─── 列名映射 ─────────────────────────────────────────────────────────────────

type FieldKey = keyof PartialPersonInput | 'birth_year';

const FIELD_MAP: Record<string, FieldKey> = {
  '姓名': 'name', 'name': 'name',
  '性别': 'gender', 'gender': 'gender', 'sex': 'gender',
  '年龄': 'age', 'age': 'age',
  '出生年': 'birth_year', 'birth_year': 'birth_year', 'birthyear': 'birth_year',
  '身高': 'height', 'height': 'height',
  '体重': 'weight', 'weight': 'weight',
  '肺活量': 'lungCapacity', 'lung_capacity': 'lungCapacity', 'vital_capacity': 'lungCapacity',
  '台阶指数': 'stepIndex', 'step_index': 'stepIndex',
  '握力': 'gripStrength', 'grip_strength': 'gripStrength',
  '俯卧撑': 'pushups', 'pushups': 'pushups', 'push_ups': 'pushups',
  '仰卧起坐': 'situps', 'situps': 'situps', 'sit_ups': 'situps',
  '纵跳': 'verticalJump', 'vertical_jump': 'verticalJump',
  '坐位体前屈': 'sitAndReach', 'sit_and_reach': 'sitAndReach',
  '选择反应时': 'reactionTime', 'reaction_time': 'reactionTime',
  '闭眼单脚站立': 'singleLegStand', 'single_leg_stand': 'singleLegStand',
};

// ─── 读取工作簿 ───────────────────────────────────────────────────────────────

export function readWorkbook(buffer: ArrayBuffer): XLSX.WorkBook {
  try {
    return XLSX.read(buffer, { type: 'array' });
  } catch {
    return XLSX.read(buffer, { type: 'array', codepage: 936 });
  }
}

// ─── 表头解析 ─────────────────────────────────────────────────────────────────

/** 去掉括号内的单位注释，如 "身高（cm）" → "身高"，"体重(kg)" → "体重" */
function normalizeHeader(s: string): string {
  return s.replace(/[（(][^）)]*[）)]/g, '').trim();
}

function buildColumnMap(headerRow: unknown[]): Map<number, FieldKey> {
  const map = new Map<number, FieldKey>();
  headerRow.forEach((cell, idx) => {
    const raw = String(cell ?? '').trim();
    const normalized = normalizeHeader(raw).toLowerCase();
    const field = FIELD_MAP[normalized] ?? FIELD_MAP[raw.toLowerCase()] ?? FIELD_MAP[raw];
    if (field) map.set(idx, field);
  });
  return map;
}

// ─── 性别解析（支持文本和数字） ───────────────────────────────────────────────

function parseGender(raw: unknown): Gender | null {
  if (raw === null || raw === undefined) return null;
  const s = String(raw).trim();
  if (s === '') return null;
  if (s === '1' || s === '男' || s.toLowerCase() === 'male' || s.toLowerCase() === 'm') return 1;
  if (s === '0' || s === '女' || s.toLowerCase() === 'female' || s.toLowerCase() === 'f') return 0;
  const n = Number(raw);
  if (n === 1) return 1;
  if (n === 0) return 0;
  return null;
}

// ─── 解析单行 ─────────────────────────────────────────────────────────────────

function parseRow(
  rawRow: unknown[],
  colMap: Map<number, FieldKey>,
  testYear: number,
): { input?: PartialPersonInput; error?: string } {
  const raw: Record<string, unknown> = {};
  colMap.forEach((field, idx) => { raw[field] = rawRow[idx] ?? null; });

  // 性别（必填）
  const gender = parseGender(raw['gender']);
  if (gender === null) return { error: '性别不能为空（接受：1/男/0/女）' };

  // 年龄（必填）
  let age: number;
  if (raw['age'] !== null && raw['age'] !== undefined && String(raw['age']).trim() !== '') {
    age = Math.floor(Number(raw['age']));
  } else if (raw['birth_year'] !== null && raw['birth_year'] !== undefined) {
    age = testYear - Number(raw['birth_year']);
  } else {
    return { error: '年龄或出生年至少一项必填' };
  }
  if (isNaN(age) || age < 20 || age > 59) return { error: `年龄 ${age} 超出范围（20–59岁）` };
  if (!getAgeGroup(age)) return { error: `年龄 ${age} 无法映射到年龄组` };

  // 身高（必填）
  const heightRaw = raw['height'];
  if (heightRaw === null || heightRaw === undefined || String(heightRaw).trim() === '') {
    return { error: '身高不能为空' };
  }
  const height = Number(heightRaw);
  if (isNaN(height)) return { error: `身高不是有效数字：${heightRaw}` };

  // 体重（必填）
  const weightRaw = raw['weight'];
  if (weightRaw === null || weightRaw === undefined || String(weightRaw).trim() === '') {
    return { error: '体重不能为空' };
  }
  const weight = Number(weightRaw);
  if (isNaN(weight)) return { error: `体重不是有效数字：${weightRaw}` };

  // 可选测量字段（缺失或非数字 → undefined）
  const parseOpt = (field: string): number | undefined => {
    const val = raw[field];
    if (val === null || val === undefined || String(val).trim() === '') return undefined;
    const n = Number(val);
    return isNaN(n) ? undefined : n;
  };

  return {
    input: {
      name: raw['name'] ? String(raw['name']) : undefined,
      gender, age, height, weight,
      lungCapacity: parseOpt('lungCapacity'),
      stepIndex: parseOpt('stepIndex'),
      gripStrength: parseOpt('gripStrength'),
      pushups: parseOpt('pushups'),
      situps: parseOpt('situps'),
      verticalJump: parseOpt('verticalJump'),
      sitAndReach: parseOpt('sitAndReach'),
      reactionTime: parseOpt('reactionTime'),
      singleLegStand: parseOpt('singleLegStand'),
    },
  };
}

// ─── 综合评级 ─────────────────────────────────────────────────────────────────

function calcGrade(totalScore: number, ageGroup: AgeGroup): OverallGrade {
  if (isOlderGroup(ageGroup)) {
    if (totalScore > 26) return '一级(优秀)';
    if (totalScore >= 24) return '二级(良好)';
    if (totalScore >= 18) return '三级(合格)';
    return '四级(不合格)';
  } else {
    if (totalScore > 33) return '一级(优秀)';
    if (totalScore >= 30) return '二级(良好)';
    if (totalScore >= 23) return '三级(合格)';
    return '四级(不合格)';
  }
}

function calcRailwayGrade(totalScore: number, ageGroup: AgeGroup): OverallGrade {
  if (isOlderGroup(ageGroup)) {
    if (totalScore > 27) return '一级(优秀)';
    if (totalScore >= 24) return '二级(良好)';
    if (totalScore >= 16) return '三级(合格)';
    return '四级(不合格)';
  } else {
    if (totalScore > 33) return '一级(优秀)';
    if (totalScore >= 30) return '二级(良好)';
    if (totalScore >= 20) return '三级(合格)';
    return '四级(不合格)';
  }
}

// ─── 逐字段部分评分 ───────────────────────────────────────────────────────────

function scoreRowPartial(input: PartialPersonInput): PartialScoreResult {
  const ageGroup = getAgeGroup(input.age) as AgeGroup;
  const { gender } = input;
  const older = isOlderGroup(ageGroup);
  const isMale = gender === 1;
  const warnings: string[] = [];

  // 形态（始终计算）
  const heightWeightScore = scoreHW(input.height, input.weight, gender, ageGroup);
  if (heightWeightScore === null) warnings.push(`身高 ${input.height}cm 超出标准表范围`);

  // 机能（空值/零值 → 0分）
  const lungCapacityScore: ItemScore = scoreAscZero(LUNG_CAPACITY, ageGroup, gender, input.lungCapacity);
  const stepIndexScore: ItemScore = scoreAscZero(STEP_INDEX, ageGroup, gender, input.stepIndex);

  // 体能 — 握力（空值/零值 → 0分）
  const gripStrengthScore: ItemScore = scoreAscZero(GRIP_STRENGTH, ageGroup, gender, input.gripStrength);

  // 体能 — 条件字段（不适用 → null，适用但空值/零值 → 0分）
  const pushupsApplicable = !older && isMale;
  const situpsApplicable = !older && !isMale;
  const verticalJumpApplicable = !older;

  const pushupsScore: ItemScore | null = pushupsApplicable
    ? scoreAscZero(PUSHUPS, ageGroup, gender, input.pushups) : null;
  const situpsScore: ItemScore | null = situpsApplicable
    ? scoreAscZero(SITUPS, ageGroup, gender, input.situps) : null;
  const verticalJumpScore: ItemScore | null = verticalJumpApplicable
    ? scoreAscZero(VERTICAL_JUMP, ageGroup, gender, input.verticalJump) : null;

  // 柔韧灵敏平衡（坐位体前屈允许0值；选择反应时允许0值）
  const sitAndReachScore: ItemScore = scoreAscEmpty(SIT_AND_REACH, ageGroup, gender, input.sitAndReach);
  const reactionTimeScore: ItemScore = scoreDescEmpty(REACTION_TIME, ageGroup, gender, input.reactionTime);
  const singleLegStandScore: ItemScore = scoreAscZero(SINGLE_LEG_STAND, ageGroup, gender, input.singleLegStand);

  // 总分始终计算（缺失字段以0分计入）
  const hw = heightWeightScore ?? 0;
  const hasZero = heightWeightScore === null; // 唯一无法评级的情况：身高超出范围

  const totalScore =
    hw +
    lungCapacityScore +
    stepIndexScore +
    gripStrengthScore +
    sitAndReachScore +
    reactionTimeScore +
    singleLegStandScore +
    (pushupsScore ?? 0) +
    (situpsScore ?? 0) +
    (verticalJumpScore ?? 0);

  const overallGrade: OverallGrade | null = !hasZero ? calcGrade(totalScore, ageGroup) : null;
  const railwayGrade: OverallGrade | null = !hasZero ? calcRailwayGrade(totalScore, ageGroup) : null;

  return {
    input: { name: input.name, gender, age: input.age, height: input.height, weight: input.weight },
    ageGroup,
    heightWeightScore,
    lungCapacityScore,
    stepIndexScore,
    gripStrengthScore,
    pushupsScore,
    situpsScore,
    verticalJumpScore,
    sitAndReachScore,
    reactionTimeScore,
    singleLegStandScore,
    pushupsApplicable,
    situpsApplicable,
    verticalJumpApplicable,
    totalScore,
    overallGrade,
    railwayGrade,
    warnings,
  };
}

// ─── 主批量处理函数 ───────────────────────────────────────────────────────────

export function processBatch(workbook: XLSX.WorkBook): BatchResult {
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const rows: unknown[][] = XLSX.utils.sheet_to_json(sheet, {
    header: 1,
    defval: null,
  }) as unknown[][];

  if (rows.length < 2) return { total: 0, succeeded: 0, failed: 0, rows: [] };

  const colMap = buildColumnMap(rows[0] as unknown[]);
  const testYear = new Date().getFullYear();
  const results: BatchRowResult[] = [];
  let succeeded = 0;
  let failed = 0;

  for (let i = 1; i < rows.length; i++) {
    const rawRow = rows[i] as unknown[];
    if (rawRow.every(c => c === null || c === undefined || String(c).trim() === '')) continue;

    const { input, error } = parseRow(rawRow, colMap, testYear);
    if (error || !input) {
      results.push({ rowIndex: i + 1, success: false, error: error ?? '解析失败' });
      failed++;
      continue;
    }

    try {
      const result = scoreRowPartial(input);
      results.push({ rowIndex: i + 1, success: true, result });
      succeeded++;
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      results.push({ rowIndex: i + 1, success: false, error: msg });
      failed++;
    }
  }

  return { total: results.length, succeeded, failed, rows: results };
}

// ─── 输出列定义 ───────────────────────────────────────────────────────────────

// 追加列布局（共 15 列）：
//   N+0  年龄组
//   N+1  身高体重_分   ← 形态指标
//   N+2  肺活量_分     ← 机能指标
//   N+3  台阶指数_分
//   N+4  握力_分       ← 体能指标
//   N+5  俯卧撑_分
//   N+6  仰卧起坐_分
//   N+7  纵跳_分
//   N+8  坐位体前屈_分 ← 柔韧灵敏平衡指标
//   N+9  选择反应时_分
//   N+10 闭眼单脚站立_分
//   N+11 总分
//   N+12 综合评级（国标）
//   N+13 铁路评级
//   N+14 备注

const SCORE_FIELD_NAMES = [
  '年龄组',
  '身高体重_分',
  '肺活量_分',
  '台阶指数_分',
  '握力_分',
  '俯卧撑_分',
  '仰卧起坐_分',
  '纵跳_分',
  '坐位体前屈_分',
  '选择反应时_分',
  '闭眼单脚站立_分',
  '总分',
  '综合评级',
  '铁路评级',
  '备注',
];

const SCORE_COUNT = SCORE_FIELD_NAMES.length; // 15

function scoreToStr(score: number | null | undefined): string {
  if (score === null || score === undefined) return '—';
  if (score === 0) return '无分';
  return String(score);
}

// ─── 生成输出工作簿（两行表头 + 四类分组合并单元格） ─────────────────────────

export function buildOutputWorkbook(
  originalWorkbook: XLSX.WorkBook,
  batchResult: BatchResult,
): XLSX.WorkBook {
  const sheetName = originalWorkbook.SheetNames[0];
  const sheet = originalWorkbook.Sheets[sheetName];
  const originalRows: unknown[][] = XLSX.utils.sheet_to_json(sheet, {
    header: 1,
    defval: null,
  }) as unknown[][];

  const originalHeaders = (originalRows[0] ?? []) as unknown[];
  const N = originalHeaders.length;

  // 行 1：原始表头 + 分组标签（合并单元格）
  // 偏移：N+0=年龄组(无组), N+1=形态, N+2=机能(merge→N+3), N+4=体能(merge→N+7),
  //       N+8=柔韧灵敏平衡(merge→N+10), N+11..N+14 无组标签
  const groupRow: unknown[] = [
    ...originalHeaders,
    '',               // N+0 年龄组（无分组标签）
    '形态指标',       // N+1
    '机能指标',       // N+2（合并至 N+3）
    '',               // N+3
    '体能指标',       // N+4（合并至 N+7）
    '', '', '',       // N+5 N+6 N+7
    '柔韧灵敏平衡指标', // N+8（合并至 N+10）
    '', '',           // N+9 N+10
    '', '', '', '',   // N+11 N+12 N+13 N+14
  ];

  // 行 2：原始列留空 + 各分项字段名
  const fieldRow: unknown[] = [
    ...new Array(N).fill(''),
    ...SCORE_FIELD_NAMES,
  ];

  // 数据行（从原始第 2 行起）
  const dataRows: unknown[][] = [];
  let resultIdx = 0;

  for (let i = 1; i < originalRows.length; i++) {
    const origRow = [...(originalRows[i] as unknown[])];
    const isEmpty = (originalRows[i] as unknown[]).every(
      c => c === null || c === undefined || String(c).trim() === '',
    );

    if (isEmpty) {
      dataRows.push([...origRow, ...new Array(SCORE_COUNT).fill('')]);
      continue;
    }

    const batchRow = batchResult.rows[resultIdx++];
    if (!batchRow) {
      dataRows.push([...origRow, ...new Array(SCORE_COUNT).fill('')]);
      continue;
    }

    if (!batchRow.success || !batchRow.result) {
      const scoreCols = new Array(SCORE_COUNT).fill('');
      scoreCols[SCORE_COUNT - 1] = batchRow.error ?? '处理失败'; // 备注列
      dataRows.push([...origRow, ...scoreCols]);
      continue;
    }

    const r = batchRow.result;
    const scoreCols: unknown[] = [
      r.ageGroup,
      scoreToStr(r.heightWeightScore),
      scoreToStr(r.lungCapacityScore),
      scoreToStr(r.stepIndexScore),
      scoreToStr(r.gripStrengthScore),
      !r.pushupsApplicable ? 'N/A' : scoreToStr(r.pushupsScore),
      !r.situpsApplicable ? 'N/A' : scoreToStr(r.situpsScore),
      !r.verticalJumpApplicable ? 'N/A' : scoreToStr(r.verticalJumpScore),
      scoreToStr(r.sitAndReachScore),
      scoreToStr(r.reactionTimeScore),
      scoreToStr(r.singleLegStandScore),
      r.totalScore,
      r.overallGrade ?? '—',
      r.railwayGrade ?? '—',
      r.warnings.join('；'),
    ];
    dataRows.push([...origRow, ...scoreCols]);
  }

  const allRows = [groupRow, fieldRow, ...dataRows];
  const newSheet = XLSX.utils.aoa_to_sheet(allRows);

  // 合并单元格（行 0 即 groupRow）
  newSheet['!merges'] = [
    { s: { r: 0, c: N + 2 }, e: { r: 0, c: N + 3 } },  // 机能指标
    { s: { r: 0, c: N + 4 }, e: { r: 0, c: N + 7 } },  // 体能指标
    { s: { r: 0, c: N + 8 }, e: { r: 0, c: N + 10 } }, // 柔韧灵敏平衡指标
  ];

  const newWb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(newWb, newSheet, '评分结果');
  return newWb;
}

/** 将工作簿导出为 Uint8Array */
export function workbookToBuffer(wb: XLSX.WorkBook): Uint8Array {
  const raw = XLSX.write(wb, { type: 'array', bookType: 'xlsx' }) as ArrayBuffer;
  return new Uint8Array(raw);
}
