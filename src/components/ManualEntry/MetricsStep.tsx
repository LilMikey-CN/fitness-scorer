/**
 * 手动录入 — 步骤二：指标录入 + 实时评分
 *
 * 布局：左侧表单（3/5）+ 右侧评分面板（2/5）
 * 规则：根据 gender × ageGroup 动态显示/隐藏字段
 */

import { useMemo } from "react";
import { useForm, useWatch } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  getAgeGroup,
  isOlderGroup,
  scoreHW,
  lookupAscending,
  lookupDescending,
  scorePerson,
} from "@/lib/scorer";
import {
  LUNG_CAPACITY,
  STEP_INDEX,
  GRIP_STRENGTH,
  PUSHUPS,
  SITUPS,
  VERTICAL_JUMP,
  SIT_AND_REACH,
  REACTION_TIME,
  SINGLE_LEG_STAND,
} from "@/data/scoringTables";
import type { AgeGroup, Gender, ItemScore, HeightWeightScore } from "@/types";
import { ScorePanel, type FieldScore, type ScorePanelData } from "./ScorePanel";
import type { BasicInfo } from "./BasicInfoForm";

// ─── 表单字段类型（全部 number，空值为 NaN） ──────────────────────────────────

interface MetricValues {
  height: number;
  weight: number;
  lungCapacity: number;
  stepIndex: number;
  gripStrength: number;
  pushups: number;
  situps: number;
  verticalJump: number;
  sitAndReach: number;
  reactionTime: number;
  singleLegStand: number;
}

// ─── 实时评分计算 ─────────────────────────────────────────────────────────────

function computeScorePanelData(
  basicInfo: BasicInfo,
  values: Partial<MetricValues>,
  ageGroup: AgeGroup,
  isOlder: boolean,
  isMale: boolean
): ScorePanelData {
  const gender = basicInfo.gender as Gender;

  // Return null if value is NaN or undefined (field not filled)
  const valid = (v: number | undefined): number | null =>
    v === undefined || isNaN(v) ? null : v;

  const h = valid(values.height);
  const w = valid(values.weight);
  const lc = valid(values.lungCapacity);
  const si = valid(values.stepIndex);
  const gs = valid(values.gripStrength);
  const pu = valid(values.pushups);
  const su = valid(values.situps);
  const vj = valid(values.verticalJump);
  const sar = valid(values.sitAndReach);
  const rt = valid(values.reactionTime);
  const sls = valid(values.singleLegStand);

  // Per-field scores (undefined = not yet computed)
  const hwScore: HeightWeightScore | null | undefined =
    h !== null && w !== null ? scoreHW(h, w, gender, ageGroup) : undefined;

  const lcScore: ItemScore | undefined =
    lc !== null ? lookupAscending(LUNG_CAPACITY, ageGroup, gender, lc) : undefined;

  const siScore: ItemScore | undefined =
    si !== null ? lookupAscending(STEP_INDEX, ageGroup, gender, si) : undefined;

  const gsScore: ItemScore | undefined =
    gs !== null ? lookupAscending(GRIP_STRENGTH, ageGroup, gender, gs) : undefined;

  const puScore: ItemScore | undefined =
    !isOlder && isMale && pu !== null
      ? lookupAscending(PUSHUPS, ageGroup, gender, pu)
      : undefined;

  const suScore: ItemScore | undefined =
    !isOlder && !isMale && su !== null
      ? lookupAscending(SITUPS, ageGroup, gender, su)
      : undefined;

  const vjScore: ItemScore | undefined =
    !isOlder && vj !== null
      ? lookupAscending(VERTICAL_JUMP, ageGroup, gender, vj)
      : undefined;

  const sarScore: ItemScore | undefined =
    sar !== null
      ? lookupAscending(SIT_AND_REACH, ageGroup, gender, sar)
      : undefined;

  const rtScore: ItemScore | undefined =
    rt !== null ? lookupDescending(REACTION_TIME, ageGroup, gender, rt) : undefined;

  const slsScore: ItemScore | undefined =
    sls !== null
      ? lookupAscending(SINGLE_LEG_STAND, ageGroup, gender, sls)
      : undefined;

  const fields: FieldScore[] = [
    { label: "身高标准体重", score: hwScore ?? null, isEmpty: hwScore === undefined },
    { label: "肺活量", score: lcScore ?? null, isEmpty: lcScore === undefined },
    { label: "台阶指数", score: siScore ?? null, isEmpty: siScore === undefined },
    { label: "握力", score: gsScore ?? null, isEmpty: gsScore === undefined },
    ...(!isOlder && isMale
      ? [{ label: "俯卧撑", score: puScore ?? null, isEmpty: puScore === undefined }]
      : []),
    ...(!isOlder && !isMale
      ? [{ label: "仰卧起坐", score: suScore ?? null, isEmpty: suScore === undefined }]
      : []),
    ...(!isOlder
      ? [{ label: "纵跳", score: vjScore ?? null, isEmpty: vjScore === undefined }]
      : []),
    { label: "坐位体前屈", score: sarScore ?? null, isEmpty: sarScore === undefined },
    { label: "选择反应时", score: rtScore ?? null, isEmpty: rtScore === undefined },
    { label: "闭眼单脚站立", score: slsScore ?? null, isEmpty: slsScore === undefined },
  ];

  // Only compute total + grade when ALL required fields are valid
  const requiredFilled =
    h !== null &&
    w !== null &&
    lc !== null &&
    si !== null &&
    gs !== null &&
    sar !== null &&
    rt !== null &&
    sls !== null &&
    (!(!isOlder && isMale) || pu !== null) &&
    (!(!isOlder && !isMale) || su !== null) &&
    (!(!isOlder) || vj !== null);

  let totalScore: number | null = null;
  let overallGrade = null;
  let railwayGrade = null;
  let hasZeroScore = false;
  let warnings: string[] = [];

  if (requiredFilled) {
    try {
      const result = scorePerson({
        name: basicInfo.name,
        gender,
        age: basicInfo.age,
        height: h!,
        weight: w!,
        lungCapacity: lc!,
        stepIndex: si!,
        gripStrength: gs!,
        pushups: !isOlder && isMale ? pu : null,
        situps: !isOlder && !isMale ? su : null,
        verticalJump: !isOlder ? vj : null,
        sitAndReach: sar!,
        reactionTime: rt!,
        singleLegStand: sls!,
      });
      totalScore = result.totalScore;
      overallGrade = result.overallGrade;
      railwayGrade = result.railwayGrade;
      hasZeroScore =
        result.overallGrade === null &&
        (result.heightWeightScore === null ||
          [
            result.lungCapacityScore,
            result.stepIndexScore,
            result.gripStrengthScore,
            result.sitAndReachScore,
            result.reactionTimeScore,
            result.singleLegStandScore,
          ].some((s) => s === 0));
      warnings = result.warnings;
    } catch {
      // scoring errors are ignored (e.g., out-of-range)
    }
  }

  return { ageGroup, isOlder, isMale, fields, totalScore, overallGrade, railwayGrade, hasZeroScore, warnings };
}

