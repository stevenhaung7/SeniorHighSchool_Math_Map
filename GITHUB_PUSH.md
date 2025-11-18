# 發布指令

## 推送到 GitHub

```powershell
# 添加遠端 repository
git remote add origin https://github.com/stevenhaung7/SeniorHighSchool_Math_Map.git

# 重命名分支為 main
git branch -M main

# 推送程式碼
git push -u origin main
```

## 部署到 Vercel

1. 前往 https://vercel.com
2. 使用 GitHub 帳號登入
3. 點擊 "Add New" → "Project"
4. 選擇 `SeniorHighSchool_Math_Map` repository
5. 點擊 "Deploy"
6. 等待 2-3 分鐘完成部署

完成後會得到網址：`https://你的專案名.vercel.app`

---

## 如果需要，可以使用這些指令：

```powershell
# 查看目前狀態
git status

# 查看遠端設定
git remote -v

# 重新設定遠端（如果設錯了）
git remote remove origin
git remote add origin https://github.com/stevenhaung7/SeniorHighSchool_Math_Map.git
```
