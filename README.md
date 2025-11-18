# 高中數學觀念地圖 - 三角函數篇

台灣高中數學觀念的互動式學習地圖，採用螺旋式進展架構，幫助學生理解觀念之間的依賴關係。

## 專案特色

- 🗺️ **互動式觀念地圖** - 視覺化呈現三角函數觀念網絡
- 🔗 **依賴關係追蹤** - 清楚標示前置觀念與相關概念
- 📚 **層級分類** - 從基礎到整合應用，四個層級架構
- 🎯 **預留題目系統** - 未來可連結練習題目

## 技術棧

- **框架**: Next.js 14 (App Router)
- **語言**: TypeScript
- **視覺化**: Cytoscape.js
- **樣式**: Tailwind CSS
- **部署**: Vercel

## 開發指南

### 安裝依賴

```bash
npm install
```

### 開發模式

```bash
npm run dev
```

開啟 [http://localhost:3000](http://localhost:3000) 查看結果。

### 建置專案

```bash
npm run build
```

### 部署

專案配置為靜態導出，可直接部署到 Vercel、Netlify 或 GitHub Pages。

## 資料結構

觀念地圖資料存放在 `/data/trigonometry.json`，包含：

- **nodes**: 觀念節點 (含前置依賴、相關概念等)
- **edges**: 節點間的連結關係
- **examples**: 預留的題目資料結構

## 授權

MIT License