// ─── 单行表单项 ───────────────────────────────────────────────────────────────

function scoreColor(score: number | null | undefined, isEmpty: boolean): string {
  if (isEmpty || score === undefined) return "";
  if (score === 0) return "text-destructive";
  const map: Record<number, string> = {
    1: "text-orange-600",
    2: "text-yellow-600",
    3: "text-green-600",
    4: "text-teal-600",
    5: "text-blue-600",
  };
  return (score !== null ? map[score] : undefined) ?? "";
}

interface MetricRowProps {
  id: string;
  label: string;
  unit: string;
  placeholder?: string;
  error?: string;
  score?: number | null;
  isEmpty?: boolean;
  inputProps: React.InputHTMLAttributes<HTMLInputElement> & {
    name: string;
    ref: React.Ref<HTMLInputElement>;
    onChange: React.ChangeEventHandler<HTMLInputElement>;
    onBlur: React.FocusEventHandler<HTMLInputElement>;
  };
}

function MetricRow({
  id,
  label,
  unit,
  placeholder,
  error,
  score,
  isEmpty = true,
  inputProps,
}: MetricRowProps) {
  const scoreLabel =
    !isEmpty && score !== undefined
      ? score === 0
        ? "无分"
        : score === null
        ? null
        : `${score} 分`
      : null;

  return (
    <div className="space-y-1">
      <div className="flex items-center gap-3">
        <Label htmlFor={id} className="w-28 shrink-0 text-sm leading-none">
          {label}
        </Label>
        <div className="relative flex-1">
          <Input
            id={id}
            type="number"
            placeholder={placeholder}
            className="pr-14"
            {...inputProps}
          />
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
            {unit}
          </span>
        </div>
        <div className="w-10 text-right shrink-0">
          {scoreLabel !== null && (
            <span className={`text-xs font-semibold ${scoreColor(score, isEmpty)}`}>
              {scoreLabel}
            </span>
          )}
        </div>
      </div>
      {error && (
        <p className="text-xs text-destructive pl-[7.5rem]">{error}</p>
      )}
    </div>
  );
}

