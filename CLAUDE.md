# 国民体质测定评分系统 — CLAUDE.md

## 项目概述

基于《国民体质测定标准》（成年人部分，国家体育总局 2003）开发的桌面应用。
用户可手动逐条录入指标并实时查看各项得分与综合评级，也可批量导入 Excel/CSV
后将结果输出到新文件。

**技术栈**
- 框架：Tauri v2 + React 18 + TypeScript
- UI：shadcn/ui + Tailwind CSS
- 表格：TanStack Table v8
- 表单：React Hook Form + Zod
- Excel/CSV 读写：SheetJS（xlsx 库）
- 文件对话框：`@tauri-apps/plugin-dialog`
- 文件系统：`@tauri-apps/plugin-fs`

**目标平台：Windows 10/11（64-bit）**
**开发平台：macOS**
**构建策略：GitHub Actions Windows runner 生成 .msi 安装包**

---

## 快速开始

```bash
# 安装依赖
pnpm install

# 开发模式（macOS 本地预览）
pnpm tauri dev

# 仅前端开发（无 Tauri 壳）
pnpm dev

# 类型检查
pnpm typecheck

# 构建（仅在 Windows 环境或 CI 中执行）
pnpm tauri build
```

---

## 目录结构

```
fitness-scorer/
├── CLAUDE.md                  # 本文件
├── src-tauri/                 # Rust/Tauri 后端壳
│   ├── tauri.conf.json
│   └── src/
│       └── main.rs
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── data/
│   │   └── scoringTables.ts   # ⚠️ 核心：所有评分表数据（勿随意修改）
│   ├── lib/
│   │   ├── scorer.ts          # 评分逻辑（单项评分 + 综合评级）
│   │   ├── batchProcessor.ts  # Excel/CSV 批量处理
│   │   └── validators.ts      # Zod 输入校验 schema
│   ├── components/
│   │   ├── ManualEntry/       # 手动录入界面
│   │   ├── BatchImport/       # 批量导入界面
│   │   └── ui/                # shadcn 组件
│   └── types/
│       └── index.ts           # 全局类型定义
├── docs/
│   ├── PRD.md                 # 产品需求文档
│   ├── batch-schema.md        # 批量文件字段规范
│   └── scoring-logic.md       # 评分逻辑说明
└── .github/
    └── workflows/
        └── build-windows.yml  # CI 构建
```

---

## 架构要点

### 纯前端，无后端
所有评分计算在 React 侧（TypeScript）完成。Tauri 仅负责：
1. 文件打开/保存对话框（`@tauri-apps/plugin-dialog`）
2. 文件读写（`@tauri-apps/plugin-fs`）

不需要任何 Rust 自定义命令。

### 核心数据文件
`src/data/scoringTables.ts` 包含所有评分查找表，格式已定义好（见 `docs/PRD.md`）。
**此文件数据来自国家标准，不应在 UI 上提供编辑入口。**

### 评分流程
```
用户输入 → validators.ts 校验 → scorer.ts 查表 → 返回各项分数 + 综合评级
```

---

## 跨平台注意事项（macOS 开发 → Windows 使用）

1. **路径分隔符**：所有路径操作只用 `@tauri-apps/api/path` 的 API，禁止硬编码 `/` 或 `\`
2. **文件保存位置**：输出文件通过 `dialog.save()` 让用户选择，默认 filter `.xlsx`
3. **CSV 编码**：中文 Windows 默认 GBK，使用 SheetJS 读取时声明 `codepage: 936`
   ```typescript
   // 读取时
   const wb = XLSX.read(data, { type: 'array', codepage: 936 });
   // 写出时固定 UTF-8
   XLSX.writeFile(wb, path, { bookType: 'xlsx' });
   ```
4. **字体渲染**：UI 字体用系统默认，不要指定 macOS 特有字体（San Francisco 等）
5. **窗口大小**：设置 `minWidth: 1024, minHeight: 768`，兼顾低分辨率 Windows 笔记本

---

## tauri.conf.json 关键配置

```json
{
  "tauri": {
    "allowlist": {
      "fs": {
        "readFile": true,
        "writeFile": true,
        "scope": ["$DOWNLOAD/*", "$DESKTOP/*", "$DOCUMENT/*"]
      },
      "dialog": {
        "open": true,
        "save": true
      }
    },
    "windows": [{
      "title": "国民体质测定评分系统",
      "width": 1280,
      "height": 800,
      "minWidth": 1024,
      "minHeight": 700
    }]
  }
}
```

---

## GitHub Actions 构建（.github/workflows/build-windows.yml 模板）

```yaml
name: Build Windows
on:
  push:
    tags: ['v*']
jobs:
  build:
    runs-on: windows-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v4
        with: { node-version: '20' }
      - uses: dtolnay/rust-toolchain@stable
      - run: pnpm install
      - run: pnpm tauri build
      - uses: actions/upload-artifact@v4
        with:
          name: windows-installer
          path: src-tauri/target/release/bundle/msi/*.msi
```

---

## 开发规范

- 所有数值计算保留到原始精度（身高 0.1cm，体重 0.1kg，等）
- 年龄计算：`已过当年生日 → 测试年 - 出生年`；`未过当年生日 → 测试年 - 出生年 - 1`
- 如果任意单项得分为 0（无分），综合评级字段输出 `"—"` 或 `null`
- 批量处理错误行：记录到错误日志列，不中断整体处理
- 数值边界处理：使用 `>=` 比较浮点数时，先乘以 10 取整再比较，避免精度问题
