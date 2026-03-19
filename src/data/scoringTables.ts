/**
 * src/data/scoringTables.ts
 * ──────────────────────────────────────────────────────────────────────────────
 * 《国民体质测定标准》成年人部分 — 评分查找表
 * 数据来源：国家体育总局群体司，2003年
 *
 * ⚠️  此文件数据来自国家标准，禁止在 UI 上提供编辑入口。
 *     已知原始文档印刷错误的处理方式见各处注释（标记 [ERRATA]）。
 * ──────────────────────────────────────────────────────────────────────────────
 */

import type {
  HeightWeightRow,
  AscendingScoreRow,
  DescendingScoreRow,
} from '../types';

// ═══════════════════════════════════════════════════════════════════════════════
// 一、身高标准体重评分表
//
// 列含义（左→右）：heightMin, heightMax, w1Light(<此值→1分偏轻),
//                  w3Light(<此值→3分轻), w5Max(≤此值→5分正常),
//                  w3Heavy(≤此值→3分重), >w3Heavy→1分偏重
// ═══════════════════════════════════════════════════════════════════════════════

// ───────────────────────────────────────────────────────────────────────────────
// 1-1  20–29 岁男性
// ───────────────────────────────────────────────────────────────────────────────
export const HW_M_20_29: HeightWeightRow[] = [
  { heightMin: 144.0, heightMax: 144.9, w1Light: 36.6, w3Light: 37.7, w5Max: 48.2, w3Heavy: 52.3 },
  { heightMin: 145.0, heightMax: 145.9, w1Light: 37.1, w3Light: 38.2, w5Max: 49.0, w3Heavy: 53.0 },
  { heightMin: 146.0, heightMax: 146.9, w1Light: 37.7, w3Light: 38.7, w5Max: 49.8, w3Heavy: 53.8 },
  { heightMin: 147.0, heightMax: 147.9, w1Light: 38.3, w3Light: 39.3, w5Max: 50.6, w3Heavy: 54.6 },
  { heightMin: 148.0, heightMax: 148.9, w1Light: 38.9, w3Light: 39.8, w5Max: 51.4, w3Heavy: 55.4 },
  { heightMin: 149.0, heightMax: 149.9, w1Light: 39.9, w3Light: 40.5, w5Max: 52.1, w3Heavy: 56.2 },
  { heightMin: 150.0, heightMax: 150.9, w1Light: 40.5, w3Light: 41.2, w5Max: 52.9, w3Heavy: 57.1 },
  { heightMin: 151.0, heightMax: 151.9, w1Light: 41.0, w3Light: 41.8, w5Max: 53.8, w3Heavy: 58.0 },
  { heightMin: 152.0, heightMax: 152.9, w1Light: 41.6, w3Light: 42.5, w5Max: 54.6, w3Heavy: 59.0 },
  { heightMin: 153.0, heightMax: 153.9, w1Light: 42.2, w3Light: 43.3, w5Max: 55.6, w3Heavy: 59.8 },
  { heightMin: 154.0, heightMax: 154.9, w1Light: 42.8, w3Light: 44.1, w5Max: 56.7, w3Heavy: 60.9 },
  { heightMin: 155.0, heightMax: 155.9, w1Light: 43.4, w3Light: 44.8, w5Max: 57.8, w3Heavy: 61.9 },
  { heightMin: 156.0, heightMax: 156.9, w1Light: 44.0, w3Light: 45.5, w5Max: 58.8, w3Heavy: 62.9 },
  { heightMin: 157.0, heightMax: 157.9, w1Light: 44.5, w3Light: 46.1, w5Max: 59.7, w3Heavy: 64.0 },
  { heightMin: 158.0, heightMax: 158.9, w1Light: 45.0, w3Light: 47.0, w5Max: 61.8, w3Heavy: 65.1 },
  { heightMin: 159.0, heightMax: 159.9, w1Light: 45.5, w3Light: 47.7, w5Max: 61.9, w3Heavy: 66.1 },
  { heightMin: 160.0, heightMax: 160.9, w1Light: 46.0, w3Light: 48.6, w5Max: 62.9, w3Heavy: 67.2 },
  { heightMin: 161.0, heightMax: 161.9, w1Light: 46.7, w3Light: 49.3, w5Max: 63.8, w3Heavy: 68.2 },
  { heightMin: 162.0, heightMax: 162.9, w1Light: 47.3, w3Light: 50.2, w5Max: 64.9, w3Heavy: 69.0 },
  { heightMin: 163.0, heightMax: 163.9, w1Light: 47.8, w3Light: 51.1, w5Max: 65.9, w3Heavy: 70.1 },
  { heightMin: 164.0, heightMax: 164.9, w1Light: 48.4, w3Light: 51.7, w5Max: 67.0, w3Heavy: 71.0 },
  { heightMin: 165.0, heightMax: 165.9, w1Light: 48.9, w3Light: 52.3, w5Max: 67.8, w3Heavy: 72.1 },
  { heightMin: 166.0, heightMax: 166.9, w1Light: 49.4, w3Light: 53.1, w5Max: 68.7, w3Heavy: 72.9 },
  { heightMin: 167.0, heightMax: 167.9, w1Light: 49.9, w3Light: 53.7, w5Max: 69.6, w3Heavy: 73.8 },
  // [ERRATA] 168cm行: 原文3分下限"50.0"与1分上限"50.5"矛盾，以w1Light=50.5为准
  { heightMin: 168.0, heightMax: 168.9, w1Light: 50.5, w3Light: 54.4, w5Max: 70.4, w3Heavy: 75.0 },
  { heightMin: 169.0, heightMax: 169.9, w1Light: 51.2, w3Light: 55.1, w5Max: 71.2, w3Heavy: 75.9 },
  { heightMin: 170.0, heightMax: 170.9, w1Light: 52.0, w3Light: 55.8, w5Max: 72.1, w3Heavy: 76.8 },
  { heightMin: 171.0, heightMax: 171.9, w1Light: 52.7, w3Light: 56.7, w5Max: 73.1, w3Heavy: 77.9 },
  { heightMin: 172.0, heightMax: 172.9, w1Light: 53.5, w3Light: 57.6, w5Max: 74.0, w3Heavy: 79.1 },
  { heightMin: 173.0, heightMax: 173.9, w1Light: 54.1, w3Light: 58.4, w5Max: 75.0, w3Heavy: 80.0 },
  { heightMin: 174.0, heightMax: 174.9, w1Light: 54.6, w3Light: 59.3, w5Max: 75.9, w3Heavy: 81.1 },
  { heightMin: 175.0, heightMax: 175.9, w1Light: 55.2, w3Light: 60.1, w5Max: 76.9, w3Heavy: 82.0 },
  { heightMin: 176.0, heightMax: 176.9, w1Light: 55.9, w3Light: 60.9, w5Max: 77.9, w3Heavy: 83.0 },
  { heightMin: 177.0, heightMax: 177.9, w1Light: 56.5, w3Light: 61.4, w5Max: 78.9, w3Heavy: 84.1 },
  { heightMin: 178.0, heightMax: 178.9, w1Light: 57.1, w3Light: 62.2, w5Max: 80.0, w3Heavy: 85.0 },
  { heightMin: 179.0, heightMax: 179.9, w1Light: 57.7, w3Light: 62.8, w5Max: 81.2, w3Heavy: 86.1 },
  { heightMin: 180.0, heightMax: 180.9, w1Light: 58.4, w3Light: 63.4, w5Max: 82.4, w3Heavy: 87.1 },
  { heightMin: 181.0, heightMax: 181.9, w1Light: 58.9, w3Light: 64.3, w5Max: 83.5, w3Heavy: 88.1 },
  { heightMin: 182.0, heightMax: 182.9, w1Light: 59.5, w3Light: 65.0, w5Max: 84.7, w3Heavy: 89.1 },
  { heightMin: 183.0, heightMax: 183.9, w1Light: 60.2, w3Light: 65.8, w5Max: 85.7, w3Heavy: 90.2 },
  { heightMin: 184.0, heightMax: 184.9, w1Light: 60.8, w3Light: 66.5, w5Max: 86.8, w3Heavy: 91.2 },
  { heightMin: 185.0, heightMax: 185.9, w1Light: 61.4, w3Light: 67.2, w5Max: 87.7, w3Heavy: 92.2 },
  { heightMin: 186.0, heightMax: 186.9, w1Light: 62.0, w3Light: 68.0, w5Max: 89.8, w3Heavy: 93.3 },
  // [ERRATA] 187cm行: 5分上限原文"89.7"与186cm"89.8"倒退，疑印刷错误，保留原值
  { heightMin: 187.0, heightMax: 187.9, w1Light: 62.7, w3Light: 68.8, w5Max: 89.7, w3Heavy: 94.4 },
  { heightMin: 188.0, heightMax: 188.9, w1Light: 63.3, w3Light: 69.5, w5Max: 90.8, w3Heavy: 95.5 },
  { heightMin: 189.0, heightMax: 189.9, w1Light: 64.0, w3Light: 70.5, w5Max: 91.7, w3Heavy: 96.6 },
  { heightMin: 190.0, heightMax: 190.9, w1Light: 64.6, w3Light: 71.2, w5Max: 92.7, w3Heavy: 97.7 },
  { heightMin: 191.0, heightMax: 191.9, w1Light: 65.2, w3Light: 72.0, w5Max: 93.8, w3Heavy: 98.7 },
  { heightMin: 192.0, heightMax: 192.9, w1Light: 65.9, w3Light: 73.0, w5Max: 95.0, w3Heavy: 99.8 },
  { heightMin: 193.0, heightMax: 193.9, w1Light: 66.6, w3Light: 73.7, w5Max: 96.2, w3Heavy: 101.0 },
  { heightMin: 194.0, heightMax: 194.9, w1Light: 67.3, w3Light: 74.6, w5Max: 97.4, w3Heavy: 102.1 },
  { heightMin: 195.0, heightMax: 195.9, w1Light: 67.9, w3Light: 75.4, w5Max: 98.5, w3Heavy: 103.3 },
  { heightMin: 196.0, heightMax: 196.9, w1Light: 68.6, w3Light: 76.2, w5Max: 99.6, w3Heavy: 104.5 },
  { heightMin: 197.0, heightMax: 197.9, w1Light: 69.3, w3Light: 77.2, w5Max: 100.7, w3Heavy: 105.7 },
  { heightMin: 198.0, heightMax: 198.9, w1Light: 70.0, w3Light: 78.1, w5Max: 101.8, w3Heavy: 106.8 },
  { heightMin: 199.0, heightMax: 199.9, w1Light: 71.8, w3Light: 79.2, w5Max: 102.6, w3Heavy: 107.8 },
];