// ─── validate helpers ─────────────────────────────────────────────────────────

const v = {
  num: (msg = "请输入数字") =>
    (val: number) => isNaN(val) ? msg : true,
  min: (min: number, msg?: string) =>
    (val: number) => !isNaN(val) && val < min ? (msg ?? `≥ ${min}`) : true,
  max: (max: number, msg?: string) =>
    (val: number) => !isNaN(val) && val > max ? (msg ?? `≤ ${max}`) : true,
  int: (msg = "须为整数") =>
    (val: number) => !isNaN(val) && !Number.isInteger(val) ? msg : true,
};

// ─── 主组件 ───────────────────────────────────────────────────────────────────

interface Props {
  basicInfo: BasicInfo;
  onBack: () => void;
}

export function MetricsStep({ basicInfo, onBack }: Props) {
  const ageGroup = getAgeGroup(basicInfo.age) as AgeGroup;
  const isOlder = isOlderGroup(ageGroup);
  const isMale = basicInfo.gender === 1;

  const {
    register,
    control,
    formState: { errors },
  } = useForm<MetricValues>();

  const values = useWatch({ control });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const scorePanelData = useMemo(
    () => computeScorePanelData(basicInfo, values as Partial<MetricValues>, ageGroup, isOlder, isMale),
    // JSON.stringify ensures deep comparison of form values object
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [JSON.stringify(values), basicInfo.gender, basicInfo.age]
  );

  const field = (label: string) =>
    scorePanelData.fields.find((f) => f.label === label);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const reg = (name: keyof MetricValues, extra: Record<string, any> = {}) =>
    register(name, { valueAsNumber: true, ...extra } as Parameters<typeof register>[1]);

  return (
    <div className="space-y-4">
      {/* 基本信息摘要条 */}
      <div className="flex items-center gap-3 rounded-lg border bg-muted/40 px-4 py-2 text-sm">
        <button
          type="button"
          onClick={onBack}
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          ← 返回
        </button>
        <Separator orientation="vertical" className="h-4" />
        {basicInfo.name && <span className="font-medium">{basicInfo.name}</span>}
        <span>{isMale ? "男" : "女"}</span>
        <span>{basicInfo.age} 岁</span>
        <span className="text-muted-foreground">（{ageGroup} 岁组）</span>
        <span className="ml-auto text-muted-foreground">测试日期：{basicInfo.testDate}</span>
      </div>

      {/* 主体：左侧表单 + 右侧评分 */}
      <div className="grid grid-cols-5 gap-6">
        {/* ── 左侧：指标输入 ────────────────────────────── */}
        <div className="col-span-3">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">步骤 2 / 2 — 填写测试指标</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              {/* 形态 */}
              <section className="space-y-3">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  形态指标
                </p>
                <MetricRow
                  id="height"
                  label="身高"
                  unit="cm"
                  placeholder="如 170.0"
                  error={errors.height?.message}
                  score={field("身高标准体重")?.score}
                  isEmpty={field("身高标准体重")?.isEmpty}
                  inputProps={reg("height", {
                    validate: {
                      num: v.num(),
                      min: v.min(130, "≥ 130 cm"),
                      max: v.max(220, "≤ 220 cm"),
                    },
                  })}
                />
                {/* 体重不单独显示分数（与身高合计为身高标准体重） */}
                <MetricRow
                  id="weight"
                  label="体重"
                  unit="kg"
                  placeholder="如 65.5"
                  error={errors.weight?.message}
                  inputProps={reg("weight", {
                    validate: {
                      num: v.num(),
                      min: v.min(20, "≥ 20 kg"),
                      max: v.max(200, "≤ 200 kg"),
                    },
                  })}
                />
              </section>

              <Separator />

              {/* 机能 */}
              <section className="space-y-3">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  机能指标
                </p>
                <MetricRow
                  id="lungCapacity"
                  label="肺活量"
                  unit="mL"
                  placeholder="如 3800"
                  error={errors.lungCapacity?.message}
                  score={field("肺活量")?.score}
                  isEmpty={field("肺活量")?.isEmpty}
                  inputProps={reg("lungCapacity", {
                    validate: {
                      num: v.num(),
                      int: v.int("须为整数（mL）"),
                      min: v.min(500, "≥ 500 mL"),
                      max: v.max(10000, "≤ 10000 mL"),
                    },
                  })}
                />
                <MetricRow
                  id="stepIndex"
                  label="台阶指数"
                  unit=""
                  placeholder="如 55.2"
                  error={errors.stepIndex?.message}
                  score={field("台阶指数")?.score}
                  isEmpty={field("台阶指数")?.isEmpty}
                  inputProps={reg("stepIndex", {
                    validate: {
                      num: v.num(),
                      min: v.min(10, "≥ 10"),
                      max: v.max(150, "≤ 150"),
                    },
                  })}
                />
              </section>

              <Separator />

              {/* 体能 */}
              <section className="space-y-3">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  体能指标
                </p>
                <MetricRow
                  id="gripStrength"
                  label="握力"
                  unit="kg"
                  placeholder="如 46.5"
                  error={errors.gripStrength?.message}
                  score={field("握力")?.score}
                  isEmpty={field("握力")?.isEmpty}
                  inputProps={reg("gripStrength", {
                    validate: {
                      num: v.num(),
                      min: v.min(1, "≥ 1 kg"),
                      max: v.max(150, "≤ 150 kg"),
                    },
                  })}
                />
                {!isOlder && isMale && (
                  <MetricRow
                    id="pushups"
                    label="俯卧撑"
                    unit="次"
                    placeholder="如 20"
                    error={errors.pushups?.message}
                    score={field("俯卧撑")?.score}
                    isEmpty={field("俯卧撑")?.isEmpty}
                    inputProps={reg("pushups", {
                      validate: {
                        num: v.num(),
                        int: v.int(),
                        min: v.min(0, "≥ 0 次"),
                        max: v.max(300, "≤ 300 次"),
                      },
                    })}
                  />
                )}
                {!isOlder && !isMale && (
                  <MetricRow
                    id="situps"
                    label="仰卧起坐"
                    unit="次/分"
                    placeholder="如 18"
                    error={errors.situps?.message}
                    score={field("仰卧起坐")?.score}
                    isEmpty={field("仰卧起坐")?.isEmpty}
                    inputProps={reg("situps", {
                      validate: {
                        num: v.num(),
                        int: v.int(),
                        min: v.min(0, "≥ 0 次"),
                        max: v.max(200, "≤ 200 次"),
                      },
                    })}
                  />
                )}
                {!isOlder && (
                  <MetricRow
                    id="verticalJump"
                    label="纵跳"
                    unit="cm"
                    placeholder="如 35.5"
                    error={errors.verticalJump?.message}
                    score={field("纵跳")?.score}
                    isEmpty={field("纵跳")?.isEmpty}
                    inputProps={reg("verticalJump", {
                      validate: {
                        num: v.num(),
                        min: v.min(1, "≥ 1 cm"),
                        max: v.max(150, "≤ 150 cm"),
                      },
                    })}
                  />
                )}
              </section>

              <Separator />

              {/* 柔韧 / 灵敏 / 平衡 */}
              <section className="space-y-3">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  柔韧 / 灵敏 / 平衡指标
                </p>
                <MetricRow
                  id="sitAndReach"
                  label="坐位体前屈"
                  unit="cm"
                  placeholder="如 8.5（可负值）"
                  error={errors.sitAndReach?.message}
                  score={field("坐位体前屈")?.score}
                  isEmpty={field("坐位体前屈")?.isEmpty}
                  inputProps={reg("sitAndReach", {
                    validate: {
                      num: v.num(),
                      min: v.min(-50, "≥ -50 cm"),
                      max: v.max(80, "≤ 80 cm"),
                    },
                  })}
                />
                <MetricRow
                  id="reactionTime"
                  label="选择反应时"
                  unit="秒"
                  placeholder="如 0.48"
                  error={errors.reactionTime?.message}
                  score={field("选择反应时")?.score}
                  isEmpty={field("选择反应时")?.isEmpty}
                  inputProps={reg("reactionTime", {
                    validate: {
                      num: v.num(),
                      min: v.min(0.1, "≥ 0.1 秒"),
                      max: v.max(5, "≤ 5 秒"),
                    },
                  })}
                />
                <MetricRow
                  id="singleLegStand"
                  label="闭眼单脚站立"
                  unit="秒"
                  placeholder="如 28.5"
                  error={errors.singleLegStand?.message}
                  score={field("闭眼单脚站立")?.score}
                  isEmpty={field("闭眼单脚站立")?.isEmpty}
                  inputProps={reg("singleLegStand", {
                    validate: {
                      num: v.num(),
                      min: v.min(0, "≥ 0 秒"),
                      max: v.max(9999, "≤ 9999 秒"),
                    },
                  })}
                />
              </section>
            </CardContent>
          </Card>
        </div>

        {/* ── 右侧：评分面板 ───────────────────────────── */}
        <div className="col-span-2">
          <ScorePanel data={scorePanelData} />
        </div>
      </div>
    </div>
  );
}
