// src/types/index.ts
// 国民体质测定评分系统 — 全局类型定义

/** 性别：1=男，0=女 */
export type Gender = 0 | 1;

/** 年龄组标签 */
export type AgeGroup =
  | '20-24' | '25-29'
  | '30-34' | '35-39'
  | '40-44' | '45-49'
  | '50-54' | '55-59';

/** 综合评级 */
export type OverallGrade = '一级(优秀)' | '二级(良好)' | '三级(合格)' | '四级(不合格)';

/** 身高标准体重单项得分（只有 1/3/5 分） */
export type HeightWeightScore = 1 | 3 | 5;

/** 一般单项得分（1-5分，0表示无分） */
export type ItemScore = 0 | 1 | 2 | 3 | 4 | 5;

// ─── 输入 ────────────────────────────────────────────────────────────────────

/** 单人测试数据（手动录入或批量解析后的结构） */
export interface PersonInput {
  /** 姓名（可选，仅用于显示/导出） */
  name?: string;
  /** 性别：1=男，0=女 */
  gender: Gender;
  /** 计算后的周岁年龄（20–59） */
  age: number;
  /** 身高（cm，精度0.1） */
  height: number;
  /** 体重（kg，精度0.1） */
  weight: number;
  /** 肺活量（mL，整数） */
  lungCapacity: number;
  /** 台阶指数（运动持续时间秒 / 三次脉搏之和 × 100，精度0.1） */
  stepIndex: number;
  /** 握力（kg，精度0.1） */
  gripStrength: number;
  /** 俯卧撑次数（仅男性20-39岁，整数；其余传 null） */
  pushups: number | null;
  /** 1分钟仰卧起坐次数（仅女性20-39岁，整数；其余传 null） */
  situps: number | null;
  /** 纵跳（cm，精度0.1；仅20-39岁；其余传 null） */
  verticalJump: number | null;
  /** 坐位体前屈（cm，精度0.1，可为负值） */
  sitAndReach: number;
  /** 选择反应时（秒，精度0.01） */
  reactionTime: number;
  /** 闭眼单脚站立（秒，精度0.1） */
  singleLegStand: number;
}

// ─── 输出 ────────────────────────────────────────────────────────────────────

/** 单人评分结果 */
export interface ScoreResult {
  /** 输入镜像（方便导出时对照） */
  input: PersonInput;
  /** 计算出的年龄组 */
  ageGroup: AgeGroup;
  /** 身高标准体重得分（1/3/5，或 null 表示身高超出范围） */
  heightWeightScore: HeightWeightScore | null;
  /** 肺活量得分（0=无分，1-5） */
  lungCapacityScore: ItemScore;
  /** 台阶指数得分 */
  stepIndexScore: ItemScore;
  /** 握力得分 */
  gripStrengthScore: ItemScore;
  /** 俯卧撑得分（不适用时为 null） */
  pushupsScore: ItemScore | null;
  /** 仰卧起坐得分（不适用时为 null） */
  situpsScore: ItemScore | null;
  /** 纵跳得分（不适用时为 null） */
  verticalJumpScore: ItemScore | null;
  /** 坐位体前屈得分 */
  sitAndReachScore: ItemScore;
  /** 选择反应时得分 */
  reactionTimeScore: ItemScore;
  /** 闭眼单脚站立得分 */
  singleLegStandScore: ItemScore;
  /** 各项有效分之和（不含 null 项；null 项不计入总分） */
  totalScore: number;
  /** 综合评级（任意必选项为 null 或 0 时为 null） */
  overallGrade: OverallGrade | null;
  /** 错误/警告信息列表（正常时为空数组） */
  warnings: string[];
}

// ─── 批量处理 ─────────────────────────────────────────────────────────────────

/** 批量处理单行结果（在 ScoreResult 基础上增加行号和原始行数据） */
export interface BatchRowResult {
  /** 原始行号（从1开始，含表头时+1） */
  rowIndex: number;
  /** 是否解析/评分成功 */
  success: boolean;
  /** 解析/评分失败时的错误描述 */
  error?: string;
  /** 成功时的评分结果 */
  result?: ScoreResult;
}

/** 批量处理整体结果 */
export interface BatchResult {
  total: number;
  succeeded: number;
  failed: number;
  rows: BatchRowResult[];
}

// ─── 评分表数据结构（供 scoringTables.ts 使用） ───────────────────────────────

/**
 * 身高标准体重查找表中的一行
 * [身高下限, 1分上限(偏轻), 3分上限(轻), 5分上限(正常), 3分上限(重)]
 * 含义：
 *   weight < min1b          → 1 分（偏轻）
 *   min1b ≤ weight < min3a  → 3 分（轻）
 *   min3a ≤ weight ≤ max5   → 5 分（正常）
 *   max5 < weight ≤ max3b   → 3 分（重）
 *   weight > max3b          → 1 分（偏重）
 */
export interface HeightWeightRow {
  heightMin: number; // 身高段下限（含，如 160.0）
  heightMax: number; // 身高段上限（含，如 160.9）
  w1Light: number;   // 偏轻1分上限（不含，即 < 此值得1分）
  w3Light: number;   // 轻3分上限（不含）
  w5Max: number;     // 正常5分上限（含）
  w3Heavy: number;   // 重3分上限（含）
  // weight > w3Heavy → 1分（偏重）
}

/**
 * 升序评分行（肺活量、台阶指数、握力、俯卧撑、仰卧起坐、纵跳、坐位体前屈、闭眼单脚站立）
 * value < s1min       → 0分（无分）
 * s1min ≤ value < s2  → 1分
 * s2 ≤ value < s3     → 2分
 * s3 ≤ value < s4     → 3分
 * s4 ≤ value < s5     → 4分
 * value ≥ s5          → 5分
 */
export interface AscendingScoreRow {
  ageGroup: AgeGroup;
  gender: Gender;
  s1: number; // 1分下限（含）
  s2: number; // 2分下限（含）
  s3: number; // 3分下限（含）
  s4: number; // 4分下限（含）
  s5: number; // 5分下限（含，即 ≥ 此值得5分）
}

/**
 * 降序评分行（选择反应时：时间越短越好）
 * value > s1max       → 0分（无分，超出范围）
 * s2max < value ≤ s1max → 1分
 * s3max < value ≤ s2max → 2分
 * s4max < value ≤ s3max → 3分
 * s5max < value ≤ s4max → 4分
 * value ≤ s5max       → 5分
 */
export interface DescendingScoreRow {
  ageGroup: AgeGroup;
  gender: Gender;
  s1max: number; // 1分上限（含）
  s2max: number; // 2分上限（含）
  s3max: number; // 3分上限（含）
  s4max: number; // 4分上限（含）
  s5max: number; // 5分上限（含，即 ≤ 此值得5分）
}
