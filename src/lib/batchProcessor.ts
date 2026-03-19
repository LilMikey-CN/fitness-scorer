/**
 * src/lib/batchProcessor.ts
 * ──────────────────────────────────────────────────────────────────────────────
 * Excel/CSV 批量处理：解析 → 校验 → 评分 → 生成输出工作簿
 * ──────────────────────────────────────────────────────────────────────────────
 */

import * as XLSX from 'xlsx';
import type { PersonInput, BatchResult, BatchRowResult, Gender } from '../types';
import { scorePerson, getAgeGroup } from './scorer';

// ─── 列名映射（中英文均支持，不区分大小写） ──────────────────────────────────

const FIELD_MAP: Record<string, keyof PersonInput | 'birth_year'> = {
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
    // fallback：GBK 编码（中文 Windows 导出的无 BOM CSV）
    return XLSX.read(buffer, { type: 'array', codepage: 936 });
  }
}

// ─── 解析表头 → 字段映射 ─────────────────────────────────────────────────────

function buildColumnMap(headerRow: unknown[]): Map<number, keyof PersonInput | 'birth_year'> {
  const map = new Map<number, keyof PersonInput | 'birth_year'>();
  headerRow.forEach((cell, idx) => {
    const key = String(cell ?? '').trim().toLowerCase();
    const field = FIELD_MAP[key] ?? FIELD_MAP[String(cell ?? '').trim()];
    if (field) map.set(idx, field);
  });
  return map;
}

// ─── 解析单行 ─────────────────────────────────────────────────────────────────

function parseRow(
  rawRow: unknown[],
  colMap: Map<number, keyof PersonInput | 'birth_year'>,
  testYear: number,
): { input?: PersonInput; error?: string } {
  const raw: Record<string, unknown> = {};
  colMap.forEach((field, idx) => {
    raw[field] = rawRow[idx] ?? null;
  });

  // 性别
  const genderRaw = raw['gender'];
  if (genderRaw === null || genderRaw === undefined || String(genderRaw).trim() === '') {
    return { error: '性别不能为空（1=男，0=女）' };
  }
  const gender = Number(genderRaw) as Gender;
  if (gender !== 0 && gender !== 1) {
    return { error: `性别值无效：${genderRaw}（应为 1 或 0）` };
  }

  // 年龄
  let age: number;
  if (raw['age'] !== null && raw['age'] !== undefined && String(raw['age']).trim() !== '') {
    age = Math.floor(Number(raw['age']));
  } else if (raw['birth_year'] !== null && raw['birth_year'] !== undefined) {
    const birthYear = Number(raw['birth_year']);
    age = testYear - birthYear; // 简化：未考虑生日月份，如需精确需补充出生月日列
  } else {
    return { error: '年龄或出生年 至少一项必填' };
  }
  if (isNaN(age) || age < 20 || age > 59) {
    return { error: `年龄 ${age} 超出适用范围（20-59岁）` };
  }
  if (!getAgeGroup(age)) {
    return { error: `年龄 ${age} 无法映射到年龄组` };
  }

  // 必填数值字段
  const numericRequired: Array<[keyof PersonInput, string]> = [
    ['height', '身高'],
    ['weight', '体重'],
    ['lungCapacity', '肺活量'],
    ['stepIndex', '台阶指数'],
    ['gripStrength', '握力'],
    ['sitAndReach', '坐位体前屈'],
    ['reactionTime', '选择反应时'],
    ['singleLegStand', '闭眼单脚站立'],
  ];

  const values: Partial<PersonInput> = { name: String(raw['name'] ?? ''), gender, age };
  for (const [field, label] of numericRequired) {
    const val = raw[field];
    if (val === null || val === undefined || String(val).trim() === '') {
      return { error: `${label} 不能为空` };
    }
    const n = Number(val);
    if (isNaN(n)) {
      return { error: `${label} 不是有效数字：${val}` };
    }
    (values as Record<string, unknown>)[field] = n;
  }

  // 条件必填字段
  const parseOptional = (field: keyof PersonInput): number | null => {
    const val = raw[field];
    if (val === null || val === undefined || String(val).trim() === '') return null;
    return Number(val);
  };

  values.pushups = parseOptional('pushups');
  values.situps = parseOptional('situps');
  values.verticalJump = parseOptional('verticalJump');

  return { input: values as PersonInput };
}

