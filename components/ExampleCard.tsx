'use client'

import { useState } from 'react'
import { Example } from '@/types'
import katex from 'katex'
import 'katex/dist/katex.min.css'

interface ExampleCardProps {
  example: Example
}

// 渲染包含 LaTeX 的文字
function renderMathText(text: string): JSX.Element[] {
  const parts: JSX.Element[] = []
  const regex = /\$(.*?)\$/g
  let lastIndex = 0
  let match
  let key = 0

  while ((match = regex.exec(text)) !== null) {
    // 加入數學式之前的文字
    if (match.index > lastIndex) {
      parts.push(<span key={`text-${key++}`}>{text.substring(lastIndex, match.index)}</span>)
    }
    
    // 渲染數學式
    const mathContent = match[1]
    try {
      const html = katex.renderToString(mathContent, {
        throwOnError: false,
        displayMode: false,
      })
      parts.push(<span key={`math-${key++}`} dangerouslySetInnerHTML={{ __html: html }} />)
    } catch (e) {
      parts.push(<span key={`math-${key++}`}>{`$${mathContent}$`}</span>)
    }
    
    lastIndex = regex.lastIndex
  }
  
  // 加入剩餘文字
  if (lastIndex < text.length) {
    parts.push(<span key={`text-${key++}`}>{text.substring(lastIndex)}</span>)
  }
  
  return parts.length > 0 ? parts : [<span key="text-0">{text}</span>]
}

export default function ExampleCard({ example }: ExampleCardProps) {
  const [showAnswer, setShowAnswer] = useState(false)
  const [showHint, setShowHint] = useState(false)

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-700'
      case 'medium': return 'bg-yellow-100 text-yellow-700'
      case 'hard': return 'bg-red-100 text-red-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getDifficultyText = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return '🟢 基礎'
      case 'medium': return '🟡 中等'
      case 'hard': return '🔴 進階'
      default: return '⚪ 未知'
    }
  }

  const getTypeText = (type: string) => {
    switch (type) {
      case 'choice': return '📝 選擇題'
      case 'calc': return '🔢 計算題'
      case 'proof': return '📐 證明題'
      default: return '❓ 其他'
    }
  }

  return (
    <div className="border border-gray-200 rounded-lg p-4 mb-3 bg-white hover:shadow-md transition-shadow">
      {/* 標題與標籤 */}
      <div className="flex items-start justify-between mb-3">
        <h4 className="font-semibold text-gray-800 flex-1">{example.title}</h4>
        <div className="flex gap-2 ml-2">
          <span className={`text-xs px-2 py-1 rounded ${getDifficultyColor(example.difficulty)}`}>
            {getDifficultyText(example.difficulty)}
          </span>
          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
            {getTypeText(example.type)}
          </span>
        </div>
      </div>

      {/* 題目內容 */}
      <div className="mb-3 p-3 bg-gray-50 rounded border-l-4 border-blue-500">
        <div className="text-sm text-gray-700 whitespace-pre-wrap">{renderMathText(example.question)}</div>
      </div>

      {/* 選擇題選項 */}
      {example.options && example.options.length > 0 && (
        <div className="mb-3 space-y-1">
          {example.options.map((option, index) => (
            <div key={index} className="text-sm text-gray-600 pl-4">
              {String.fromCharCode(65 + index)}. {renderMathText(option)}
            </div>
          ))}
        </div>
      )}

      {/* 提示按鈕 */}
      {example.hint && (
        <div className="mb-3">
          <button
            onClick={() => setShowHint(!showHint)}
            className="text-sm text-purple-600 hover:text-purple-700 font-medium"
          >
            {showHint ? '🙈 隱藏提示' : '💡 顯示提示'}
          </button>
          {showHint && (
            <div className="mt-2 p-3 bg-purple-50 rounded border-l-4 border-purple-400">
              <div className="text-sm text-purple-800">{renderMathText(example.hint)}</div>
            </div>
          )}
        </div>
      )}

      {/* 答案與詳解 */}
      <div>
        <button
          onClick={() => setShowAnswer(!showAnswer)}
          className="text-sm bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded transition-colors"
        >
          {showAnswer ? '📖 隱藏解答' : '✅ 查看解答'}
        </button>

        {showAnswer && (
          <div className="mt-3 space-y-3">
            {/* 答案 */}
            <div className="p-3 bg-green-50 rounded border-l-4 border-green-500">
              <p className="text-xs text-green-600 font-semibold mb-1">答案</p>
              <div className="text-sm text-green-800 font-medium">{renderMathText(example.answer)}</div>
            </div>

            {/* 詳解 */}
            <div className="p-3 bg-blue-50 rounded border-l-4 border-blue-500">
              <p className="text-xs text-blue-600 font-semibold mb-1">詳細解說</p>
              <div className="text-sm text-blue-800 whitespace-pre-wrap">{renderMathText(example.solution)}</div>
            </div>
          </div>
        )}
      </div>

      {/* 標籤 */}
      {example.tags.length > 0 && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <div className="flex flex-wrap gap-1">
            {example.tags.map(tag => (
              <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                #{tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
