/**
 * src/lib/scorer.ts
 * ──────────────────────────────────────────────────────────────────────────────
 * 核心评分逻辑
 * ──────────────────────────────────────────────────────────────────────────────
 */

import type {
  PersonInput,
  ScoreResult,
  AgeGroup,
  Gender,
  HeightWeightScore,
  ItemScore,
  OverallGrade,
} from '../types';
import {
  HW_M_20_29, HW_M_30_39, HW_M_40_49, HW_M_50_59,
  HW_F_20_29, HW_F_30_39, HW_F_40_49, HW_F_50_59,
  LUNG_CAPACITY,
  STEP_INDEX,
  GRIP_STRENGTH,
  PUSHUPS,
  SITUPS,
  VERTICAL_JUMP,
  SIT_AND_REACH,
  REACTION_TIME,
  SINGLE_LEG_STAND,
} from '../data/scoringTables';
import type {
  HeightWeightRow,
  AscendingScoreRow,
  DescendingScoreRow,
} from '../types';

// ─── 工具函数 ─────────────────────────────────────────────────────────────────

/** 将浮点数乘以100取整后比较，避免精度问题 */
const ge = (a: number, b: number) => Math.round(a * 100) >= Math.round(b * 100);
const gt = (a: number, b: number) => Math.round(a * 100) > Math.round(b * 100);

// ─── 年龄组判定 ───────────────────────────────────────────────────────────────

export function getAgeGroup(age: number): AgeGroup | null {
  if (age < 20 || age > 59) return null;
  const base = Math.floor(age / 5) * 5;
  const low = base;
  const high = base + 4;
  return `${low}-${high}` as AgeGroup;
}

/** 判断是否属于 40-59 岁段（影响综合评级阈值和可用指标） */
export function isOlderGroup(ageGroup: AgeGroup): boolean {
  return ['40-44', '45-49', '50-54', '55-59'].includes(ageGroup);
}

// ─── 身高标准体重评分 ─────────────────────────────────────────────────────────

function getHWTable(gender: Gender, ageGroup: AgeGroup): HeightWeightRow[] {
  const g = gender === 1 ? 'M' : 'F';
  const decade = ['20-24', '25-29'].includes(ageGroup)
    ? '20_29'
    : ['30-34', '35-39'].includes(ageGroup)
      ? '30_39'
      : ['40-44', '45-49'].includes(ageGroup)
        ? '40_49'
        : '50_59';

  if (g === 'M') {
    return decade === '20_29' ? HW_M_20_29
      : decade === '30_39' ? HW_M_30_39
        : decade === '40_49' ? HW_M_40_49
          : HW_M_50_59;
  } else {
    return decade === '20_29' ? HW_F_20_29
      : decade === '30_39' ? HW_F_30_39
        : decade === '40_49' ? HW_F_40_49
          : HW_F_50_59;
  }
}

export function scoreHeightWeight(
  height: number,
  weight: number,
  gender: Gender,
  ageGroup: AgeGroup,
): HeightWeightScore | null {
  const table = getHWTable(gender, ageGroup);
  const row = table.find(
    r => ge(height, r.heightMin) && ge(r.heightMax, height),
  );
  if (!row) return null;

  const w = weight;
  if (gt(row.w3Heavy, w) === false && false) { /* unused */ }

  if (gt(row.w3Heavy, w) === false) return 1;   // weight > w3Heavy
  if (ge(w, row.w5Max) && ge(row.w3Heavy, w)) return 3; // w5Max ≤ w ≤ w3Heavy
  if (ge(w, row.w3Light) && gt(row.w5Max, w)) return 5; // w3Light ≤ w < w5Max
  if (ge(w, row.w1Light) && gt(row.w3Light, w)) return 3; // w1Light ≤ w < w3Light
  // weight < w1Light
  return 1;
}

// 重写更清晰的版本
export function scoreHW(
  height: number,
  weight: number,
  gender: Gender,
  ageGroup: AgeGroup,
): HeightWeightScore | null {
  const table = getHWTable(gender, ageGroup);
  const row = table.find(r => height >= r.heightMin && height <= r.heightMax + 0.09);
  if (!row) return null;

  const { w1Light, w3Light, w5Max, w3Heavy } = row;
  if (weight < w1Light) return 1;          // 偏轻
  if (weight < w3Light) return 3;          // 轻
  if (weight <= w5Max) return 5;          // 正常
  if (weight <= w3Heavy) return 3;         // 重
  return 1;                                // 偏重
}

// ─── 升序指标评分 ─────────────────────────────────────────────────────────────

export function lookupAscending(
  table: AscendingScoreRow[],
  ageGroup: AgeGroup,
  gender: Gender,
  value: number,
): ItemScore {
  const row = table.find(r => r.ageGroup === ageGroup && r.gender === gender);
  if (!row) return 1;
  if (value < row.s1) return 1;
  if (value < row.s2) return 1;
  if (value < row.s3) return 2;
  if (value < row.s4) return 3;
  if (value < row.s5) return 4;
  return 5;
}