// ───────────────────────────────────────────────────────────────────────────────
// 1-2  20–29 岁女性
// ───────────────────────────────────────────────────────────────────────────────
export const HW_F_20_29: HeightWeightRow[] = [
  { heightMin: 140.0, heightMax: 140.9, w1Light: 33.5, w3Light: 36.5, w5Max: 50.3, w3Heavy: 54.3 },
  { heightMin: 141.0, heightMax: 141.9, w1Light: 34.2, w3Light: 37.0, w5Max: 51.0, w3Heavy: 54.9 },
  { heightMin: 142.0, heightMax: 142.9, w1Light: 34.8, w3Light: 37.5, w5Max: 51.7, w3Heavy: 55.6 },
  { heightMin: 143.0, heightMax: 143.9, w1Light: 35.4, w3Light: 37.9, w5Max: 52.3, w3Heavy: 56.2 },
  { heightMin: 144.0, heightMax: 144.9, w1Light: 36.0, w3Light: 38.5, w5Max: 52.9, w3Heavy: 56.9 },
  { heightMin: 145.0, heightMax: 145.9, w1Light: 36.6, w3Light: 39.0, w5Max: 53.5, w3Heavy: 57.6 },
  { heightMin: 146.0, heightMax: 146.9, w1Light: 37.3, w3Light: 39.5, w5Max: 54.1, w3Heavy: 58.3 },
  { heightMin: 147.0, heightMax: 147.9, w1Light: 37.9, w3Light: 39.9, w5Max: 54.7, w3Heavy: 58.9 },
  { heightMin: 148.0, heightMax: 148.9, w1Light: 38.4, w3Light: 40.4, w5Max: 55.3, w3Heavy: 59.6 },
  { heightMin: 149.0, heightMax: 149.9, w1Light: 39.0, w3Light: 40.9, w5Max: 55.9, w3Heavy: 60.3 },
  { heightMin: 150.0, heightMax: 150.9, w1Light: 39.6, w3Light: 41.5, w5Max: 56.5, w3Heavy: 61.0 },
  { heightMin: 151.0, heightMax: 151.9, w1Light: 40.2, w3Light: 42.1, w5Max: 57.1, w3Heavy: 61.7 },
  { heightMin: 152.0, heightMax: 152.9, w1Light: 40.8, w3Light: 42.7, w5Max: 57.8, w3Heavy: 62.5 },
  { heightMin: 153.0, heightMax: 153.9, w1Light: 41.5, w3Light: 43.3, w5Max: 58.4, w3Heavy: 63.3 },
  { heightMin: 154.0, heightMax: 154.9, w1Light: 42.1, w3Light: 44.0, w5Max: 59.1, w3Heavy: 64.0 },
  { heightMin: 155.0, heightMax: 155.9, w1Light: 42.7, w3Light: 44.7, w5Max: 59.7, w3Heavy: 64.7 },
  { heightMin: 156.0, heightMax: 156.9, w1Light: 43.3, w3Light: 45.4, w5Max: 60.3, w3Heavy: 65.4 },
  { heightMin: 157.0, heightMax: 157.9, w1Light: 43.9, w3Light: 46.1, w5Max: 61.0, w3Heavy: 66.1 },
  { heightMin: 158.0, heightMax: 158.9, w1Light: 44.5, w3Light: 46.7, w5Max: 61.7, w3Heavy: 66.8 },
  { heightMin: 159.0, heightMax: 159.9, w1Light: 45.2, w3Light: 47.4, w5Max: 62.3, w3Heavy: 67.4 },
  { heightMin: 160.0, heightMax: 160.9, w1Light: 45.8, w3Light: 48.1, w5Max: 63.0, w3Heavy: 68.2 },
  { heightMin: 161.0, heightMax: 161.9, w1Light: 46.3, w3Light: 48.8, w5Max: 63.7, w3Heavy: 68.9 },
  { heightMin: 162.0, heightMax: 162.9, w1Light: 47.0, w3Light: 49.5, w5Max: 64.4, w3Heavy: 69.6 },
  { heightMin: 163.0, heightMax: 163.9, w1Light: 47.6, w3Light: 50.2, w5Max: 65.1, w3Heavy: 70.3 },
  { heightMin: 164.0, heightMax: 164.9, w1Light: 48.3, w3Light: 50.9, w5Max: 65.8, w3Heavy: 71.0 },
  { heightMin: 165.0, heightMax: 165.9, w1Light: 48.9, w3Light: 51.6, w5Max: 66.5, w3Heavy: 71.7 },
  { heightMin: 166.0, heightMax: 166.9, w1Light: 49.6, w3Light: 52.4, w5Max: 67.2, w3Heavy: 72.3 },
  { heightMin: 167.0, heightMax: 167.9, w1Light: 50.3, w3Light: 53.0, w5Max: 67.9, w3Heavy: 73.0 },
  { heightMin: 168.0, heightMax: 168.9, w1Light: 51.0, w3Light: 53.8, w5Max: 68.6, w3Heavy: 73.6 },
  { heightMin: 169.0, heightMax: 169.9, w1Light: 51.7, w3Light: 54.6, w5Max: 69.4, w3Heavy: 74.3 },
  { heightMin: 170.0, heightMax: 170.9, w1Light: 52.5, w3Light: 55.5, w5Max: 70.2, w3Heavy: 74.9 },
  { heightMin: 171.0, heightMax: 171.9, w1Light: 53.3, w3Light: 56.2, w5Max: 71.0, w3Heavy: 75.6 },
  { heightMin: 172.0, heightMax: 172.9, w1Light: 54.1, w3Light: 57.0, w5Max: 71.8, w3Heavy: 76.5 },
  { heightMin: 173.0, heightMax: 173.9, w1Light: 54.9, w3Light: 57.8, w5Max: 72.6, w3Heavy: 77.2 },
  { heightMin: 174.0, heightMax: 174.9, w1Light: 55.8, w3Light: 58.6, w5Max: 73.5, w3Heavy: 77.9 },
  { heightMin: 175.0, heightMax: 175.9, w1Light: 56.5, w3Light: 59.6, w5Max: 74.4, w3Heavy: 78.6 },
  { heightMin: 176.0, heightMax: 176.9, w1Light: 57.3, w3Light: 60.3, w5Max: 75.1, w3Heavy: 79.3 },
  { heightMin: 177.0, heightMax: 177.9, w1Light: 58.1, w3Light: 61.0, w5Max: 76.0, w3Heavy: 80.0 },
  { heightMin: 178.0, heightMax: 178.9, w1Light: 58.9, w3Light: 61.7, w5Max: 76.8, w3Heavy: 80.7 },
  { heightMin: 179.0, heightMax: 179.9, w1Light: 59.7, w3Light: 62.3, w5Max: 77.7, w3Heavy: 81.5 },
  { heightMin: 180.0, heightMax: 180.9, w1Light: 60.5, w3Light: 63.2, w5Max: 78.5, w3Heavy: 82.2 },
  { heightMin: 181.0, heightMax: 181.9, w1Light: 61.3, w3Light: 63.7, w5Max: 79.3, w3Heavy: 82.9 },
  { heightMin: 182.0, heightMax: 182.9, w1Light: 62.1, w3Light: 64.4, w5Max: 80.0, w3Heavy: 83.7 },
  { heightMin: 183.0, heightMax: 183.9, w1Light: 62.9, w3Light: 65.1, w5Max: 80.8, w3Heavy: 84.6 },
  { heightMin: 184.0, heightMax: 184.9, w1Light: 63.7, w3Light: 65.8, w5Max: 81.6, w3Heavy: 85.3 },
];

