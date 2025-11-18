import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '高中數學觀念地圖 - 三角函數篇',
  description: '台灣高中數學觀念的互動式學習地圖，視覺化呈現三角函數觀念網絡與依賴關係',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-TW">
      <body>{children}</body>
    </html>
  )
}
