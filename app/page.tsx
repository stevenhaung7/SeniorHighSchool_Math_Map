'use client'

import { useState } from 'react'
import ConceptMap from '@/components/ConceptMap'
import ConceptMap3D from '@/components/ConceptMap3D'
import Header from '@/components/Header'
import TopicSelector from '@/components/TopicSelector'
import { TopicProvider } from '@/contexts/TopicContext'

export default function Home() {
  const [is3D, setIs3D] = useState(false)

  return (
    <TopicProvider>
      <div className="min-h-screen flex flex-col">
        <Header />
        <TopicSelector />
        
        {/* 2D/3D 切換按鈕 */}
        <div className="absolute top-4 left-4 z-30">
          <button
            onClick={() => setIs3D(!is3D)}
            className="bg-white hover:bg-gray-50 text-gray-800 font-semibold px-4 py-2 rounded-lg shadow-lg border border-gray-200 transition-all flex items-center gap-2"
          >
            {is3D ? '🎨 切換到 2D' : '🎮 切換到 3D'}
          </button>
        </div>

        <main className="flex-1">
          {is3D ? <ConceptMap3D /> : <ConceptMap />}
        </main>
      </div>
    </TopicProvider>
  )
}