// ───────────────────────────────────────────────────────────────────────────────
// 1-3  30–39 岁男性
// ───────────────────────────────────────────────────────────────────────────────
export const HW_M_30_39: HeightWeightRow[] = [
  { heightMin: 144.0, heightMax: 144.9, w1Light: 38.0, w3Light: 38.3, w5Max: 50.7, w3Heavy: 54.3 },
  { heightMin: 145.0, heightMax: 145.9, w1Light: 38.5, w3Light: 39.1, w5Max: 51.3, w3Heavy: 55.0 },
  { heightMin: 146.0, heightMax: 146.9, w1Light: 39.1, w3Light: 39.7, w5Max: 51.9, w3Heavy: 55.8 },
  { heightMin: 147.0, heightMax: 147.9, w1Light: 39.7, w3Light: 40.3, w5Max: 52.6, w3Heavy: 56.6 },
  { heightMin: 148.0, heightMax: 148.9, w1Light: 40.3, w3Light: 40.8, w5Max: 53.4, w3Heavy: 57.4 },
  { heightMin: 149.0, heightMax: 149.9, w1Light: 40.9, w3Light: 41.5, w5Max: 54.1, w3Heavy: 58.2 },
  { heightMin: 150.0, heightMax: 150.9, w1Light: 41.5, w3Light: 42.2, w5Max: 54.9, w3Heavy: 59.1 },
  { heightMin: 151.0, heightMax: 151.9, w1Light: 42.0, w3Light: 42.8, w5Max: 55.8, w3Heavy: 60.0 },
  { heightMin: 152.0, heightMax: 152.9, w1Light: 42.6, w3Light: 43.5, w5Max: 56.6, w3Heavy: 61.0 },
  { heightMin: 153.0, heightMax: 153.9, w1Light: 43.2, w3Light: 44.3, w5Max: 57.6, w3Heavy: 61.8 },
  { heightMin: 154.0, heightMax: 154.9, w1Light: 43.8, w3Light: 45.1, w5Max: 58.7, w3Heavy: 62.9 },
  { heightMin: 155.0, heightMax: 155.9, w1Light: 44.4, w3Light: 45.8, w5Max: 59.8, w3Heavy: 63.9 },
  { heightMin: 156.0, heightMax: 156.9, w1Light: 45.0, w3Light: 46.5, w5Max: 60.8, w3Heavy: 64.9 },
  { heightMin: 157.0, heightMax: 157.9, w1Light: 45.5, w3Light: 47.1, w5Max: 61.7, w3Heavy: 66.0 },
  { heightMin: 158.0, heightMax: 158.9, w1Light: 46.0, w3Light: 48.0, w5Max: 62.8, w3Heavy: 67.1 },
  { heightMin: 159.0, heightMax: 159.9, w1Light: 46.5, w3Light: 48.7, w5Max: 63.9, w3Heavy: 68.1 },
  { heightMin: 160.0, heightMax: 160.9, w1Light: 47.0, w3Light: 49.6, w5Max: 64.9, w3Heavy: 69.2 },
  { heightMin: 161.0, heightMax: 161.9, w1Light: 47.7, w3Light: 50.3, w5Max: 65.9, w3Heavy: 70.2 },
  { heightMin: 162.0, heightMax: 162.9, w1Light: 48.3, w3Light: 51.2, w5Max: 66.9, w3Heavy: 71.0 },
  { heightMin: 163.0, heightMax: 163.9, w1Light: 48.8, w3Light: 52.1, w5Max: 67.9, w3Heavy: 72.1 },
  { heightMin: 164.0, heightMax: 164.9, w1Light: 49.4, w3Light: 52.7, w5Max: 69.0, w3Heavy: 73.0 },
  { heightMin: 165.0, heightMax: 165.9, w1Light: 49.9, w3Light: 53.3, w5Max: 69.8, w3Heavy: 74.1 },
  { heightMin: 166.0, heightMax: 166.9, w1Light: 50.4, w3Light: 54.1, w5Max: 70.7, w3Heavy: 74.9 },
  // [ERRATA] 167cm行：5分上限原文"70.6"与166cm"70.7"倒退（疑误），4分下限"71.7"也疑为"70.7"
  //          保留原值不修正，实际使用时 5 分区间存在缺口
  { heightMin: 167.0, heightMax: 167.9, w1Light: 50.9, w3Light: 54.7, w5Max: 70.6, w3Heavy: 75.8 },
  // [ERRATA] 168cm行：3分下限"51.0"与1分上限"51.5"矛盾，取 w1Light=51.5
  { heightMin: 168.0, heightMax: 168.9, w1Light: 51.5, w3Light: 55.4, w5Max: 72.4, w3Heavy: 77.0 },
  { heightMin: 169.0, heightMax: 169.9, w1Light: 52.2, w3Light: 56.1, w5Max: 73.2, w3Heavy: 77.9 },
  { heightMin: 170.0, heightMax: 170.9, w1Light: 53.0, w3Light: 56.8, w5Max: 74.1, w3Heavy: 78.8 },
  { heightMin: 171.0, heightMax: 171.9, w1Light: 53.7, w3Light: 57.7, w5Max: 75.1, w3Heavy: 79.9 },
  { heightMin: 172.0, heightMax: 172.9, w1Light: 54.5, w3Light: 58.6, w5Max: 76.0, w3Heavy: 81.1 },
  { heightMin: 173.0, heightMax: 173.9, w1Light: 55.1, w3Light: 59.4, w5Max: 77.0, w3Heavy: 82.0 },
  { heightMin: 174.0, heightMax: 174.9, w1Light: 55.6, w3Light: 60.3, w5Max: 77.9, w3Heavy: 83.1 },
  { heightMin: 175.0, heightMax: 175.9, w1Light: 56.2, w3Light: 61.1, w5Max: 78.9, w3Heavy: 84.0 },
  { heightMin: 176.0, heightMax: 176.9, w1Light: 56.9, w3Light: 61.9, w5Max: 80.1, w3Heavy: 85.0 },
  { heightMin: 177.0, heightMax: 177.9, w1Light: 57.5, w3Light: 62.4, w5Max: 81.1, w3Heavy: 86.1 },
  { heightMin: 178.0, heightMax: 178.9, w1Light: 58.1, w3Light: 63.2, w5Max: 82.2, w3Heavy: 87.0 },
  { heightMin: 179.0, heightMax: 179.9, w1Light: 58.7, w3Light: 63.8, w5Max: 83.2, w3Heavy: 88.1 },
  { heightMin: 180.0, heightMax: 180.9, w1Light: 59.4, w3Light: 64.4, w5Max: 84.4, w3Heavy: 89.1 },
  { heightMin: 181.0, heightMax: 181.9, w1Light: 59.9, w3Light: 65.3, w5Max: 85.5, w3Heavy: 90.1 },
  { heightMin: 182.0, heightMax: 182.9, w1Light: 60.5, w3Light: 66.0, w5Max: 86.7, w3Heavy: 91.1 },
  { heightMin: 183.0, heightMax: 183.9, w1Light: 61.2, w3Light: 66.8, w5Max: 87.7, w3Heavy: 92.2 },
  { heightMin: 184.0, heightMax: 184.9, w1Light: 61.8, w3Light: 67.5, w5Max: 88.8, w3Heavy: 93.2 },
  { heightMin: 185.0, heightMax: 185.9, w1Light: 62.4, w3Light: 68.2, w5Max: 89.7, w3Heavy: 94.2 },
  { heightMin: 186.0, heightMax: 186.9, w1Light: 63.0, w3Light: 69.0, w5Max: 90.8, w3Heavy: 95.3 },
  { heightMin: 187.0, heightMax: 187.9, w1Light: 63.7, w3Light: 69.8, w5Max: 91.7, w3Heavy: 96.4 },
  { heightMin: 188.0, heightMax: 188.9, w1Light: 64.3, w3Light: 70.5, w5Max: 92.8, w3Heavy: 97.5 },
  { heightMin: 189.0, heightMax: 189.9, w1Light: 65.0, w3Light: 71.5, w5Max: 93.7, w3Heavy: 98.6 },
  { heightMin: 190.0, heightMax: 190.9, w1Light: 65.6, w3Light: 72.2, w5Max: 94.7, w3Heavy: 99.7 },
  { heightMin: 191.0, heightMax: 191.9, w1Light: 66.2, w3Light: 73.0, w5Max: 95.8, w3Heavy: 100.7 },
  { heightMin: 192.0, heightMax: 192.9, w1Light: 66.9, w3Light: 74.0, w5Max: 97.0, w3Heavy: 101.8 },
  { heightMin: 193.0, heightMax: 193.9, w1Light: 67.6, w3Light: 74.7, w5Max: 98.2, w3Heavy: 103.0 },
  { heightMin: 194.0, heightMax: 194.9, w1Light: 68.3, w3Light: 75.6, w5Max: 99.4, w3Heavy: 104.1 },
  { heightMin: 195.0, heightMax: 195.9, w1Light: 68.9, w3Light: 76.4, w5Max: 100.5, w3Heavy: 105.3 },
  { heightMin: 196.0, heightMax: 196.9, w1Light: 69.6, w3Light: 77.2, w5Max: 101.6, w3Heavy: 106.5 },
  { heightMin: 197.0, heightMax: 197.9, w1Light: 70.3, w3Light: 78.2, w5Max: 102.7, w3Heavy: 107.7 },
  { heightMin: 198.0, heightMax: 198.9, w1Light: 71.0, w3Light: 79.1, w5Max: 103.8, w3Heavy: 108.8 },
  { heightMin: 199.0, heightMax: 199.9, w1Light: 71.6, w3Light: 79.8, w5Max: 104.6, w3Heavy: 109.8 },
];

