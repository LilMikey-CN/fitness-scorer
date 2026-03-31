/**
 * 手动录入 — 实时评分展示面板
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { AgeGroup, ItemScore, HeightWeightScore, OverallGrade } from "@/types";

// ─── 类型 ─────────────────────────────────────────────────────────────────────

export interface FieldScore {
  label: string;
  score: ItemScore | HeightWeightScore | null; // null = not applicable
  isEmpty: boolean; // true = field not yet filled
}

export interface ScorePanelData {
  ageGroup: AgeGroup;
  isOlder: boolean;
  isMale: boolean;
  fields: FieldScore[];
  totalScore: number | null;
  overallGrade: OverallGrade | null;
  railwayGrade: OverallGrade | null;
  hasZeroScore: boolean;
  warnings: string[];
}

// ─── 分值 Badge ───────────────────────────────────────────────────────────────

function ScoreBadge({
  score,
  isEmpty,
}: {
  score: number | null;
  isEmpty: boolean;
}) {
  if (isEmpty) {
    return (
      <span className="text-xs text-muted-foreground font-mono">—</span>
    );
  }
  if (score === null) {
    return (
      <Badge variant="secondary" className="text-xs">
        不适用
      </Badge>
    );
  }
  if (score === 0) {
    return (
      <Badge variant="destructive" className="text-xs">
        无分
      </Badge>
    );
  }

  const colorMap: Record<number, string> = {
    1: "bg-orange-100 text-orange-700 border-orange-200",
    2: "bg-yellow-100 text-yellow-700 border-yellow-200",
    3: "bg-green-100 text-green-700 border-green-200",
    4: "bg-teal-100 text-teal-700 border-teal-200",
    5: "bg-blue-100 text-blue-700 border-blue-200",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold ${colorMap[score] ?? colorMap[3]}`}
    >
      {score} 分
    </span>
  );
}

// ─── 综合评级 Badge ───────────────────────────────────────────────────────────

function GradeBadge({ grade }: { grade: OverallGrade | null }) {
  if (!grade) return <span className="text-muted-foreground text-sm">—</span>;

  const styleMap: Record<OverallGrade, string> = {
    "一级(优秀)": "bg-blue-100 text-blue-700 border-blue-200",
    "二级(良好)": "bg-teal-100 text-teal-700 border-teal-200",
    "三级(合格)": "bg-green-100 text-green-700 border-green-200",
    "四级(不合格)": "bg-red-100 text-red-700 border-red-200",
  };

  return (
    <span
      className={`inline-flex items-center rounded-md border px-3 py-1 text-sm font-semibold ${styleMap[grade]}`}
    >
      {grade}
    </span>
  );
}

// ─── 主组件 ───────────────────────────────────────────────────────────────────

interface Props {
  data: ScorePanelData | null;
}

export function ScorePanel({ data }: Props) {
  if (!data) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="text-base">实时评分</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">填写测试指标后自动计算得分。</p>
        </CardContent>
      </Card>
    );
  }

  const allFilled = data.fields
    .filter((f) => f.score !== null)
    .every((f) => !f.isEmpty);

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">实时评分</CardTitle>
        <p className="text-xs text-muted-foreground">
          年龄组：{data.ageGroup} 岁 ·{" "}
          {data.isOlder ? "40–59 岁组（7 项）" : "20–39 岁组（9 项）"}
        </p>
      </CardHeader>
      <CardContent className="space-y-2">
        {/* 各项得分 */}
        <div className="space-y-1">
          {data.fields.map((f) => (
            <div
              key={f.label}
              className="flex items-center justify-between py-1"
            >
              <span className="text-sm text-muted-foreground">{f.label}</span>
              <ScoreBadge score={f.score} isEmpty={f.isEmpty} />
            </div>
          ))}
        </div>

        <Separator />

        {/* 总分 */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">总分</span>
          <span className="text-lg font-bold">
            {data.totalScore !== null && allFilled ? (
              <>{data.totalScore} 分</>
            ) : (
              <span className="text-muted-foreground text-sm">待完成</span>
            )}
          </span>
        </div>

        {/* 综合评级（国标） */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">综合评级</span>
          {data.hasZeroScore && allFilled ? (
            <span className="text-xs text-destructive">有项目无分，无法评级</span>
          ) : (
            <GradeBadge grade={allFilled ? data.overallGrade : null} />
          )}
        </div>

        {/* 铁路职工评级 */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">铁路评级</span>
          {data.hasZeroScore && allFilled ? (
            <span className="text-xs text-destructive">有项目无分，无法评级</span>
          ) : (
            <GradeBadge grade={allFilled ? data.railwayGrade : null} />
          )}
        </div>

        {/* 警告信息 */}
        {data.warnings.length > 0 && (
          <>
            <Separator />
            <div className="space-y-1">
              {data.warnings.map((w, i) => (
                <p key={i} className="text-xs text-orange-600">
                  ⚠ {w}
                </p>
              ))}
            </div>
          </>
        )}

        {/* 提示 */}
        {!allFilled && (
          <p className="text-xs text-muted-foreground pt-1">
            填写全部必填项后显示总分和综合评级。
          </p>
        )}
      </CardContent>
    </Card>
  );
}
