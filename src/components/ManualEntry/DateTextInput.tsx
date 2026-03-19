/**
 * DateTextInput — 带自动格式化和清空按钮的日期文本输入组件
 *
 * - 用户只需输入数字，组件自动在第 4、6 位后插入 "-"
 * - 右侧显示清空按钮（仅当字段有值时）
 * - 使用 useController 保持与 react-hook-form 的受控集成
 */

import { useController, type Control, type FieldPath, type FieldValues } from "react-hook-form";
import { X } from "lucide-react";
import { Input } from "@/components/ui/input";

// ─── 格式化函数 ───────────────────────────────────────────────────────────────

/**
 * 将原始字符串中的数字提取并格式化为 YYYY-MM-DD。
 * 不足 8 位时仅插入已确定的分隔符，不补零。
 *
 * 示例：
 *   "19900520"  → "1990-05-20"
 *   "199005"    → "1990-05"
 *   "1990"      → "1990"
 */
function formatDateDigits(input: string): string {
  const d = input.replace(/\D/g, "").slice(0, 8);
  if (d.length >= 7) return `${d.slice(0, 4)}-${d.slice(4, 6)}-${d.slice(6)}`;
  if (d.length >= 5) return `${d.slice(0, 4)}-${d.slice(4)}`;
  return d;
}

// ─── 组件 ─────────────────────────────────────────────────────────────────────

interface Props<T extends FieldValues> {
  name: FieldPath<T>;
  control: Control<T>;
  id?: string;
  placeholder?: string;
}

export function DateTextInput<T extends FieldValues>({
  name,
  control,
  id,
  placeholder,
}: Props<T>) {
  const { field } = useController({ name, control });

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    field.onChange(formatDateDigits(e.target.value));
  }

  function handleClear() {
    field.onChange("");
  }

  return (
    <div className="relative">
      <Input
        id={id}
        value={field.value ?? ""}
        onChange={handleChange}
        onBlur={field.onBlur}
        name={field.name}
        ref={field.ref}
        placeholder={placeholder}
        autoComplete="off"
        inputMode="numeric"
        className={field.value ? "pr-8" : ""}
      />
      {field.value && (
        <button
          type="button"
          onClick={handleClear}
          tabIndex={-1}
          aria-label="清空"
          className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
}