// ───────────────────────────────────────────────────────────────────────────────
// 1-4  30–39 岁女性
// ───────────────────────────────────────────────────────────────────────────────
export const HW_F_30_39: HeightWeightRow[] = [
  { heightMin: 140.0, heightMax: 140.9, w1Light: 34.5, w3Light: 38.5, w5Max: 54.6, w3Heavy: 57.2 },
  { heightMin: 141.0, heightMax: 141.9, w1Light: 35.2, w3Light: 39.0, w5Max: 55.2, w3Heavy: 57.9 },
  { heightMin: 142.0, heightMax: 142.9, w1Light: 35.8, w3Light: 39.5, w5Max: 55.7, w3Heavy: 58.6 },
  { heightMin: 143.0, heightMax: 143.9, w1Light: 36.4, w3Light: 39.9, w5Max: 56.3, w3Heavy: 59.3 },
  { heightMin: 144.0, heightMax: 144.9, w1Light: 37.0, w3Light: 40.5, w5Max: 56.9, w3Heavy: 60.0 },
  { heightMin: 145.0, heightMax: 145.9, w1Light: 37.6, w3Light: 41.0, w5Max: 57.5, w3Heavy: 60.7 },
  { heightMin: 146.0, heightMax: 146.9, w1Light: 38.3, w3Light: 41.5, w5Max: 58.1, w3Heavy: 61.5 },
  { heightMin: 147.0, heightMax: 147.9, w1Light: 38.9, w3Light: 41.9, w5Max: 58.7, w3Heavy: 62.3 },
  { heightMin: 148.0, heightMax: 148.9, w1Light: 39.4, w3Light: 42.4, w5Max: 59.3, w3Heavy: 63.1 },
  { heightMin: 149.0, heightMax: 149.9, w1Light: 40.0, w3Light: 42.9, w5Max: 59.9, w3Heavy: 63.8 },
  // [ERRATA] 150cm行：4分上限原文"64.0"疑为"64.5"（整体趋势），保留原值 64.0（w3Heavy=64.0）
  { heightMin: 150.0, heightMax: 150.9, w1Light: 40.6, w3Light: 43.5, w5Max: 60.5, w3Heavy: 64.0 },
  { heightMin: 151.0, heightMax: 151.9, w1Light: 41.2, w3Light: 44.1, w5Max: 61.1, w3Heavy: 65.1 },
  { heightMin: 152.0, heightMax: 152.9, w1Light: 41.8, w3Light: 44.7, w5Max: 61.8, w3Heavy: 65.7 },
  { heightMin: 153.0, heightMax: 153.9, w1Light: 42.5, w3Light: 45.3, w5Max: 62.4, w3Heavy: 66.4 },
  { heightMin: 154.0, heightMax: 154.9, w1Light: 43.1, w3Light: 46.0, w5Max: 63.1, w3Heavy: 67.0 },
  { heightMin: 155.0, heightMax: 155.9, w1Light: 43.7, w3Light: 46.7, w5Max: 63.8, w3Heavy: 67.7 },
  { heightMin: 156.0, heightMax: 156.9, w1Light: 44.3, w3Light: 47.4, w5Max: 64.5, w3Heavy: 68.4 },
  { heightMin: 157.0, heightMax: 157.9, w1Light: 44.9, w3Light: 48.1, w5Max: 65.2, w3Heavy: 69.1 },
  { heightMin: 158.0, heightMax: 158.9, w1Light: 45.5, w3Light: 48.7, w5Max: 65.9, w3Heavy: 69.8 },
  { heightMin: 159.0, heightMax: 159.9, w1Light: 46.2, w3Light: 49.4, w5Max: 66.6, w3Heavy: 70.4 },
  { heightMin: 160.0, heightMax: 160.9, w1Light: 46.8, w3Light: 50.1, w5Max: 67.3, w3Heavy: 71.2 },
  { heightMin: 161.0, heightMax: 161.9, w1Light: 47.3, w3Light: 50.8, w5Max: 68.0, w3Heavy: 72.0 },
  { heightMin: 162.0, heightMax: 162.9, w1Light: 48.0, w3Light: 51.5, w5Max: 68.7, w3Heavy: 72.6 },
  { heightMin: 163.0, heightMax: 163.9, w1Light: 48.6, w3Light: 52.2, w5Max: 69.4, w3Heavy: 73.3 },
  { heightMin: 164.0, heightMax: 164.9, w1Light: 49.3, w3Light: 52.9, w5Max: 70.0, w3Heavy: 74.0 },
  { heightMin: 165.0, heightMax: 165.9, w1Light: 49.9, w3Light: 53.6, w5Max: 70.6, w3Heavy: 74.7 },
  { heightMin: 166.0, heightMax: 166.9, w1Light: 50.6, w3Light: 54.4, w5Max: 71.3, w3Heavy: 75.3 },
  // [ERRATA] 167cm行：4分下限原文"82.1"疑为印刷错误，修正为"72.1"
  { heightMin: 167.0, heightMax: 167.9, w1Light: 51.3, w3Light: 55.0, w5Max: 72.0, w3Heavy: 76.0 },
  { heightMin: 168.0, heightMax: 168.9, w1Light: 52.0, w3Light: 55.8, w5Max: 72.7, w3Heavy: 76.6 },
  { heightMin: 169.0, heightMax: 169.9, w1Light: 52.7, w3Light: 56.6, w5Max: 73.5, w3Heavy: 77.3 },
  { heightMin: 170.0, heightMax: 170.9, w1Light: 53.5, w3Light: 57.5, w5Max: 74.2, w3Heavy: 78.0 },
  { heightMin: 171.0, heightMax: 171.9, w1Light: 54.3, w3Light: 58.2, w5Max: 75.0, w3Heavy: 78.9 },
  { heightMin: 172.0, heightMax: 172.9, w1Light: 55.1, w3Light: 59.0, w5Max: 75.8, w3Heavy: 79.7 },
  { heightMin: 173.0, heightMax: 173.9, w1Light: 55.9, w3Light: 59.8, w5Max: 76.6, w3Heavy: 80.5 },
  { heightMin: 174.0, heightMax: 174.9, w1Light: 56.8, w3Light: 60.6, w5Max: 77.5, w3Heavy: 81.3 },
  { heightMin: 175.0, heightMax: 175.9, w1Light: 57.5, w3Light: 61.6, w5Max: 78.4, w3Heavy: 82.1 },
  { heightMin: 176.0, heightMax: 176.9, w1Light: 58.3, w3Light: 62.3, w5Max: 79.1, w3Heavy: 83.0 },
  { heightMin: 177.0, heightMax: 177.9, w1Light: 59.1, w3Light: 63.0, w5Max: 79.9, w3Heavy: 83.7 },
  { heightMin: 178.0, heightMax: 178.9, w1Light: 59.9, w3Light: 63.7, w5Max: 80.7, w3Heavy: 84.5 },
  { heightMin: 179.0, heightMax: 179.9, w1Light: 60.7, w3Light: 64.3, w5Max: 81.7, w3Heavy: 85.3 },
  { heightMin: 180.0, heightMax: 180.9, w1Light: 61.5, w3Light: 65.2, w5Max: 82.3, w3Heavy: 86.0 },
  { heightMin: 181.0, heightMax: 181.9, w1Light: 62.3, w3Light: 65.7, w5Max: 82.9, w3Heavy: 86.8 },
  { heightMin: 182.0, heightMax: 182.9, w1Light: 63.1, w3Light: 66.4, w5Max: 83.8, w3Heavy: 87.7 },
  { heightMin: 183.0, heightMax: 183.9, w1Light: 63.9, w3Light: 67.1, w5Max: 84.7, w3Heavy: 88.6 },
  { heightMin: 184.0, heightMax: 184.9, w1Light: 64.7, w3Light: 67.8, w5Max: 85.6, w3Heavy: 89.3 },
];

