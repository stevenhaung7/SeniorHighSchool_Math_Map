# 高中數學觀念地圖

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=YOUR_GITHUB_REPO_URL)

## 部署指南

### Vercel 部署 (推薦)

1. 將專案推送到 GitHub
2. 前往 [Vercel](https://vercel.com)
3. 點擊 "Import Project"
4. 選擇你的 GitHub repository
5. Vercel 會自動偵測 Next.js 並配置
6. 點擊 "Deploy" 即可

### 本地開發

```bash
npm install
npm run dev
```

開啟 http://localhost:3000

### 建置靜態站點

```bash
npm run build
```

輸出目錄: `out/`

## 專案結構

```
c:\SeniorHighSchool_Math_Map
├── app/                    # Next.js App Router
│   ├── layout.tsx         # 根佈局
│   ├── page.tsx           # 首頁
│   └── globals.css        # 全域樣式
├── components/            # React 組件
│   ├── ConceptMap.tsx    # 觀念地圖主組件
│   ├── NodePanel.tsx     # 節點詳細資訊面板
│   └── Header.tsx        # 頁首
├── data/                  # 資料檔案
│   └── trigonometry.json # 三角函數觀念地圖資料
├── types/                 # TypeScript 型別定義
│   └── index.ts
└── public/               # 靜態資源
```

## 技術細節

- **78+ 觀念節點**，完整涵蓋台灣高中三角函數
- **4 層級架構**：基礎觀念 → 核心概念 → 進階應用 → 整合應用
- **強/弱依賴系統**：清楚標示必要前置與相關概念
- **跨學科標記**：向量、複數、矩陣、物理應用
- **延伸教材標記**：和差化積、積化和差等選修內容