// ─── 降序指标评分（选择反应时） ───────────────────────────────────────────────

export function lookupDescending(
  table: DescendingScoreRow[],
  ageGroup: AgeGroup,
  gender: Gender,
  value: number,
): ItemScore {
  const row = table.find(r => r.ageGroup === ageGroup && r.gender === gender);
  if (!row) return 1;
  if (value > row.s1max) return 1;
  if (value > row.s2max) return 1;
  if (value > row.s3max) return 2;
  if (value > row.s4max) return 3;
  if (value > row.s5max) return 4;
  return 5;
}

// ─── 综合评级 ─────────────────────────────────────────────────────────────────

function calcOverallGrade(
  totalScore: number,
  ageGroup: AgeGroup,
  hasZero: boolean,
): OverallGrade | null {
  if (hasZero) return null;
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

// ─── 主评分函数 ───────────────────────────────────────────────────────────────

export function scorePerson(input: PersonInput): ScoreResult {
  const warnings: string[] = [];
  const ageGroup = getAgeGroup(input.age);

  if (!ageGroup) {
    throw new Error(`年龄 ${input.age} 超出标准适用范围（20-59岁）`);
  }

  const { gender } = input;
  const older = isOlderGroup(ageGroup);

  // 1. 身高标准体重
  const heightWeightScore = scoreHW(input.height, input.weight, gender, ageGroup);
  if (heightWeightScore === null) {
    warnings.push(`身高 ${input.height}cm 超出标准表范围`);
  }

  // 2. 肺活量
  const lungCapacityScore = lookupAscending(LUNG_CAPACITY, ageGroup, gender, input.lungCapacity);

  // 3. 台阶指数
  const stepIndexScore = lookupAscending(STEP_INDEX, ageGroup, gender, input.stepIndex);

  // 4. 握力
  const gripStrengthScore = lookupAscending(GRIP_STRENGTH, ageGroup, gender, input.gripStrength);

  // 5. 俯卧撑（仅男性20-39岁）
  let pushupsScore: ItemScore | null = null;
  if (!older && gender === 1) {
    if (input.pushups === null) {
      warnings.push('俯卧撑为必填项（男性20-39岁）');
      pushupsScore = 0;
    } else {
      pushupsScore = lookupAscending(PUSHUPS, ageGroup, gender, input.pushups);
    }
  }

  // 6. 仰卧起坐（仅女性20-39岁）
  let situpsScore: ItemScore | null = null;
  if (!older && gender === 0) {
    if (input.situps === null) {
      warnings.push('仰卧起坐为必填项（女性20-39岁）');
      situpsScore = 0;
    } else {
      situpsScore = lookupAscending(SITUPS, ageGroup, gender, input.situps);
    }
  }

  // 7. 纵跳（仅20-39岁）
  let verticalJumpScore: ItemScore | null = null;
  if (!older) {
    if (input.verticalJump === null) {
      warnings.push('纵跳为必填项（20-39岁）');
      verticalJumpScore = 0;
    } else {
      verticalJumpScore = lookupAscending(VERTICAL_JUMP, ageGroup, gender, input.verticalJump);
    }
  }

  // 8. 坐位体前屈
  const sitAndReachScore = lookupAscending(SIT_AND_REACH, ageGroup, gender, input.sitAndReach);

  // 9. 选择反应时
  const reactionTimeScore = lookupDescending(REACTION_TIME, ageGroup, gender, input.reactionTime);

  // 10. 闭眼单脚站立
  const singleLegStandScore = lookupAscending(SINGLE_LEG_STAND, ageGroup, gender, input.singleLegStand);

  // 计算总分（null项不计入；0分意味着"无分"参与综合评级判断）
  const mandatoryScores: ItemScore[] = [
    heightWeightScore ?? 0,
    lungCapacityScore,
    stepIndexScore,
    gripStrengthScore,
    sitAndReachScore,
    reactionTimeScore,
    singleLegStandScore,
  ];
  const optionalScores: (ItemScore | null)[] = [
    pushupsScore,
    situpsScore,
    verticalJumpScore,
  ];

  // 检查身高体重是否超范围（null → 无法评级）
  const hasNull = heightWeightScore === null;
  const hasZero = hasNull; // 唯一无法评级的情况：身高超出范围

  const totalScore =
    (heightWeightScore ?? 0) +
    lungCapacityScore +
    stepIndexScore +
    gripStrengthScore +
    sitAndReachScore +
    reactionTimeScore +
    singleLegStandScore +
    (pushupsScore ?? 0) +
    (situpsScore ?? 0) +
    (verticalJumpScore ?? 0);

  const overallGrade = calcOverallGrade(totalScore, ageGroup, hasZero);

  return {
    input,
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
    totalScore,
    overallGrade,
    warnings,
  };
}