// ───────────────────────────────────────────────────────────────────────────────
// 1-5  40–49 岁男性
// ───────────────────────────────────────────────────────────────────────────────
export const HW_M_40_49: HeightWeightRow[] = [
  { heightMin: 142.0, heightMax: 142.9, w1Light: 36.9, w3Light: 39.0, w5Max: 51.9, w3Heavy: 55.2 },
  { heightMin: 143.0, heightMax: 143.9, w1Light: 37.5, w3Light: 39.8, w5Max: 52.6, w3Heavy: 55.9 },
  { heightMin: 144.0, heightMax: 144.9, w1Light: 38.1, w3Light: 40.3, w5Max: 53.4, w3Heavy: 56.8 },
  { heightMin: 145.0, heightMax: 145.9, w1Light: 38.7, w3Light: 41.0, w5Max: 54.1, w3Heavy: 57.7 },
  { heightMin: 146.0, heightMax: 146.9, w1Light: 39.4, w3Light: 41.6, w5Max: 54.9, w3Heavy: 58.5 },
  { heightMin: 147.0, heightMax: 147.9, w1Light: 40.1, w3Light: 42.2, w5Max: 55.5, w3Heavy: 59.3 },
  { heightMin: 148.0, heightMax: 148.9, w1Light: 40.8, w3Light: 42.8, w5Max: 56.5, w3Heavy: 60.1 },
  { heightMin: 149.0, heightMax: 149.9, w1Light: 41.5, w3Light: 43.4, w5Max: 57.2, w3Heavy: 60.9 },
  { heightMin: 150.0, heightMax: 150.9, w1Light: 42.2, w3Light: 44.1, w5Max: 58.0, w3Heavy: 61.8 },
  { heightMin: 151.0, heightMax: 151.9, w1Light: 43.0, w3Light: 44.7, w5Max: 58.9, w3Heavy: 62.6 },
  // [ERRATA] 152cm行: 4分下限原文"59.9"，与5分上限"59.7"矛盾，取59.8（取中）
  { heightMin: 152.0, heightMax: 152.9, w1Light: 43.7, w3Light: 45.4, w5Max: 59.7, w3Heavy: 63.5 },
  // [ERRATA] 153cm行: 3分下限原文重复"46.1"(3分和4分下限相同)，保留原值
  { heightMin: 153.0, heightMax: 153.9, w1Light: 44.4, w3Light: 46.1, w5Max: 60.7, w3Heavy: 64.5 },
  { heightMin: 154.0, heightMax: 154.9, w1Light: 45.0, w3Light: 46.9, w5Max: 61.8, w3Heavy: 65.6 },
  { heightMin: 155.0, heightMax: 155.9, w1Light: 45.7, w3Light: 47.7, w5Max: 62.8, w3Heavy: 66.6 },
  { heightMin: 156.0, heightMax: 156.9, w1Light: 46.4, w3Light: 48.4, w5Max: 63.9, w3Heavy: 67.6 },
  { heightMin: 157.0, heightMax: 157.9, w1Light: 47.1, w3Light: 49.0, w5Max: 64.8, w3Heavy: 68.6 },
  { heightMin: 158.0, heightMax: 158.9, w1Light: 47.8, w3Light: 49.8, w5Max: 65.8, w3Heavy: 69.7 },
  { heightMin: 159.0, heightMax: 159.9, w1Light: 48.4, w3Light: 50.6, w5Max: 66.3, w3Heavy: 70.7 },
  { heightMin: 160.0, heightMax: 160.9, w1Light: 49.0, w3Light: 51.4, w5Max: 67.4, w3Heavy: 71.8 },
  // [ERRATA] 161cm行: 4分下限重复"68.7"（原文5分和4分界"68.7"），保留
  { heightMin: 161.0, heightMax: 161.9, w1Light: 49.6, w3Light: 52.3, w5Max: 68.7, w3Heavy: 72.8 },
  { heightMin: 162.0, heightMax: 162.9, w1Light: 50.2, w3Light: 53.2, w5Max: 69.9, w3Heavy: 73.7 },
  { heightMin: 163.0, heightMax: 163.9, w1Light: 50.7, w3Light: 54.0, w5Max: 71.0, w3Heavy: 74.7 },
  { heightMin: 164.0, heightMax: 164.9, w1Light: 51.3, w3Light: 54.7, w5Max: 72.0, w3Heavy: 75.6 },
  { heightMin: 165.0, heightMax: 165.9, w1Light: 51.9, w3Light: 55.2, w5Max: 72.9, w3Heavy: 76.5 },
  { heightMin: 166.0, heightMax: 166.9, w1Light: 52.4, w3Light: 56.0, w5Max: 73.8, w3Heavy: 77.4 },
  { heightMin: 167.0, heightMax: 167.9, w1Light: 52.9, w3Light: 56.6, w5Max: 74.6, w3Heavy: 78.3 },
  { heightMin: 168.0, heightMax: 168.9, w1Light: 53.5, w3Light: 57.3, w5Max: 75.5, w3Heavy: 79.3 },
  { heightMin: 169.0, heightMax: 169.9, w1Light: 54.2, w3Light: 57.9, w5Max: 76.3, w3Heavy: 80.4 },
  { heightMin: 170.0, heightMax: 170.9, w1Light: 55.0, w3Light: 58.7, w5Max: 77.2, w3Heavy: 81.3 },
  { heightMin: 171.0, heightMax: 171.9, w1Light: 55.8, w3Light: 59.6, w5Max: 78.1, w3Heavy: 82.4 },
  { heightMin: 172.0, heightMax: 172.9, w1Light: 56.4, w3Light: 60.5, w5Max: 79.0, w3Heavy: 83.5 },
  { heightMin: 173.0, heightMax: 173.9, w1Light: 57.0, w3Light: 61.3, w5Max: 80.0, w3Heavy: 84.5 },
  { heightMin: 174.0, heightMax: 174.9, w1Light: 57.7, w3Light: 62.2, w5Max: 81.0, w3Heavy: 85.5 },
  { heightMin: 175.0, heightMax: 175.9, w1Light: 58.3, w3Light: 63.0, w5Max: 81.9, w3Heavy: 86.5 },
  { heightMin: 176.0, heightMax: 176.9, w1Light: 58.9, w3Light: 63.8, w5Max: 83.0, w3Heavy: 87.4 },
  // [ERRATA] 177cm行：4分上限"88.5"，1分下限"85.5"（原文>85.5=1分偏重），保留原值
  { heightMin: 177.0, heightMax: 177.9, w1Light: 59.5, w3Light: 64.4, w5Max: 84.1, w3Heavy: 88.5 },
  { heightMin: 178.0, heightMax: 178.9, w1Light: 60.1, w3Light: 65.1, w5Max: 85.2, w3Heavy: 89.5 },
  { heightMin: 179.0, heightMax: 179.9, w1Light: 60.7, w3Light: 65.8, w5Max: 86.2, w3Heavy: 90.5 },
  { heightMin: 180.0, heightMax: 180.9, w1Light: 61.3, w3Light: 66.4, w5Max: 87.4, w3Heavy: 91.5 },
  { heightMin: 181.0, heightMax: 181.9, w1Light: 61.9, w3Light: 67.1, w5Max: 88.5, w3Heavy: 92.6 },
  { heightMin: 182.0, heightMax: 182.9, w1Light: 62.5, w3Light: 68.0, w5Max: 89.7, w3Heavy: 93.6 },
  { heightMin: 183.0, heightMax: 183.9, w1Light: 63.3, w3Light: 68.8, w5Max: 90.8, w3Heavy: 94.6 },
  { heightMin: 184.0, heightMax: 184.9, w1Light: 63.8, w3Light: 69.5, w5Max: 91.8, w3Heavy: 95.7 },
  // [ERRATA] 185cm行：5分上限"91.9"与184cm"91.8"接近无增长疑误，保留原值
  { heightMin: 185.0, heightMax: 185.9, w1Light: 64.4, w3Light: 70.2, w5Max: 91.9, w3Heavy: 96.7 },
  { heightMin: 186.0, heightMax: 186.9, w1Light: 65.1, w3Light: 71.0, w5Max: 92.9, w3Heavy: 97.8 },
  { heightMin: 187.0, heightMax: 187.9, w1Light: 65.7, w3Light: 71.8, w5Max: 94.8, w3Heavy: 97.9 },
  { heightMin: 188.0, heightMax: 188.9, w1Light: 66.3, w3Light: 72.6, w5Max: 95.8, w3Heavy: 99.0 },
  { heightMin: 189.0, heightMax: 189.9, w1Light: 67.0, w3Light: 73.4, w5Max: 96.9, w3Heavy: 100.2 },
  { heightMin: 190.0, heightMax: 190.9, w1Light: 67.6, w3Light: 74.2, w5Max: 97.9, w3Heavy: 101.4 },
  { heightMin: 191.0, heightMax: 191.9, w1Light: 68.3, w3Light: 75.0, w5Max: 99.0, w3Heavy: 102.6 },
  { heightMin: 192.0, heightMax: 192.9, w1Light: 68.9, w3Light: 75.9, w5Max: 100.2, w3Heavy: 103.8 },
  { heightMin: 193.0, heightMax: 193.9, w1Light: 69.5, w3Light: 76.7, w5Max: 101.2, w3Heavy: 105.0 },
];

// ───────────────────────────────────────────────────────────────────────────────
// 1-6  40–49 岁女性
// ───────────────────────────────────────────────────────────────────────────────
export const HW_F_40_49: HeightWeightRow[] = [
  { heightMin: 140.0, heightMax: 140.9, w1Light: 37.3, w3Light: 39.5, w5Max: 55.1, w3Heavy: 58.8 },
  { heightMin: 141.0, heightMax: 141.9, w1Light: 37.9, w3Light: 40.0, w5Max: 55.7, w3Heavy: 59.5 },
  { heightMin: 142.0, heightMax: 142.9, w1Light: 38.6, w3Light: 40.6, w5Max: 56.2, w3Heavy: 60.2 },
  { heightMin: 143.0, heightMax: 143.9, w1Light: 39.1, w3Light: 41.3, w5Max: 56.8, w3Heavy: 60.9 },
  { heightMin: 144.0, heightMax: 144.9, w1Light: 39.6, w3Light: 41.8, w5Max: 57.4, w3Heavy: 61.6 },
  { heightMin: 145.0, heightMax: 145.9, w1Light: 40.2, w3Light: 42.3, w5Max: 58.1, w3Heavy: 62.3 },
  { heightMin: 146.0, heightMax: 146.9, w1Light: 40.8, w3Light: 42.9, w5Max: 58.8, w3Heavy: 63.0 },
  { heightMin: 147.0, heightMax: 147.9, w1Light: 41.4, w3Light: 43.6, w5Max: 59.6, w3Heavy: 63.7 },
  { heightMin: 148.0, heightMax: 148.9, w1Light: 42.0, w3Light: 44.3, w5Max: 60.5, w3Heavy: 64.7 },
  { heightMin: 149.0, heightMax: 149.9, w1Light: 42.6, w3Light: 44.9, w5Max: 61.3, w3Heavy: 65.8 },
  { heightMin: 150.0, heightMax: 150.9, w1Light: 43.4, w3Light: 45.4, w5Max: 62.0, w3Heavy: 66.7 },
  { heightMin: 151.0, heightMax: 151.9, w1Light: 44.0, w3Light: 46.2, w5Max: 62.8, w3Heavy: 67.5 },
  { heightMin: 152.0, heightMax: 152.9, w1Light: 44.6, w3Light: 47.0, w5Max: 63.6, w3Heavy: 68.3 },
  { heightMin: 153.0, heightMax: 153.9, w1Light: 45.3, w3Light: 47.7, w5Max: 64.4, w3Heavy: 69.1 },
  { heightMin: 154.0, heightMax: 154.9, w1Light: 46.0, w3Light: 48.5, w5Max: 65.4, w3Heavy: 69.9 },
  { heightMin: 155.0, heightMax: 155.9, w1Light: 46.7, w3Light: 49.3, w5Max: 66.3, w3Heavy: 70.6 },
  { heightMin: 156.0, heightMax: 156.9, w1Light: 47.4, w3Light: 49.9, w5Max: 67.0, w3Heavy: 71.3 },
  { heightMin: 157.0, heightMax: 157.9, w1Light: 48.1, w3Light: 50.5, w5Max: 67.7, w3Heavy: 71.9 },
  { heightMin: 158.0, heightMax: 158.9, w1Light: 48.7, w3Light: 51.1, w5Max: 68.4, w3Heavy: 72.6 },
  { heightMin: 159.0, heightMax: 159.9, w1Light: 49.4, w3Light: 51.7, w5Max: 69.2, w3Heavy: 73.2 },
  { heightMin: 160.0, heightMax: 160.9, w1Light: 50.1, w3Light: 52.3, w5Max: 69.9, w3Heavy: 74.0 },
  { heightMin: 161.0, heightMax: 161.9, w1Light: 50.7, w3Light: 53.0, w5Max: 70.6, w3Heavy: 74.7 },
  // [ERRATA] 162cm行: 4分下限"72.3"，与5分上限"71.2"存在跳跃（71.3-72.2区间无分级），保留原值
  { heightMin: 162.0, heightMax: 162.9, w1Light: 51.3, w3Light: 53.7, w5Max: 71.2, w3Heavy: 75.5 },
  { heightMin: 163.0, heightMax: 163.9, w1Light: 51.9, w3Light: 54.4, w5Max: 71.9, w3Heavy: 76.1 },
  { heightMin: 164.0, heightMax: 164.9, w1Light: 52.5, w3Light: 55.1, w5Max: 72.7, w3Heavy: 76.9 },
  { heightMin: 165.0, heightMax: 165.9, w1Light: 53.1, w3Light: 55.9, w5Max: 73.4, w3Heavy: 77.7 },
  { heightMin: 166.0, heightMax: 166.9, w1Light: 53.7, w3Light: 56.8, w5Max: 74.2, w3Heavy: 78.5 },
  { heightMin: 167.0, heightMax: 167.9, w1Light: 54.3, w3Light: 57.6, w5Max: 75.0, w3Heavy: 79.3 },
  { heightMin: 168.0, heightMax: 168.9, w1Light: 55.0, w3Light: 58.2, w5Max: 75.8, w3Heavy: 80.0 },
  { heightMin: 169.0, heightMax: 169.9, w1Light: 55.6, w3Light: 59.0, w5Max: 76.6, w3Heavy: 80.8 },
  { heightMin: 170.0, heightMax: 170.9, w1Light: 56.3, w3Light: 59.8, w5Max: 77.4, w3Heavy: 81.5 },
  { heightMin: 171.0, heightMax: 171.9, w1Light: 57.0, w3Light: 60.5, w5Max: 78.2, w3Heavy: 82.2 },
  { heightMin: 172.0, heightMax: 172.9, w1Light: 57.7, w3Light: 61.2, w5Max: 79.0, w3Heavy: 83.1 },
  { heightMin: 173.0, heightMax: 173.9, w1Light: 58.5, w3Light: 61.9, w5Max: 79.8, w3Heavy: 83.9 },
  { heightMin: 174.0, heightMax: 174.9, w1Light: 59.4, w3Light: 62.8, w5Max: 80.6, w3Heavy: 84.7 },
  { heightMin: 175.0, heightMax: 175.9, w1Light: 60.2, w3Light: 63.4, w5Max: 81.4, w3Heavy: 85.5 },
  { heightMin: 176.0, heightMax: 176.9, w1Light: 61.0, w3Light: 64.1, w5Max: 82.2, w3Heavy: 86.3 },
  { heightMin: 177.0, heightMax: 177.9, w1Light: 61.7, w3Light: 64.9, w5Max: 82.9, w3Heavy: 87.0 },
  { heightMin: 178.0, heightMax: 178.9, w1Light: 62.4, w3Light: 65.2, w5Max: 83.7, w3Heavy: 87.7 },
  { heightMin: 179.0, heightMax: 179.9, w1Light: 63.1, w3Light: 66.0, w5Max: 84.3, w3Heavy: 88.5 },
  { heightMin: 180.0, heightMax: 180.9, w1Light: 63.8, w3Light: 66.9, w5Max: 85.0, w3Heavy: 89.2 },
  { heightMin: 181.0, heightMax: 181.9, w1Light: 64.4, w3Light: 67.7, w5Max: 85.7, w3Heavy: 89.9 },
  { heightMin: 182.0, heightMax: 182.9, w1Light: 65.1, w3Light: 68.5, w5Max: 86.4, w3Heavy: 90.6 },
  { heightMin: 183.0, heightMax: 183.9, w1Light: 65.8, w3Light: 69.3, w5Max: 87.1, w3Heavy: 91.3 },
  { heightMin: 184.0, heightMax: 184.9, w1Light: 66.5, w3Light: 70.2, w5Max: 87.9, w3Heavy: 92.1 },
];

