'use client'

import { ConceptNode } from '@/types'
import ExampleCard from './ExampleCard'
import trigonometryData from '@/data/trigonometry.json'
import vectorData from '@/data/vector.json'
import functionData from '@/data/function.json'
import algebraData from '@/data/algebra.json'
import probabilityData from '@/data/probability.json'
import geometryData from '@/data/geometry.json'
import statisticsData from '@/data/statistics.json'
import calculusData from '@/data/calculus.json'
import linearAlgebraData from '@/data/linear-algebra.json'
import discreteMathData from '@/data/discrete-math.json'
import { useTopic } from '@/contexts/TopicContext'
import katex from 'katex'
import 'katex/dist/katex.min.css'

interface NodePanelProps {
  node: ConceptNode | null
  isOpen: boolean
  onClose: () => void
  onNodeClick: (nodeId: string) => void
  allNodes: ConceptNode[]
}

// 渲染包含 LaTeX 的文字
function renderMathText(text: string | undefined): JSX.Element[] {
  if (!text) return [<span key="empty">-</span>]
  
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

export default function NodePanel({ node, isOpen, onClose, onNodeClick, allNodes }: NodePanelProps) {
  const { currentTopic } = useTopic()
  
  // 根據當前主題選擇資料
  const mapData = currentTopic === 'vector' ? vectorData : currentTopic === 'function' ? functionData : currentTopic === 'algebra' ? algebraData : currentTopic === 'probability' ? probabilityData : currentTopic === 'geometry' ? geometryData : currentTopic === 'statistics' ? statisticsData : currentTopic === 'calculus' ? calculusData : currentTopic === 'linear-algebra' ? linearAlgebraData : currentTopic === 'discrete-math' ? discreteMathData : trigonometryData
  
  if (!isOpen || !node) return null

  const getLevelColor = (level: number) => {
    const colors = ['bg-green-500', 'bg-blue-500', 'bg-amber-500', 'bg-red-500']
    return colors[level - 1] || 'bg-gray-500'
  }

  const getNodeById = (id: string) => {
    return allNodes.find(n => n.id === id)
  }

  // 計算後續觀念（哪些觀念依賴當前觀念）
  const getNextConcepts = () => {
    return allNodes.filter(n => 
      n.prerequisites.includes(node.id) || n.related.includes(node.id)
    )
  }

  const nextConcepts = getNextConcepts()

  return (
    <div className="absolute top-0 right-0 w-96 h-full bg-white shadow-2xl z-20 overflow-y-auto">
      <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <div className={`w-3 h-3 rounded-full ${getLevelColor(node.level)}`}></div>
            <span className="text-xs text-gray-500">{node.category}</span>
            {node.isExtended && (
              <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded">延伸</span>
            )}
            {node.crossDiscipline && (
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">{node.crossDiscipline}</span>
            )}
          </div>
          <h2 className="text-xl font-bold text-gray-800">{node.name}</h2>
          <p className="text-xs text-gray-500 mt-1">ID: {node.id}</p>
        </div>
        <button 
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
        >
          ×
        </button>
      </div>

      <div className="p-4 space-y-4">
        {/* 說明 */}
        <section>
          <h3 className="font-semibold text-gray-700 mb-2">說明</h3>
          <div className="text-gray-600 text-sm leading-relaxed">{renderMathText(node.description)}</div>
        </section>

        {/* 前置觀念 (強依賴) */}
        {node.prerequisites.length > 0 && (
          <section>
            <h3 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <span className="text-red-500">●</span>
              前置觀念 (必須先懂)
            </h3>
            <div className="space-y-2">
              {node.prerequisites.map(prereqId => {
                const prereqNode = getNodeById(prereqId)
                return prereqNode ? (
                  <button
                    key={prereqId}
                    onClick={() => onNodeClick(prereqId)}
                    className="w-full text-left p-2 bg-red-50 hover:bg-red-100 rounded border border-red-200 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${getLevelColor(prereqNode.level)}`}></div>
                      <span className="text-sm font-medium text-gray-800">{prereqNode.name}</span>
                    </div>
                    <div className="text-xs text-gray-500 mt-1 ml-4">{renderMathText(prereqNode.description)}</div>
                  </button>
                ) : null
              })}
            </div>
          </section>
        )}

        {/* 相關觀念 (弱依賴) */}
        {node.related.length > 0 && (
          <section>
            <h3 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <span className="text-blue-500">○</span>
              相關觀念 (橫向連結)
            </h3>
            <div className="space-y-2">
              {node.related.map(relId => {
                const relNode = getNodeById(relId)
                return relNode ? (
                  <button
                    key={relId}
                    onClick={() => onNodeClick(relId)}
                    className="w-full text-left p-2 bg-blue-50 hover:bg-blue-100 rounded border border-blue-200 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${getLevelColor(relNode.level)}`}></div>
                      <span className="text-sm font-medium text-gray-800">{relNode.name}</span>
                    </div>
                    <div className="text-xs text-gray-500 mt-1 ml-4">{renderMathText(relNode.description)}</div>
                  </button>
                ) : null
              })}
            </div>
          </section>
        )}

        {/* 後續觀念 (誰需要這個觀念) */}
        {nextConcepts.length > 0 && (
          <section>
            <h3 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <span className="text-green-500">→</span>
              後續觀念 (接著可以學)
            </h3>
            <div className="space-y-2">
              {nextConcepts.map(nextNode => (
                <button
                  key={nextNode.id}
                  onClick={() => onNodeClick(nextNode.id)}
                  className="w-full text-left p-2 bg-green-50 hover:bg-green-100 rounded border border-green-200 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${getLevelColor(nextNode.level)}`}></div>
                    <span className="text-sm font-medium text-gray-800">{nextNode.name}</span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1 ml-4">{renderMathText(nextNode.description)}</div>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* 標籤 */}
        {node.tags.length > 0 && (
          <section>
            <h3 className="font-semibold text-gray-700 mb-2">標籤</h3>
            <div className="flex flex-wrap gap-2">
              {node.tags.map(tag => (
                <span key={tag} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                  {tag}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* 預留：題目練習 */}
        <section className="border-t pt-4">
          <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <span>📝 練習題目</span>
            {node.examples && node.examples.length > 0 && (
              <span className="text-xs bg-primary-100 text-primary-700 px-2 py-0.5 rounded">
                {node.examples.length} 題
              </span>
            )}
          </h3>
          
          {node.examples && node.examples.length > 0 ? (
            <div className="space-y-3">
              {node.examples.map(exampleId => {
                const example = mapData.examples.find(ex => ex.id === exampleId)
                return example ? (
                  <ExampleCard key={example.id} example={example as any} />
                ) : null
              })}
            </div>
          ) : (
            <div className="bg-gray-50 border border-dashed border-gray-300 rounded p-4 text-center text-sm text-gray-500">
              此觀念暫無練習題
              <br />
              <span className="text-xs">題目持續新增中...</span>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
