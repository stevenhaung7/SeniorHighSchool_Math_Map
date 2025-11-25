'use client'

import { useTopic } from '@/contexts/TopicContext'
import { topics } from '@/lib/topics'

export default function TopicSelector() {
  const { currentTopic, setCurrentTopic } = useTopic()

  return (
    <div className="bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-600">選擇主題：</span>
          <div className="flex gap-2">
            {topics.map((topic) => {
              const isActive = currentTopic === topic.id
              const bgClass = isActive 
                ? (topic.color === 'blue' ? 'bg-blue-500' : 'bg-purple-500')
                : 'bg-gray-100'
              const textClass = isActive ? 'text-white' : 'text-gray-700'
              const hoverClass = isActive ? '' : 'hover:bg-gray-200'
              
              return (
                <button
                  key={topic.id}
                  onClick={() => setCurrentTopic(topic.id)}
                  className={`
                    px-4 py-2 rounded-lg font-medium transition-all
                    flex items-center gap-2
                    ${bgClass} ${textClass} ${hoverClass}
                    ${isActive ? 'shadow-md' : ''}
                  `}
                >
                  <span className="text-lg">{topic.icon}</span>
                  <span>{topic.name}</span>
                </button>
              )
            })}
          </div>
        </div>
        {/* 主題描述 */}
        <div className="mt-2 text-sm text-gray-600">
          {topics.find(t => t.id === currentTopic)?.description}
        </div>
      </div>
    </div>
  )
}