// ───────────────────────────────────────────────────────────────────────────────
// 1-7  50–59 岁男性（与40-49男性数据相同，PDF显示两张表一致）
// ───────────────────────────────────────────────────────────────────────────────
export const HW_M_50_59: HeightWeightRow[] = HW_M_40_49.map(r => ({ ...r }));

// ───────────────────────────────────────────────────────────────────────────────
// 1-8  50–59 岁女性
// ───────────────────────────────────────────────────────────────────────────────
export const HW_F_50_59: HeightWeightRow[] = [
  { heightMin: 140.0, heightMax: 140.9, w1Light: 37.3, w3Light: 40.5, w5Max: 55.2, w3Heavy: 58.3 },
  { heightMin: 141.0, heightMax: 141.9, w1Light: 37.9, w3Light: 41.0, w5Max: 55.7, w3Heavy: 59.1 },
  { heightMin: 142.0, heightMax: 142.9, w1Light: 38.6, w3Light: 41.6, w5Max: 56.2, w3Heavy: 59.9 },
  { heightMin: 143.0, heightMax: 143.9, w1Light: 39.1, w3Light: 42.3, w5Max: 56.8, w3Heavy: 60.6 },
  { heightMin: 144.0, heightMax: 144.9, w1Light: 39.6, w3Light: 42.8, w5Max: 57.4, w3Heavy: 61.4 },
  { heightMin: 145.0, heightMax: 145.9, w1Light: 40.2, w3Light: 43.3, w5Max: 58.1, w3Heavy: 62.2 },
  { heightMin: 146.0, heightMax: 146.9, w1Light: 40.8, w3Light: 43.9, w5Max: 58.8, w3Heavy: 63.0 },
  { heightMin: 147.0, heightMax: 147.9, w1Light: 41.4, w3Light: 44.6, w5Max: 59.6, w3Heavy: 63.9 },
  { heightMin: 148.0, heightMax: 148.9, w1Light: 42.0, w3Light: 45.3, w5Max: 60.5, w3Heavy: 64.8 },
  { heightMin: 149.0, heightMax: 149.9, w1Light: 42.6, w3Light: 45.9, w5Max: 61.3, w3Heavy: 65.8 },
  { heightMin: 150.0, heightMax: 150.9, w1Light: 43.4, w3Light: 46.4, w5Max: 62.0, w3Heavy: 66.7 },
  { heightMin: 151.0, heightMax: 151.9, w1Light: 44.0, w3Light: 47.2, w5Max: 62.8, w3Heavy: 67.5 },
  { heightMin: 152.0, heightMax: 152.9, w1Light: 44.6, w3Light: 48.0, w5Max: 63.6, w3Heavy: 68.3 },
  { heightMin: 153.0, heightMax: 153.9, w1Light: 45.3, w3Light: 48.7, w5Max: 64.4, w3Heavy: 69.1 },
  { heightMin: 154.0, heightMax: 154.9, w1Light: 46.0, w3Light: 49.5, w5Max: 65.2, w3Heavy: 69.9 },
  { heightMin: 155.0, heightMax: 155.9, w1Light: 46.7, w3Light: 50.3, w5Max: 66.0, w3Heavy: 70.6 },
  { heightMin: 156.0, heightMax: 156.9, w1Light: 47.4, w3Light: 50.9, w5Max: 66.7, w3Heavy: 71.3 },
  { heightMin: 157.0, heightMax: 157.9, w1Light: 48.1, w3Light: 51.5, w5Max: 67.4, w3Heavy: 71.9 },
  { heightMin: 158.0, heightMax: 158.9, w1Light: 48.7, w3Light: 52.1, w5Max: 68.1, w3Heavy: 72.6 },
  { heightMin: 159.0, heightMax: 159.9, w1Light: 49.4, w3Light: 52.7, w5Max: 69.0, w3Heavy: 73.2 },
  { heightMin: 160.0, heightMax: 160.9, w1Light: 50.1, w3Light: 53.3, w5Max: 69.9, w3Heavy: 74.0 },
  { heightMin: 161.0, heightMax: 161.9, w1Light: 50.7, w3Light: 54.0, w5Max: 70.6, w3Heavy: 74.7 },
  { heightMin: 162.0, heightMax: 162.9, w1Light: 51.3, w3Light: 54.7, w5Max: 71.3, w3Heavy: 75.5 },
  { heightMin: 163.0, heightMax: 163.9, w1Light: 51.9, w3Light: 55.4, w5Max: 72.0, w3Heavy: 76.1 },
  { heightMin: 164.0, heightMax: 164.9, w1Light: 52.5, w3Light: 56.1, w5Max: 72.7, w3Heavy: 76.9 },
  { heightMin: 165.0, heightMax: 165.9, w1Light: 53.1, w3Light: 56.9, w5Max: 73.4, w3Heavy: 77.7 },
  { heightMin: 166.0, heightMax: 166.9, w1Light: 53.7, w3Light: 57.8, w5Max: 74.2, w3Heavy: 78.5 },
  { heightMin: 167.0, heightMax: 167.9, w1Light: 54.3, w3Light: 58.6, w5Max: 75.0, w3Heavy: 79.3 },
  { heightMin: 168.0, heightMax: 168.9, w1Light: 55.0, w3Light: 59.2, w5Max: 75.8, w3Heavy: 80.0 },
  { heightMin: 169.0, heightMax: 169.9, w1Light: 55.6, w3Light: 60.0, w5Max: 76.6, w3Heavy: 80.8 },
  { heightMin: 170.0, heightMax: 170.9, w1Light: 56.3, w3Light: 60.8, w5Max: 77.4, w3Heavy: 81.5 },
  { heightMin: 171.0, heightMax: 171.9, w1Light: 57.0, w3Light: 61.5, w5Max: 78.2, w3Heavy: 82.2 },
  { heightMin: 172.0, heightMax: 172.9, w1Light: 57.7, w3Light: 62.2, w5Max: 79.0, w3Heavy: 83.1 },
  { heightMin: 173.0, heightMax: 173.9, w1Light: 58.5, w3Light: 62.9, w5Max: 79.8, w3Heavy: 83.9 },
  { heightMin: 174.0, heightMax: 174.9, w1Light: 59.4, w3Light: 63.8, w5Max: 80.7, w3Heavy: 84.7 },
  { heightMin: 175.0, heightMax: 175.9, w1Light: 60.2, w3Light: 64.4, w5Max: 81.5, w3Heavy: 85.5 },
  { heightMin: 176.0, heightMax: 176.9, w1Light: 61.0, w3Light: 65.1, w5Max: 82.2, w3Heavy: 86.3 },
  { heightMin: 177.0, heightMax: 177.9, w1Light: 61.7, w3Light: 65.9, w5Max: 83.0, w3Heavy: 87.0 },
  { heightMin: 178.0, heightMax: 178.9, w1Light: 62.4, w3Light: 66.2, w5Max: 83.7, w3Heavy: 87.7 },
  { heightMin: 179.0, heightMax: 179.9, w1Light: 63.1, w3Light: 67.0, w5Max: 84.3, w3Heavy: 88.5 },
  { heightMin: 180.0, heightMax: 180.9, w1Light: 63.8, w3Light: 67.9, w5Max: 85.0, w3Heavy: 89.2 },
  { heightMin: 181.0, heightMax: 181.9, w1Light: 64.4, w3Light: 68.7, w5Max: 85.7, w3Heavy: 89.9 },
  { heightMin: 182.0, heightMax: 182.9, w1Light: 65.1, w3Light: 69.5, w5Max: 86.4, w3Heavy: 90.5 },
  { heightMin: 183.0, heightMax: 183.9, w1Light: 65.8, w3Light: 70.3, w5Max: 87.1, w3Heavy: 91.1 },
  { heightMin: 184.0, heightMax: 184.9, w1Light: 66.5, w3Light: 71.2, w5Max: 87.9, w3Heavy: 91.8 },
];