// ─── 主批量处理函数 ───────────────────────────────────────────────────────────

export function processBatch(workbook: XLSX.WorkBook): BatchResult {
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const rows: unknown[][] = XLSX.utils.sheet_to_json(sheet, {
    header: 1,
    defval: null,
  }) as unknown[][];

  if (rows.length < 2) {
    return { total: 0, succeeded: 0, failed: 0, rows: [] };
  }

  const headerRow = rows[0] as unknown[];
  const colMap = buildColumnMap(headerRow);
  const testYear = new Date().getFullYear();

  const results: BatchRowResult[] = [];
  let succeeded = 0;
  let failed = 0;

  for (let i = 1; i < rows.length; i++) {
    const rawRow = rows[i] as unknown[];
    // 跳过完全空行
    if (rawRow.every(cell => cell === null || cell === undefined || String(cell).trim() === '')) {
      continue;
    }

    const { input, error } = parseRow(rawRow, colMap, testYear);
    if (error || !input) {
      results.push({ rowIndex: i + 1, success: false, error: error ?? '解析失败' });
      failed++;
      continue;
    }

    try {
      const result = scorePerson(input);
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

// ─── 生成输出工作簿 ───────────────────────────────────────────────────────────

const OUTPUT_HEADERS = [
  '年龄组', '身高体重_分', '肺活量_分', '台阶指数_分', '握力_分',
  '俯卧撑_分', '仰卧起坐_分', '纵跳_分', '坐位体前屈_分',
  '选择反应时_分', '闭眼单脚站立_分', '总分', '综合评级', '备注',
];

function scoreToStr(score: number | null | undefined, applicable: boolean): string {
  if (!applicable) return '—';
  if (score === null || score === undefined) return '无分';
  if (score === 0) return '无分';
  return String(score);
}

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

  const outputRows: unknown[][] = [];

  // 表头
  const headerRow = [...(originalRows[0] as unknown[]), ...OUTPUT_HEADERS];
  outputRows.push(headerRow);

  let resultIdx = 0;
  for (let i = 1; i < originalRows.length; i++) {
    const rawRow = [...(originalRows[i] as unknown[])];
    // 跳过完全空行
    if ((originalRows[i] as unknown[]).every(c => c === null || c === undefined || String(c).trim() === '')) {
      outputRows.push(rawRow);
      continue;
    }

    const batchRow = batchResult.rows[resultIdx++];
    if (!batchRow) {
      outputRows.push(rawRow);
      continue;
    }

    if (!batchRow.success || !batchRow.result) {
      outputRows.push([...rawRow, '', '', '', '', '', '', '', '', '', '', '', '', '', batchRow.error ?? '处理失败']);
      continue;
    }

    const r = batchRow.result;
    const older = ['40-44', '45-49', '50-54', '55-59'].includes(r.ageGroup);
    const isMale = r.input.gender === 1;
    const isYoung = !older;

    const appendCols = [
      r.ageGroup,
      r.heightWeightScore !== null ? String(r.heightWeightScore) : '无分',
      scoreToStr(r.lungCapacityScore, true),
      scoreToStr(r.stepIndexScore, true),
      scoreToStr(r.gripStrengthScore, true),
      scoreToStr(r.pushupsScore, isYoung && isMale),
      scoreToStr(r.situpsScore, isYoung && !isMale),
      scoreToStr(r.verticalJumpScore, isYoung),
      scoreToStr(r.sitAndReachScore, true),
      scoreToStr(r.reactionTimeScore, true),
      scoreToStr(r.singleLegStandScore, true),
      r.overallGrade !== null ? r.totalScore : '—',
      r.overallGrade ?? '—',
      r.warnings.join('；'),
    ];

    outputRows.push([...rawRow, ...appendCols]);
  }

  const newSheet = XLSX.utils.aoa_to_sheet(outputRows);
  const newWb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(newWb, newSheet, '评分结果');
  return newWb;
}

/** 将工作簿导出为 Uint8Array（供 Tauri 写文件使用） */
export function workbookToBuffer(wb: XLSX.WorkBook): Uint8Array {
  const raw = XLSX.write(wb, { type: 'array', bookType: 'xlsx' }) as ArrayBuffer;
  return new Uint8Array(raw);
}
