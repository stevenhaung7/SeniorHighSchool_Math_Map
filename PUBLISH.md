# 發布指南

## 🚀 快速部署到 Vercel

### 步驟 1: 推送到 GitHub

1. 在 GitHub 建立新的 repository (例如: `SeniorHighSchool_Math_Map`)
2. 在本地執行以下命令：

```powershell
git remote add origin https://github.com/你的使用者名稱/SeniorHighSchool_Math_Map.git
git branch -M main
git push -u origin main
```

### 步驟 2: 部署到 Vercel

#### 方法一：使用 Vercel 網站 (推薦)

1. 前往 [vercel.com](https://vercel.com)
2. 使用 GitHub 帳號登入
3. 點擊 **"Add New"** → **"Project"**
4. 選擇你的 GitHub repository
5. Vercel 會自動偵測 Next.js 設定
6. 點擊 **"Deploy"**
7. 等待 2-3 分鐘，完成！

#### 方法二：使用 Vercel CLI

```powershell
# 安裝 Vercel CLI
npm i -g vercel

# 登入
vercel login

# 部署
vercel

# 正式環境部署
vercel --prod
```

### 步驟 3: 自訂網域 (選用)

1. 在 Vercel 專案設定中
2. 前往 **Domains**
3. 添加你的自訂網域
4. 按照指示設定 DNS

---

## 📦 其他部署選項

### GitHub Pages

```powershell
# 建置靜態檔案
npm run build

# out/ 資料夾就是靜態網站
# 可以部署到 GitHub Pages 或任何靜態主機
```

### Netlify

1. 將專案推送到 GitHub
2. 前往 [netlify.com](https://netlify.com)
3. 點擊 **"Add new site"** → **"Import an existing project"**
4. 選擇 GitHub repository
5. Build command: `npm run build`
6. Publish directory: `out`
7. 點擊 **"Deploy"**

---

## ✅ 部署檢查清單

- [ ] 所有檔案已提交到 Git
- [ ] 已推送到 GitHub
- [ ] 已在 Vercel/Netlify 建立專案
- [ ] 部署成功，可以訪問網站
- [ ] 測試所有功能是否正常

---

## 🔗 範例 URL

部署後你會得到類似這樣的網址：
- Vercel: `https://你的專案名稱.vercel.app`
- Netlify: `https://你的專案名稱.netlify.app`
- 自訂網域: `https://你的網域.com`

---

## 💡 提示

- Vercel 和 Netlify 都提供**免費方案**，足夠個人專案使用
- 每次推送到 GitHub main 分支，會自動重新部署
- 可以在部署平台查看建置日誌和錯誤
