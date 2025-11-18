'use client'

import { ConceptNode } from '@/types'

interface NodePanelProps {
  node: ConceptNode | null
  isOpen: boolean
  onClose: () => void
  onNodeClick: (nodeId: string) => void
  allNodes: ConceptNode[]
}

export default function NodePanel({ node, isOpen, onClose, onNodeClick, allNodes }: NodePanelProps) {
  if (!isOpen || !node) return null

  const getLevelColor = (level: number) => {
    const colors = ['bg-green-500', 'bg-blue-500', 'bg-amber-500', 'bg-red-500']
    return colors[level - 1] || 'bg-gray-500'
  }

  const getNodeById = (id: string) => {
    return allNodes.find(n => n.id === id)
  }

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
          <p className="text-gray-600 text-sm leading-relaxed">{node.description}</p>
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
                    <p className="text-xs text-gray-500 mt-1 ml-4">{prereqNode.description}</p>
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
                    <p className="text-xs text-gray-500 mt-1 ml-4">{relNode.description}</p>
                  </button>
                ) : null
              })}
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
          <h3 className="font-semibold text-gray-700 mb-2">📝 練習題目</h3>
          <div className="bg-gray-50 border border-dashed border-gray-300 rounded p-4 text-center text-sm text-gray-500">
            題目功能開發中...
            <br />
            <span className="text-xs">未來可在此處連結相關練習題</span>
          </div>
        </section>
      </div>
    </div>
  )
}
