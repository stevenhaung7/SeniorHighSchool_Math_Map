'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import dynamic from 'next/dynamic'
import { ConceptNode } from '@/types'
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
import NodePanel from './NodePanel'
import { useTopic } from '@/contexts/TopicContext'

// 動態載入 ForceGraph3D（避免 SSR 問題）
const ForceGraph3D = dynamic(() => import('react-force-graph-3d'), {
  ssr: false,
  loading: () => <div className="w-full h-full flex items-center justify-center">載入 3D 圖譜中...</div>
})

type ViewMode = 'all' | 1 | 2 | 3 | 4

export default function ConceptMap3D() {
  const { currentTopic } = useTopic()
  const fgRef = useRef<any>()
  const [selectedNode, setSelectedNode] = useState<ConceptNode | null>(null)
  const [isPanelOpen, setIsPanelOpen] = useState(false)
  const [viewMode, setViewMode] = useState<ViewMode>('all')

  // 根據當前主題選擇資料
  const mapData = currentTopic === 'vector' ? vectorData : currentTopic === 'function' ? functionData : currentTopic === 'algebra' ? algebraData : currentTopic === 'probability' ? probabilityData : currentTopic === 'geometry' ? geometryData : currentTopic === 'statistics' ? statisticsData : currentTopic === 'calculus' ? calculusData : currentTopic === 'linear-algebra' ? linearAlgebraData : currentTopic === 'discrete-math' ? discreteMathData : trigonometryData

  // 根據 viewMode 過濾要顯示的節點
  const getFilteredNodes = () => {
    if (viewMode === 'all') {
      return mapData.nodes
    }
    
    const currentLevelNodes = mapData.nodes.filter(node => node.level === viewMode)
    const adjacentLevelNodes = mapData.nodes.filter(node => 
      node.level === viewMode - 1 || node.level === viewMode + 1
    )
    
    return [...currentLevelNodes, ...adjacentLevelNodes]
  }

  // 準備圖形數據
  const getGraphData = () => {
    const filteredNodes = getFilteredNodes()
    const nodeIds = new Set(filteredNodes.map(n => n.id))
    
    // 節點數據
    const nodes = filteredNodes.map(node => ({
      id: node.id,
      name: node.name,
      level: node.level,
      category: node.category,
      description: node.description,
      isAdjacent: viewMode !== 'all' && node.level !== viewMode,
      ...node
    }))

    // 邊數據
    const links: any[] = []
    filteredNodes.forEach(node => {
      node.prerequisites.forEach(prereq => {
        if (nodeIds.has(prereq)) {
          links.push({
            source: prereq,
            target: node.id,
            type: 'prerequisite'
          })
        }
      })
      
      node.related.forEach(rel => {
        if (nodeIds.has(rel)) {
          links.push({
            source: rel,
            target: node.id,
            type: 'related'
          })
        }
      })
    })

    return { nodes, links }
  }

  const graphData = getGraphData()

  // 節點顏色
  const getNodeColor = (node: any) => {
    const colors = ['#4ade80', '#60a5fa', '#fbbf24', '#f87171']
    const color = colors[node.level - 1] || '#6b7280'
    return node.isAdjacent ? color + '50' : color
  }

  // 節點大小
  const getNodeSize = (node: any) => {
    const levelSizes = [8, 7, 6, 5]
    const baseSize = levelSizes[node.level - 1]
    return node.isAdjacent ? baseSize * 0.6 : baseSize
  }

  // 處理節點點擊
  const handleNodeClick = useCallback((node: any) => {
    setSelectedNode(node)
    setIsPanelOpen(true)
  }, [])

  const handleClosePanel = () => {
    setIsPanelOpen(false)
    setSelectedNode(null)
  }

  const handlePanelNodeClick = (nodeId: string) => {
    const node: any = graphData.nodes.find(n => n.id === nodeId)
    if (node) {
      setSelectedNode(node as ConceptNode)
      setIsPanelOpen(true)
      
      // 聚焦到該節點（3D 座標會在運行時由 ForceGraph3D 添加）
      if (fgRef.current && node.x !== undefined) {
        const distance = 200
        const distRatio = 1 + distance / Math.hypot(node.x, node.y, node.z)
        fgRef.current.cameraPosition(
          { x: node.x * distRatio, y: node.y * distRatio, z: node.z * distRatio },
          node,
          1000
        )
      }
    }
  }

  return (
    <div className="relative w-full h-screen">
      {/* Tab 切換列 */}
      <div className="absolute top-0 left-0 right-0 bg-white shadow-md z-20 border-b border-gray-200">
        <div className="flex items-center justify-center gap-2 px-4 py-3">
          <button
            onClick={() => setViewMode('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              viewMode === 'all' 
                ? 'bg-primary-600 text-white shadow-md' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            🌐 全局觀 (3D)
          </button>
          <div className="h-6 w-px bg-gray-300"></div>
          <button
            onClick={() => setViewMode(1)}
            className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
              viewMode === 1 
                ? 'bg-green-500 text-white shadow-md' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            Level 1
          </button>
          <button
            onClick={() => setViewMode(2)}
            className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
              viewMode === 2 
                ? 'bg-blue-500 text-white shadow-md' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            Level 2
          </button>
          <button
            onClick={() => setViewMode(3)}
            className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
              viewMode === 3 
                ? 'bg-amber-500 text-white shadow-md' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <div className="w-3 h-3 rounded-full bg-amber-500"></div>
            Level 3
          </button>
          <button
            onClick={() => setViewMode(4)}
            className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
              viewMode === 4 
                ? 'bg-red-500 text-white shadow-md' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            Level 4
          </button>
        </div>
      </div>

      {/* 3D 圖形 */}
      <div className="w-full h-full pt-16">
        <ForceGraph3D
          ref={fgRef}
          graphData={graphData}
          nodeLabel="name"
          nodeColor={getNodeColor}
          nodeVal={getNodeSize}
          nodeResolution={16}
          onNodeClick={handleNodeClick}
          linkColor={(link: any) => link.type === 'prerequisite' ? '#666666' : '#999999'}
          linkWidth={(link: any) => link.type === 'prerequisite' ? 2 : 1}
          linkOpacity={0.6}
          linkDirectionalArrowLength={3.5}
          linkDirectionalArrowRelPos={1}
          backgroundColor="#f8fafc"
          showNavInfo={false}
        />
      </div>

      {/* 控制說明 */}
      <div className="absolute bottom-4 left-4 bg-white shadow-lg rounded-lg p-3 z-10 text-sm text-gray-600">
        <p className="font-semibold mb-2">🎮 3D 控制</p>
        <p>🖱️ 左鍵拖曳：旋轉視角</p>
        <p>🖱️ 右鍵拖曳：平移</p>
        <p>📏 滾輪：縮放</p>
        <p>💡 點擊節點：查看詳情</p>
      </div>

      {/* 圖例 */}
      <div className="absolute top-20 right-4 bg-white shadow-lg rounded-lg p-4 z-10 max-w-xs">
        <h3 className="font-bold mb-2 text-gray-800">圖例 (3D)</h3>
        {viewMode !== 'all' && (
          <div className="mb-3 p-2 bg-blue-50 rounded text-xs text-blue-800">
            💡 當前層級：正常顯示<br />
            👻 相鄰層級：半透明較小
          </div>
        )}
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-green-400"></div>
            <span>Level 1 - 基礎</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-blue-400"></div>
            <span>Level 2 - 核心</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-amber-400"></div>
            <span>Level 3 - 進階</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-red-400"></div>
            <span>Level 4 - 整合</span>
          </div>
          <hr className="my-2" />
          <p className="text-xs text-gray-600">
            Z 軸高度代表學習層級
          </p>
        </div>
      </div>

      {/* 節點詳細資訊面板 */}
      <NodePanel 
        node={selectedNode}
        isOpen={isPanelOpen}
        onClose={handleClosePanel}
        onNodeClick={handlePanelNodeClick}
        allNodes={mapData.nodes as ConceptNode[]}
      />
    </div>
  )
}
