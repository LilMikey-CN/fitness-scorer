/**
 * 批量导入模块
 *
 * 流程：选择文件 → processBatch() → 预览表格（前20行）→ 导出结果
 * 文件读取：HTML5 FileReader（无需 Tauri fs 权限）
 * 文件保存：优先使用 Tauri dialog.save() + fs.writeFile()，失败时回退到 Blob 下载
 */

import { useRef, useState, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
} from "@tanstack/react-table";
import { Upload, FileSpreadsheet, Download, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { readWorkbook, processBatch, buildOutputWorkbook, workbookToBuffer } from "@/lib/batchProcessor";
import type { BatchResult } from "@/types";
import type { WorkBook } from "xlsx";

// ─── 行数据类型 ───────────────────────────────────────────────────────────────

interface TableRow {
  rowIndex: number;
  success: boolean;
  error?: string;
  name?: string;
  gender?: 0 | 1;
  age?: number;
  ageGroup?: string;
  heightWeightScore?: number | null;
  lungCapacityScore?: number | null;
  stepIndexScore?: number | null;
  gripStrengthScore?: number | null;
  pushupsScore?: number | null;
  situpsScore?: number | null;
  verticalJumpScore?: number | null;
  sitAndReachScore?: number | null;
  reactionTimeScore?: number | null;
  singleLegStandScore?: number | null;
  totalScore?: number | null;
  overallGrade?: string | null;
  railwayGrade?: string | null;
  warnings?: string[];
  pushupsApplicable?: boolean;
  situpsApplicable?: boolean;
  verticalJumpApplicable?: boolean;
}

function toTableRow(row: BatchResult["rows"][number]): TableRow {
  const base: TableRow = { rowIndex: row.rowIndex, success: row.success, error: row.error };
  if (!row.success || !row.result) return base;
  const r = row.result;
  return {
    ...base,
    name: r.input.name,
    gender: r.input.gender,
    age: r.input.age,
    ageGroup: r.ageGroup,
    heightWeightScore: r.heightWeightScore,
    lungCapacityScore: r.lungCapacityScore,
    stepIndexScore: r.stepIndexScore,
    gripStrengthScore: r.gripStrengthScore,
    pushupsScore: r.pushupsScore,
    situpsScore: r.situpsScore,
    verticalJumpScore: r.verticalJumpScore,
    sitAndReachScore: r.sitAndReachScore,
    reactionTimeScore: r.reactionTimeScore,
    singleLegStandScore: r.singleLegStandScore,
    totalScore: r.totalScore,
    overallGrade: r.overallGrade,
    railwayGrade: r.railwayGrade,
    warnings: r.warnings,
    pushupsApplicable: r.pushupsApplicable,
    situpsApplicable: r.situpsApplicable,
    verticalJumpApplicable: r.verticalJumpApplicable,
  };
}

// ─── 单元格渲染辅助 ───────────────────────────────────────────────────────────

const SCORE_COLORS: Record<number, string> = {
  1: "text-orange-600",
  2: "text-yellow-600",
  3: "text-green-600",
  4: "text-teal-600",
  5: "text-blue-600",
};

const GRADE_STYLES: Record<string, string> = {
  "一级(优秀)": "bg-blue-100 text-blue-700",
  "二级(良好)": "bg-teal-100 text-teal-700",
  "三级(合格)": "bg-green-100 text-green-700",
  "四级(不合格)": "bg-red-100 text-red-700",
};

function ScoreCell({ score }: { score: number | null | undefined }) {
  if (score === undefined) return null;
  if (score === null) return <span className="text-muted-foreground">—</span>;
  if (score === 0) return <span className="text-xs text-muted-foreground">无分</span>;
  return (
    <span className={`text-xs font-semibold ${SCORE_COLORS[score] ?? ""}`}>
      {score}
    </span>
  );
}

function GradeCell({ grade }: { grade: string | null | undefined }) {
  if (!grade) return <span className="text-muted-foreground text-xs">—</span>;
  return (
    <span className={`rounded px-1.5 py-0.5 text-xs font-medium ${GRADE_STYLES[grade] ?? ""}`}>
      {grade}
    </span>
  );
}

// ─── 列定义 ───────────────────────────────────────────────────────────────────

const ch = createColumnHelper<TableRow>();

const COLUMNS = [
  ch.accessor("rowIndex", {
    header: "行",
    size: 48,
    cell: (i) => <span className="text-xs text-muted-foreground">{i.getValue()}</span>,
  }),
  ch.accessor("success", {
    header: "状态",
    size: 52,
    cell: (i) =>
      i.getValue() ? (
        <CheckCircle2 className="h-4 w-4 text-green-600 mx-auto" />
      ) : (
        <AlertCircle className="h-4 w-4 text-destructive mx-auto" />
      ),
  }),
  ch.accessor("name", {
    header: "姓名",
    size: 72,
    cell: (i) => <span className="text-xs">{i.getValue() || "—"}</span>,
  }),
  ch.accessor("gender", {
    header: "性别",
    size: 48,
    cell: (i) => {
      const v = i.getValue();
      return <span className="text-xs">{v === 1 ? "男" : v === 0 ? "女" : "—"}</span>;
    },
  }),
  ch.accessor("age", {
    header: "年龄",
    size: 48,
    cell: (i) => <span className="text-xs">{i.getValue() ?? "—"}</span>,
  }),
  ch.accessor("ageGroup", {
    header: "年龄组",
    size: 72,
    cell: (i) => <span className="text-xs">{i.getValue() ? `${i.getValue()}岁` : "—"}</span>,
  }),
  ch.display({
    id: "heightWeight",
    header: "身高体重",
    size: 72,
    cell: (i) => {
      const row = i.row.original;
      if (!row.success) return null;
      return <ScoreCell score={row.heightWeightScore} />;
    },
  }),
  ch.display({
    id: "lungCapacity",
    header: "肺活量",
    size: 64,
    cell: (i) => {
      const row = i.row.original;
      if (!row.success) return null;
      return <ScoreCell score={row.lungCapacityScore} />;
    },
  }),
  ch.display({
    id: "stepIndex",
    header: "台阶指数",
    size: 72,
    cell: (i) => {
      const row = i.row.original;
      if (!row.success) return null;
      return <ScoreCell score={row.stepIndexScore} />;
    },
  }),
  ch.display({
    id: "gripStrength",
    header: "握力",
    size: 56,
    cell: (i) => {
      const row = i.row.original;
      if (!row.success) return null;
      return <ScoreCell score={row.gripStrengthScore} />;
    },
  }),
  ch.display({
    id: "pushups",
    header: "俯卧撑",
    size: 64,
    cell: (i) => {
      const row = i.row.original;
      if (!row.success) return null;
      if (!row.pushupsApplicable) return <span className="text-muted-foreground text-xs">N/A</span>;
      return <ScoreCell score={row.pushupsScore} />;
    },
  }),
  ch.display({
    id: "situps",
    header: "仰卧起坐",
    size: 72,
    cell: (i) => {
      const row = i.row.original;
      if (!row.success) return null;
      if (!row.situpsApplicable) return <span className="text-muted-foreground text-xs">N/A</span>;
      return <ScoreCell score={row.situpsScore} />;
    },
  }),
  ch.display({
    id: "verticalJump",
    header: "纵跳",
    size: 56,
    cell: (i) => {
      const row = i.row.original;
      if (!row.success) return null;
      if (!row.verticalJumpApplicable) return <span className="text-muted-foreground text-xs">N/A</span>;
      return <ScoreCell score={row.verticalJumpScore} />;
    },
  }),
  ch.display({
    id: "sitAndReach",
    header: "坐位体前屈",
    size: 80,
    cell: (i) => {
      const row = i.row.original;
      if (!row.success) return null;
      return <ScoreCell score={row.sitAndReachScore} />;
    },
  }),
  ch.display({
    id: "reactionTime",
    header: "选择反应时",
    size: 80,
    cell: (i) => {
      const row = i.row.original;
      if (!row.success) return null;
      return <ScoreCell score={row.reactionTimeScore} />;
    },
  }),
  ch.display({
    id: "singleLegStand",
    header: "闭眼单脚",
    size: 72,
    cell: (i) => {
      const row = i.row.original;
      if (!row.success) return null;
      return <ScoreCell score={row.singleLegStandScore} />;
    },
  }),
  ch.accessor("totalScore", {
    header: "总分",
    size: 56,
    cell: (i) => {
      const v = i.getValue();
      if (v === undefined || v === null) return <span className="text-muted-foreground">—</span>;
      return <span className="text-xs font-semibold">{v}</span>;
    },
  }),
  ch.display({
    id: "overallGrade",
    header: "综合评级",
    size: 96,
    cell: (i) => {
      const row = i.row.original;
      if (!row.success) return null;
      return <GradeCell grade={row.overallGrade} />;
    },
  }),
  ch.display({
    id: "railwayGrade",
    header: "铁路评级",
    size: 96,
    cell: (i) => {
      const row = i.row.original;
      if (!row.success) return null;
      return <GradeCell grade={row.railwayGrade} />;
    },
  }),
  ch.display({
    id: "remarks",
    header: "备注",
    size: 200,
    cell: (i) => {
      const row = i.row.original;
      const text = row.error || row.warnings?.join("；") || "";
      return text ? (
        <span className="text-xs text-orange-600">{text}</span>
      ) : null;
    },
  }),
];

// ─── 保存文件（Tauri native → Blob 回退） ────────────────────────────────────

async function saveFile(data: Uint8Array, defaultName: string): Promise<void> {
  // 尝试 Tauri native dialog.save()
  if (typeof window !== "undefined" && "__TAURI_INTERNALS__" in window) {
    try {
      const { save } = await import("@tauri-apps/plugin-dialog");
      const { writeFile } = await import("@tauri-apps/plugin-fs");
      const path = await save({
        defaultPath: defaultName,
        filters: [{ name: "Excel 工作簿", extensions: ["xlsx"] }],
      });
      if (path) {
        await writeFile(path, data);
        return;
      }
      // 用户取消了对话框，不执行回退
      return;
    } catch {
      // 权限或其他错误 → 回退到 Blob 下载
    }
  }
  // Blob 下载回退
  const blob = new Blob([data], { type: "application/octet-stream" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = defaultName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 100);
}

// ─── 主组件 ───────────────────────────────────────────────────────────────────

type Status = "idle" | "loading" | "ready" | "exporting";

export default function BatchImport() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [fileName, setFileName] = useState("");
  const [batchResult, setBatchResult] = useState<BatchResult | null>(null);
  const [originalWorkbook, setOriginalWorkbook] = useState<WorkBook | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [exportDone, setExportDone] = useState(false);

  // 转换为表格行，最多显示 20 行
  const tableData = useMemo<TableRow[]>(() => {
    if (!batchResult) return [];
    return batchResult.rows.slice(0, 20).map(toTableRow);
  }, [batchResult]);

  const table = useReactTable({
    data: tableData,
    columns: COLUMNS,
    getCoreRowModel: getCoreRowModel(),
  });

  // ── 选择文件 ────────────────────────────────────────────────────────────────

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = ""; // 允许重复选择同一文件

    setStatus("loading");
    setFileName(file.name);
    setLoadError(null);
    setBatchResult(null);
    setExportDone(false);

    try {
      const buffer = await file.arrayBuffer();
      // 让 React 先渲染 loading 状态
      await new Promise((r) => setTimeout(r, 0));
      const wb = readWorkbook(buffer);
      const result = processBatch(wb);
      setOriginalWorkbook(wb);
      setBatchResult(result);
      setStatus("ready");
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : "文件解析失败");
      setStatus("idle");
    }
  }

  // ── 导出结果 ────────────────────────────────────────────────────────────────

  async function handleExport() {
    if (!batchResult || !originalWorkbook) return;
    setStatus("exporting");
    setExportDone(false);
    try {
      const outputWb = buildOutputWorkbook(originalWorkbook, batchResult);
      const buffer = workbookToBuffer(outputWb);
      const defaultName = `评分结果_${fileName.replace(/\.[^.]+$/, "")}_${new Date()
        .toISOString()
        .slice(0, 10)}.xlsx`;
      await saveFile(buffer, defaultName);
      setExportDone(true);
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : "导出失败");
    } finally {
      setStatus("ready");
    }
  }

  // ── 渲染 ────────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-4">
      {/* 操作栏 */}
      <div className="flex items-center gap-3 flex-wrap">
        <Button
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={status === "loading" || status === "exporting"}
          className="gap-2"
        >
          <Upload className="h-4 w-4" />
          选择文件
        </Button>

        {batchResult && (
          <Button
            onClick={handleExport}
            disabled={status === "exporting"}
            className="gap-2"
          >
            {status === "exporting" ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Download className="h-4 w-4" />
            )}
            导出结果 (.xlsx)
          </Button>
        )}

        {fileName && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <FileSpreadsheet className="h-4 w-4 shrink-0" />
            <span className="max-w-xs truncate">{fileName}</span>
          </div>
        )}

        {exportDone && (
          <span className="text-sm text-green-600 flex items-center gap-1">
            <CheckCircle2 className="h-4 w-4" /> 导出成功
          </span>
        )}
      </div>

      {/* 隐藏文件输入 */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".xlsx,.xls,.csv"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* 加载中 */}
      {status === "loading" && (
        <div className="flex items-center gap-3 rounded-lg border bg-muted/30 px-4 py-6 justify-center">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          <span className="text-sm text-muted-foreground">正在解析并评分…</span>
        </div>
      )}

      {/* 错误提示 */}
      {loadError && (
        <div className="flex items-center gap-2 rounded-lg border border-destructive/40 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {loadError}
        </div>
      )}

      {/* 空状态 */}
      {status === "idle" && !loadError && (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16 gap-3">
          <FileSpreadsheet className="h-10 w-10 text-muted-foreground/50" />
          <p className="text-sm text-muted-foreground">点击「选择文件」导入 .xlsx / .xls / .csv</p>
          <p className="text-xs text-muted-foreground/70">字段格式参见批量文件规范</p>
        </div>
      )}

      {/* 结果区域 */}
      {status === "ready" && batchResult && (
        <div className="space-y-3">
          {/* 统计摘要 */}
          <Card>
            <CardHeader className="pb-2 pt-3">
              <CardTitle className="text-sm font-medium">处理结果</CardTitle>
            </CardHeader>
            <CardContent className="pb-3">
              <div className="flex items-center gap-6 text-sm">
                <span>
                  共 <strong>{batchResult.total}</strong> 行
                </span>
                <Separator orientation="vertical" className="h-4" />
                <span className="flex items-center gap-1 text-green-700">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  成功 <strong>{batchResult.succeeded}</strong>
                </span>
                {batchResult.failed > 0 && (
                  <>
                    <Separator orientation="vertical" className="h-4" />
                    <span className="flex items-center gap-1 text-destructive">
                      <AlertCircle className="h-3.5 w-3.5" />
                      失败 <strong>{batchResult.failed}</strong>
                    </span>
                  </>
                )}
                {batchResult.total > 20 && (
                  <>
                    <Separator orientation="vertical" className="h-4" />
                    <span className="text-muted-foreground text-xs">
                      仅预览前 20 行，导出包含全部结果
                    </span>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* 预览表格 */}
          <div className="rounded-lg border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  {table.getHeaderGroups().map((hg) => (
                    <tr key={hg.id} className="bg-muted/60 border-b">
                      {hg.headers.map((header) => (
                        <th
                          key={header.id}
                          className="px-2 py-2 text-left text-xs font-medium text-muted-foreground whitespace-nowrap"
                          style={{ width: header.getSize(), minWidth: header.getSize() }}
                        >
                          {flexRender(header.column.columnDef.header, header.getContext())}
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody>
                  {table.getRowModel().rows.map((row) => {
                    const isError = !row.original.success;
                    return (
                      <tr
                        key={row.id}
                        className={`border-b last:border-0 ${
                          isError
                            ? "bg-red-50 dark:bg-red-950/20"
                            : "hover:bg-muted/30"
                        }`}
                      >
                        {row.getVisibleCells().map((cell) => (
                          <td
                            key={cell.id}
                            className="px-2 py-1.5 text-center align-middle"
                            style={{ width: cell.column.getSize(), minWidth: cell.column.getSize() }}
                          >
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {tableData.length === 0 && (
              <div className="py-8 text-center text-sm text-muted-foreground">
                文件中没有有效数据行
              </div>
            )}
          </div>

          {/* 评分说明 */}
          <div className="flex flex-wrap gap-2 items-center text-xs text-muted-foreground">
            <span>得分颜色：</span>
            {([1, 2, 3, 4, 5] as const).map((s) => (
              <Badge
                key={s}
                variant="outline"
                className={`text-xs ${SCORE_COLORS[s]}`}
              >
                {s} 分
              </Badge>
            ))}
            <span className="ml-2">失败行</span>
            <span className="inline-block w-4 h-3 rounded-sm bg-red-100 border border-red-200" />
          </div>
        </div>
      )}
    </div>
  );
}
