/**
 * src/lib/validators.ts
 * ──────────────────────────────────────────────────────────────────────────────
 * Zod v4 输入校验 schema（供批量处理使用）
 * ──────────────────────────────────────────────────────────────────────────────
 */

import { z } from 'zod';

export const personInputSchema = z.object({
  name: z.string().optional(),

  gender: z.union([z.literal(0), z.literal(1)], {
    error: '性别须为 1（男）或 0（女）',
  }),

  age: z
    .number({ error: '年龄须为数字' })
    .int('年龄须为整数')
    .min(20, '年龄最小为 20 岁')
    .max(59, '年龄最大为 59 岁'),

  height: z
    .number({ error: '身高须为数字' })
    .min(130, '身高须 ≥ 130 cm')
    .max(220, '身高须 ≤ 220 cm'),

  weight: z
    .number({ error: '体重须为数字' })
    .min(20, '体重须 ≥ 20 kg')
    .max(200, '体重须 ≤ 200 kg'),

  lungCapacity: z
    .number({ error: '肺活量须为数字' })
    .int('肺活量须为整数（毫升）')
    .min(500, '肺活量须 ≥ 500 mL')
    .max(10000, '肺活量须 ≤ 10000 mL'),

  stepIndex: z
    .number({ error: '台阶指数须为数字' })
    .min(10, '台阶指数须 ≥ 10')
    .max(150, '台阶指数须 ≤ 150'),

  gripStrength: z
    .number({ error: '握力须为数字' })
    .min(1, '握力须 ≥ 1 kg')
    .max(150, '握力须 ≤ 150 kg'),

  pushups: z
    .number({ error: '俯卧撑须为数字' })
    .int()
    .min(0, '俯卧撑次数须 ≥ 0')
    .max(300, '俯卧撑次数须 ≤ 300')
    .nullable()
    .optional(),

  situps: z
    .number({ error: '仰卧起坐须为数字' })
    .int()
    .min(0)
    .max(200)
    .nullable()
    .optional(),

  verticalJump: z
    .number({ error: '纵跳须为数字' })
    .min(1, '纵跳须 ≥ 1 cm')
    .max(150, '纵跳须 ≤ 150 cm')
    .nullable()
    .optional(),

  sitAndReach: z
    .number({ error: '坐位体前屈须为数字' })
    .min(-50, '坐位体前屈须 ≥ -50 cm')
    .max(80, '坐位体前屈须 ≤ 80 cm'),

  reactionTime: z
    .number({ error: '选择反应时须为数字' })
    .min(0.1, '选择反应时须 ≥ 0.1 秒')
    .max(5, '选择反应时须 ≤ 5 秒'),

  singleLegStand: z
    .number({ error: '闭眼单脚站立须为数字' })
    .min(0, '闭眼单脚站立须 ≥ 0 秒')
    .max(9999, '闭眼单脚站立须 ≤ 9999 秒'),
});

export type PersonInputForm = z.infer<typeof personInputSchema>;
