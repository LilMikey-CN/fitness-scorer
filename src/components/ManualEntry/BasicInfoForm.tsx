/**
 * 手动录入 — 步骤一：基本信息
 *
 * 日期字段使用 type="text" 而非 type="date"，避免 WebKit（Tauri macOS）
 * 在 value="" 时仍显示当前日期的默认行为。
 */

import { useForm } from "react-hook-form";
import { DateTextInput } from "./DateTextInput";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// ─── 工具函数 ─────────────────────────────────────────────────────────────────

/** 仅当字符串为完整的 YYYY-MM-DD 且能被 Date 解析时返回 true */
function isValidDate(s: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(s) && !isNaN(new Date(s).getTime());
}

export function computeAge(birthDate: string, testDate: string): number {
  const birth = new Date(birthDate);
  const test = new Date(testDate);
  let age = test.getFullYear() - birth.getFullYear();
  const thisYearBirthday = new Date(
    test.getFullYear(),
    birth.getMonth(),
    birth.getDate()
  );
  if (test < thisYearBirthday) age -= 1;
  return age;
}

// ─── Schema ───────────────────────────────────────────────────────────────────

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

const schema = z
  .object({
    name: z.string().optional(),
    gender: z.enum(["1", "0"]),
    birthDate: z
      .string()
      .min(1, "请输入出生日期")
      .regex(DATE_PATTERN, "格式须为 YYYY-MM-DD，例：1990-05-20")
      .refine(isValidDate, "请输入合法日期"),
    testDate: z
      .string()
      .min(1, "请输入测试日期")
      .regex(DATE_PATTERN, "格式须为 YYYY-MM-DD，例：2026-03-19")
      .refine(isValidDate, "请输入合法日期"),
  })
  .superRefine((data, ctx) => {
    // 两个字段通过各自的 refine 后，才做跨字段校验
    if (!isValidDate(data.birthDate) || !isValidDate(data.testDate)) return;

    const age = computeAge(data.birthDate, data.testDate);
    if (age < 20 || age > 59) {
      ctx.addIssue({
        code: "custom",
        message: `计算年龄为 ${age} 岁，须在 20–59 岁之间`,
        path: ["birthDate"],
      });
    }
    if (data.testDate < data.birthDate) {
      ctx.addIssue({
        code: "custom",
        message: "测试日期不能早于出生日期",
        path: ["testDate"],
      });
    }
  });

type FormValues = z.infer<typeof schema>;

// ─── 类型导出 ─────────────────────────────────────────────────────────────────

export interface BasicInfo {
  name?: string;
  gender: 0 | 1;
  age: number;
  birthDate: string;
  testDate: string;
}

// ─── 组件 ─────────────────────────────────────────────────────────────────────

interface Props {
  onComplete: (info: BasicInfo) => void;
}

export function BasicInfoForm({ onComplete }: Props) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      gender: undefined,
      birthDate: "",
      testDate: new Date().toISOString().slice(0, 10),
    },
  });

  const birthDate = watch("birthDate");
  const testDate = watch("testDate");
  // 只在两个日期都完整合法时才显示年龄预览
  const age =
    isValidDate(birthDate) && isValidDate(testDate)
      ? computeAge(birthDate, testDate)
      : null;

  function onSubmit(data: FormValues) {
    onComplete({
      name: data.name || undefined,
      gender: Number(data.gender) as 0 | 1,
      age: computeAge(data.birthDate, data.testDate),
      birthDate: data.birthDate,
      testDate: data.testDate,
    });
  }

  return (
    <div className="flex justify-center pt-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>基本信息</CardTitle>
          <CardDescription>步骤 1 / 2 — 填写受测者基本信息</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* 姓名 */}
            <div className="space-y-1.5">
              <Label htmlFor="name">姓名（选填）</Label>
              <Input id="name" placeholder="输入姓名" {...register("name")} />
            </div>

            {/* 性别 */}
            <div className="space-y-1.5">
              <Label htmlFor="gender">
                性别 <span className="text-destructive">*</span>
              </Label>
              <Select
                onValueChange={(v) =>
                  setValue("gender", v as "0" | "1", { shouldValidate: true })
                }
              >
                <SelectTrigger id="gender" className="w-full">
                  <SelectValue placeholder="请选择性别" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">男</SelectItem>
                  <SelectItem value="0">女</SelectItem>
                </SelectContent>
              </Select>
              {errors.gender && (
                <p className="text-sm text-destructive">{errors.gender.message}</p>
              )}
            </div>

            {/* 出生日期 */}
            <div className="space-y-1.5">
              <Label htmlFor="birthDate">
                出生日期 <span className="text-destructive">*</span>
              </Label>
              <DateTextInput
                id="birthDate"
                name="birthDate"
                control={control}
                placeholder="输入数字即可，如：19900520"
              />
              {errors.birthDate && (
                <p className="text-sm text-destructive">
                  {errors.birthDate.message}
                </p>
              )}
            </div>

            {/* 测试日期 */}
            <div className="space-y-1.5">
              <Label htmlFor="testDate">
                测试日期 <span className="text-destructive">*</span>
              </Label>
              <DateTextInput
                id="testDate"
                name="testDate"
                control={control}
                placeholder="输入数字即可，如：20260319"
              />
              {errors.testDate && (
                <p className="text-sm text-destructive">
                  {errors.testDate.message}
                </p>
              )}
            </div>

            {/* 实时年龄提示 */}
            {age !== null && age >= 20 && age <= 59 && (
              <p className="text-sm text-muted-foreground">
                计算年龄：<span className="font-semibold text-foreground">{age} 岁</span>
              </p>
            )}

            <Button type="submit" className="w-full">
              下一步 →
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