// ═══════════════════════════════════════════════════════════════════════════════
// 二、肺活量评分表（升序，单位：mL）
//     s1=1分下限, s2=2分下限, s3=3分下限, s4=4分下限, s5=5分下限(≥得5分)
// ═══════════════════════════════════════════════════════════════════════════════
export const LUNG_CAPACITY: AscendingScoreRow[] = [
  { ageGroup: '20-24', gender: 1, s1: 2369, s2: 2848, s3: 3465, s4: 3985, s5: 4635 },
  { ageGroup: '20-24', gender: 0, s1: 1423, s2: 1874, s3: 2355, s4: 2780, s5: 3260 },
  { ageGroup: '25-29', gender: 1, s1: 2326, s2: 2850, s3: 3460, s4: 3970, s5: 4625 },
  { ageGroup: '25-29', gender: 0, s1: 1396, s2: 1835, s3: 2365, s4: 2770, s5: 3245 },
  { ageGroup: '30-34', gender: 1, s1: 2240, s2: 2750, s3: 3345, s4: 3875, s5: 4545 },
  { ageGroup: '30-34', gender: 0, s1: 1320, s2: 1782, s3: 2340, s4: 2760, s5: 3243 },
  { ageGroup: '35-39', gender: 1, s1: 2135, s2: 2620, s3: 3210, s4: 3740, s5: 4350 },
  { ageGroup: '35-39', gender: 0, s1: 1295, s2: 1735, s3: 2250, s4: 2675, s5: 3160 },
  { ageGroup: '40-44', gender: 1, s1: 2007, s2: 2450, s3: 3085, s4: 3600, s5: 4224 },
  { ageGroup: '40-44', gender: 0, s1: 1228, s2: 1630, s3: 2150, s4: 2574, s5: 3075 },
  { ageGroup: '45-49', gender: 1, s1: 1900, s2: 2308, s3: 2965, s4: 3465, s5: 4100 },
  { ageGroup: '45-49', gender: 0, s1: 1160, s2: 1520, s3: 2050, s4: 2460, s5: 2980 },
  { ageGroup: '50-54', gender: 1, s1: 1770, s2: 2165, s3: 2780, s4: 3255, s5: 3915 },
  { ageGroup: '50-54', gender: 0, s1: 1115, s2: 1470, s3: 1978, s4: 2375, s5: 2900 },
  { ageGroup: '55-59', gender: 1, s1: 1669, s2: 2060, s3: 2645, s4: 3125, s5: 3770 },
  { ageGroup: '55-59', gender: 0, s1: 1095, s2: 1375, s3: 1855, s4: 2250, s5: 2770 },
];

// ═══════════════════════════════════════════════════════════════════════════════
// 三、台阶指数评分表（升序，无量纲）
// ═══════════════════════════════════════════════════════════════════════════════
export const STEP_INDEX: AscendingScoreRow[] = [
  { ageGroup: '20-24', gender: 1, s1: 42.1, s2: 46.2, s3: 52.1, s4: 58.1, s5: 67.7 },
  { ageGroup: '20-24', gender: 0, s1: 40.9, s2: 46.2, s3: 52.3, s4: 58.1, s5: 67.2 },
  { ageGroup: '25-29', gender: 1, s1: 42.1, s2: 46.2, s3: 52.0, s4: 58.4, s5: 68.2 },
  { ageGroup: '25-29', gender: 0, s1: 40.7, s2: 46.9, s3: 53.3, s4: 59.2, s5: 68.7 },
  { ageGroup: '30-34', gender: 1, s1: 41.4, s2: 46.2, s3: 52.3, s4: 58.4, s5: 68.2 },
  { ageGroup: '30-34', gender: 0, s1: 39.5, s2: 47.1, s3: 53.8, s4: 60.0, s5: 69.2 },
  { ageGroup: '35-39', gender: 1, s1: 41.3, s2: 46.2, s3: 52.3, s4: 58.8, s5: 68.2 },
  { ageGroup: '35-39', gender: 0, s1: 37.0, s2: 46.9, s3: 53.9, s4: 60.4, s5: 69.8 },
  { ageGroup: '40-44', gender: 1, s1: 37.8, s2: 46.6, s3: 53.6, s4: 60.0, s5: 70.3 },
  { ageGroup: '40-44', gender: 0, s1: 31.5, s2: 46.9, s3: 54.9, s4: 61.6, s5: 71.4 },
  { ageGroup: '45-49', gender: 1, s1: 35.5, s2: 46.4, s3: 53.6, s4: 60.4, s5: 70.3 },
  { ageGroup: '45-49', gender: 0, s1: 30.0, s2: 45.7, s3: 54.5, s4: 61.6, s5: 71.4 },
  { ageGroup: '50-54', gender: 1, s1: 31.5, s2: 45.9, s3: 53.6, s4: 60.0, s5: 69.8 },
  { ageGroup: '50-54', gender: 0, s1: 27.9, s2: 43.9, s3: 54.2, s4: 61.6, s5: 71.4 },
  { ageGroup: '55-59', gender: 1, s1: 29.9, s2: 44.8, s3: 53.3, s4: 60.0, s5: 69.8 },
  { ageGroup: '55-59', gender: 0, s1: 27.3, s2: 39.9, s3: 52.9, s4: 60.4, s5: 70.3 },
];

// ═══════════════════════════════════════════════════════════════════════════════
// 四、握力评分表（升序，单位：kg）
// ═══════════════════════════════════════════════════════════════════════════════
export const GRIP_STRENGTH: AscendingScoreRow[] = [
  { ageGroup: '20-24', gender: 1, s1: 29.6, s2: 37.0, s3: 43.6, s4: 49.3, s5: 56.4 },
  { ageGroup: '20-24', gender: 0, s1: 18.6, s2: 21.2, s3: 25.8, s4: 29.9, s5: 35.1 },
  { ageGroup: '25-29', gender: 1, s1: 32.6, s2: 38.4, s3: 44.9, s4: 50.5, s5: 57.7 },
  { ageGroup: '25-29', gender: 0, s1: 19.2, s2: 21.8, s3: 26.2, s4: 30.2, s5: 35.4 },
  { ageGroup: '30-34', gender: 1, s1: 32.2, s2: 38.1, s3: 45.0, s4: 50.7, s5: 57.7 },
  { ageGroup: '30-34', gender: 0, s1: 19.8, s2: 22.4, s3: 27.0, s4: 31.0, s5: 36.2 },
  { ageGroup: '35-39', gender: 1, s1: 31.3, s2: 37.3, s3: 44.5, s4: 50.3, s5: 57.8 },
  { ageGroup: '35-39', gender: 0, s1: 19.6, s2: 22.4, s3: 27.1, s4: 31.3, s5: 36.5 },
  { ageGroup: '40-44', gender: 1, s1: 30.0, s2: 36.5, s3: 43.5, s4: 49.6, s5: 56.8 },
  { ageGroup: '40-44', gender: 0, s1: 19.1, s2: 22.1, s3: 27.0, s4: 31.1, s5: 36.6 },
  { ageGroup: '45-49', gender: 1, s1: 29.2, s2: 35.5, s3: 42.5, s4: 48.6, s5: 55.5 },
  { ageGroup: '45-49', gender: 0, s1: 18.1, s2: 21.3, s3: 26.1, s4: 30.4, s5: 35.8 },
  { ageGroup: '50-54', gender: 1, s1: 27.2, s2: 32.8, s3: 40.4, s4: 46.4, s5: 53.3 },
  { ageGroup: '50-54', gender: 0, s1: 17.1, s2: 20.2, s3: 24.9, s4: 29.0, s5: 34.3 },
  { ageGroup: '55-59', gender: 1, s1: 25.9, s2: 31.5, s3: 38.6, s4: 44.0, s5: 50.8 },
  { ageGroup: '55-59', gender: 0, s1: 16.3, s2: 19.3, s3: 23.6, s4: 27.7, s5: 32.8 },
];

// ═══════════════════════════════════════════════════════════════════════════════
// 五、俯卧撑评分表（仅男性20-39岁，升序，单位：次）
// ═══════════════════════════════════════════════════════════════════════════════
export const PUSHUPS: AscendingScoreRow[] = [
  { ageGroup: '20-24', gender: 1, s1: 7, s2: 13, s3: 20, s4: 28, s5: 41 },
  { ageGroup: '25-29', gender: 1, s1: 5, s2: 11, s3: 18, s4: 25, s5: 36 },
  { ageGroup: '30-34', gender: 1, s1: 4, s2: 11, s3: 16, s4: 23, s5: 31 },
  { ageGroup: '35-39', gender: 1, s1: 3, s2: 7, s3: 12, s4: 20, s5: 28 },
];

// ═══════════════════════════════════════════════════════════════════════════════
// 六、1分钟仰卧起坐评分表（仅女性20-39岁，升序，单位：次）
// ═══════════════════════════════════════════════════════════════════════════════
export const SITUPS: AscendingScoreRow[] = [
  { ageGroup: '20-24', gender: 0, s1: 1, s2: 6, s3: 16, s4: 26, s5: 37 },
  { ageGroup: '25-29', gender: 0, s1: 1, s2: 4, s3: 12, s4: 21, s5: 31 },
  { ageGroup: '30-34', gender: 0, s1: 1, s2: 4, s3: 11, s4: 20, s5: 29 },
  { ageGroup: '35-39', gender: 0, s1: 1, s2: 3, s3: 7, s4: 15, s5: 24 },
];

// ═══════════════════════════════════════════════════════════════════════════════
// 七、纵跳评分表（男女均为20-39岁，升序，单位：cm）
// ═══════════════════════════════════════════════════════════════════════════════
export const VERTICAL_JUMP: AscendingScoreRow[] = [
  { ageGroup: '20-24', gender: 1, s1: 19.9, s2: 24.9, s3: 32.4, s4: 38.5, s5: 45.9 },
  // [ERRATA] 20-24女5分下限原文"30.3"，4分上限"30.0"，疑应为">30.0"即s5=30.1，保留30.1
  { ageGroup: '20-24', gender: 0, s1: 12.7, s2: 15.9, s3: 20.6, s4: 24.8, s5: 30.1 },
  { ageGroup: '25-29', gender: 1, s1: 19.6, s2: 24.0, s3: 31.4, s4: 36.9, s5: 43.7 },
  { ageGroup: '25-29', gender: 0, s1: 12.4, s2: 15.1, s3: 19.8, s4: 23.5, s5: 28.6 },
  { ageGroup: '30-34', gender: 1, s1: 18.4, s2: 22.4, s3: 29.4, s4: 34.8, s5: 41.2 },
  { ageGroup: '30-34', gender: 0, s1: 12.0, s2: 14.6, s3: 18.8, s4: 22.7, s5: 27.8 },
  { ageGroup: '35-39', gender: 1, s1: 17.8, s2: 21.5, s3: 28.0, s4: 33.1, s5: 39.6 },
  { ageGroup: '35-39', gender: 0, s1: 11.5, s2: 13.8, s3: 17.9, s4: 21.4, s5: 26.2 },
];

// ═══════════════════════════════════════════════════════════════════════════════
// 八、坐位体前屈评分表（升序，单位：cm，可为负值）
// ═══════════════════════════════════════════════════════════════════════════════
export const SIT_AND_REACH: AscendingScoreRow[] = [
  { ageGroup: '20-24', gender: 1, s1: -3.5, s2: 1.8, s3: 9.0, s4: 14.2, s5: 20.2 },
  { ageGroup: '20-24', gender: 0, s1: -2.1, s2: 2.9, s3: 9.5, s4: 14.4, s5: 20.3 },
  { ageGroup: '25-29', gender: 1, s1: -5.5, s2: 1.0, s3: 7.9, s4: 13.5, s5: 19.8 },
  { ageGroup: '25-29', gender: 0, s1: -3.5, s2: 2.0, s3: 8.3, s4: 14.0, s5: 19.8 },
  // [ERRATA] 30-34男：原文2分"0.0-6.4"与1分上限"0.1"有重叠，取 s2=0.2
  { ageGroup: '30-34', gender: 1, s1: -7.0, s2: 0.2, s3: 6.5, s4: 12.0, s5: 18.4 },
  { ageGroup: '30-34', gender: 0, s1: -4.0, s2: 1.7, s3: 8.0, s4: 13.4, s5: 19.3 },
  { ageGroup: '35-39', gender: 1, s1: -8.7, s2: -2.3, s3: 5.0, s4: 10.8, s5: 17.2 },
  { ageGroup: '35-39', gender: 0, s1: -8.7, s2: -2.3, s3: 5.0, s4: 10.8, s5: 17.2 },
  { ageGroup: '40-44', gender: 1, s1: -9.4, s2: -3.7, s3: 4.0, s4: 10.0, s5: 16.3 },
  { ageGroup: '40-44', gender: 0, s1: -5.9, s2: 0.2, s3: 6.6, s4: 12.0, s5: 18.0 },
  { ageGroup: '45-49', gender: 1, s1: -10.0, s2: -4.3, s3: 3.3, s4: 9.2, s5: 16.0 },
  // [ERRATA] 45-49女：2分"0.0-6.1"与1分上限"0.1"冲突，取 s2=0.0（≥0.0得2分）
  { ageGroup: '45-49', gender: 0, s1: -6.3, s2: 0.0, s3: 6.2, s4: 11.9, s5: 18.0 },
  { ageGroup: '50-54', gender: 1, s1: -10.7, s2: -5.5, s3: 2.2, s4: 8.0, s5: 14.9 },
  // [ERRATA] 50-54女：2分"0.5-5.9"与1分上限"0.6"冲突，取 s2=0.7（原文下一档）
  { ageGroup: '50-54', gender: 0, s1: -6.5, s2: 0.7, s3: 6.0, s4: 11.5, s5: 18.0 },
  { ageGroup: '55-59', gender: 1, s1: -11.2, s2: -6.2, s3: 1.8, s4: 7.3, s5: 13.9 },
  // [ERRATA] 55-59女：2分"0.7-5.7"与1分上限"0.8"冲突，取 s2=0.9
  { ageGroup: '55-59', gender: 0, s1: -6.6, s2: 0.9, s3: 5.8, s4: 11.2, s5: 17.8 },
];

// ═══════════════════════════════════════════════════════════════════════════════
// 九、选择反应时评分表（降序，单位：秒；越小越好）
//     s1max=1分上限, s2max=2分上限, s3max=3分上限, s4max=4分上限, s5max=5分上限
//     >s1max → 0分, s2max<v≤s1max → 1分, ... , v≤s5max → 5分
// ═══════════════════════════════════════════════════════════════════════════════
export const REACTION_TIME: DescendingScoreRow[] = [
  { ageGroup: '20-24', gender: 1, s1max: 0.69, s2max: 0.60, s3max: 0.49, s4max: 0.43, s5max: 0.39 },
  { ageGroup: '20-24', gender: 0, s1max: 0.79, s2max: 0.65, s3max: 0.52, s4max: 0.45, s5max: 0.40 },
  { ageGroup: '25-29', gender: 1, s1max: 0.73, s2max: 0.62, s3max: 0.51, s4max: 0.44, s5max: 0.39 },
  { ageGroup: '25-29', gender: 0, s1max: 0.82, s2max: 0.69, s3max: 0.55, s4max: 0.47, s5max: 0.42 },
  { ageGroup: '30-34', gender: 1, s1max: 0.76, s2max: 0.65, s3max: 0.52, s4max: 0.46, s5max: 0.41 },
  { ageGroup: '30-34', gender: 0, s1max: 0.86, s2max: 0.70, s3max: 0.57, s4max: 0.49, s5max: 0.43 },
  { ageGroup: '35-39', gender: 1, s1max: 0.78, s2max: 0.66, s3max: 0.54, s4max: 0.47, s5max: 0.41 },
  { ageGroup: '35-39', gender: 0, s1max: 0.86, s2max: 0.73, s3max: 0.58, s4max: 0.50, s5max: 0.44 },
  { ageGroup: '40-44', gender: 1, s1max: 0.81, s2max: 0.70, s3max: 0.59, s4max: 0.48, s5max: 0.43 },
  { ageGroup: '40-44', gender: 0, s1max: 0.90, s2max: 0.75, s3max: 0.61, s4max: 0.51, s5max: 0.44 },
  { ageGroup: '45-49', gender: 1, s1max: 0.86, s2max: 0.72, s3max: 0.60, s4max: 0.50, s5max: 0.43 },
  { ageGroup: '45-49', gender: 0, s1max: 0.94, s2max: 0.80, s3max: 0.64, s4max: 0.53, s5max: 0.45 },
  { ageGroup: '50-54', gender: 1, s1max: 0.90, s2max: 0.76, s3max: 0.61, s4max: 0.52, s5max: 0.44 },
  { ageGroup: '50-54', gender: 0, s1max: 0.96, s2max: 0.84, s3max: 0.66, s4max: 0.55, s5max: 0.46 },
  { ageGroup: '55-59', gender: 1, s1max: 0.93, s2max: 0.79, s3max: 0.64, s4max: 0.54, s5max: 0.45 },
  { ageGroup: '55-59', gender: 0, s1max: 0.97, s2max: 0.87, s3max: 0.68, s4max: 0.57, s5max: 0.48 },
];

// ═══════════════════════════════════════════════════════════════════════════════
// 十、闭眼单脚站立评分表（升序，单位：秒）
// ═══════════════════════════════════════════════════════════════════════════════
// [ERRATA] 20-24男：原文3分"18-14"疑为"18-41"，已修正；4分"42-98"随之调整为"42-98"
// [ERRATA] 20-24女：3/4分区间有重叠，3分"16-36"，4分"34-90"，取3分上限=33，4分下限=34
export const SINGLE_LEG_STAND: AscendingScoreRow[] = [
  { ageGroup: '20-24', gender: 1, s1: 3, s2: 6, s3: 18, s4: 42, s5: 99 },
  { ageGroup: '20-24', gender: 0, s1: 3, s2: 6, s3: 16, s4: 34, s5: 91 },
  { ageGroup: '25-29', gender: 1, s1: 3, s2: 5, s3: 15, s4: 36, s5: 86 },
  { ageGroup: '25-29', gender: 0, s1: 3, s2: 6, s3: 15, s4: 33, s5: 85 },
  { ageGroup: '30-34', gender: 1, s1: 3, s2: 5, s3: 13, s4: 30, s5: 75 },
  { ageGroup: '30-34', gender: 0, s1: 3, s2: 5, s3: 13, s4: 29, s5: 73 },
  // [ERRATA] 35-39男：原文3分"12-17"疑为"12-27"，4分"28-69"，已修正
  { ageGroup: '35-39', gender: 1, s1: 3, s2: 4, s3: 12, s4: 28, s5: 70 },
  { ageGroup: '35-39', gender: 0, s1: 3, s2: 4, s3: 10, s4: 24, s5: 63 },
  { ageGroup: '40-44', gender: 1, s1: 3, s2: 4, s3: 10, s4: 22, s5: 55 },
  { ageGroup: '40-44', gender: 0, s1: 3, s2: 4, s3: 8, s4: 19, s5: 46 },
  { ageGroup: '45-49', gender: 1, s1: 3, s2: 4, s3: 9, s4: 20, s5: 49 },
  { ageGroup: '45-49', gender: 0, s1: 2, s2: 3, s3: 7, s4: 16, s5: 40 },
  { ageGroup: '50-54', gender: 1, s1: 3, s2: 5, s3: 8, s4: 17, s5: 40 },
  { ageGroup: '50-54', gender: 0, s1: 2, s2: 3, s3: 6, s4: 14, s5: 34 },
  { ageGroup: '55-59', gender: 1, s1: 2, s2: 3, s3: 7, s4: 14, s5: 34 },
  { ageGroup: '55-59', gender: 0, s1: 2, s2: 3, s3: 6, s4: 11, s5: 27 },
];
