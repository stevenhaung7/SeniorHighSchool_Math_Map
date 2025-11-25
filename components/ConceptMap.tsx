'use client'

import { useEffect, useRef, useState } from 'react'
import cytoscape, { Core, NodeSingular } from 'cytoscape'
import cola from 'cytoscape-cola'
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

// 註冊 cola 布局
if (typeof cytoscape !== 'undefined') {
  cytoscape.use(cola)
}

type ViewMode = 'all' | 1 | 2 | 3 | 4

export default function ConceptMap() {
  const { currentTopic } = useTopic()
  const containerRef = useRef<HTMLDivElement>(null)
  const cyRef = useRef<Core | null>(null)
  const layoutRef = useRef<any>(null)
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
    
    // 當前層級的節點
    const currentLevelNodes = mapData.nodes.filter(node => node.level === viewMode)
    
    // 相鄰層級的節點（半透明顯示）
    const adjacentLevelNodes = mapData.nodes.filter(node => 
      node.level === viewMode - 1 || node.level === viewMode + 1
    )
    
    return [...currentLevelNodes, ...adjacentLevelNodes]
  }

  useEffect(() => {
    if (!containerRef.current) return

    const filteredNodes = getFilteredNodes()
    
    // 準備節點資料
    const nodes = filteredNodes.map(node => ({
      data: {
        label: node.name,
        ...node,
        // 標記是否為相鄰層級（用於半透明顯示）
        isAdjacent: viewMode !== 'all' && node.level !== viewMode
      }
    }))

    // 從 prerequisites 和 related 建立邊（只在過濾後的節點之間）
    const edges: any[] = []
    const nodeIds = new Set(filteredNodes.map(n => n.id))
    
    filteredNodes.forEach(node => {
      // 強依賴 (prerequisites)
      node.prerequisites.forEach(prereq => {
        if (nodeIds.has(prereq)) {
          edges.push({
            data: {
              id: `${prereq}-${node.id}`,
              source: prereq,
              target: node.id,
              type: 'prerequisite'
            }
          })
        }
      })
      
      // 弱依賴 (related)
      node.related.forEach(rel => {
        if (nodeIds.has(rel)) {
          edges.push({
            data: {
              id: `${rel}-${node.id}-related`,
              source: rel,
              target: node.id,
              type: 'related'
            }
          })
        }
      })
    })

    // 初始化 Cytoscape
    const cy = cytoscape({
      container: containerRef.current,
      elements: [...nodes, ...edges],
      style: [
        {
          selector: 'node',
          style: {
            'background-color': (ele: NodeSingular) => {
              const level = ele.data('level')
              // 2.5D: Level 越高顏色越深（製造高度感）
              const colors = [
                '#4ade80', // Level 1: 較亮的綠色
                '#60a5fa', // Level 2: 較亮的藍色
                '#fbbf24', // Level 3: 較亮的琥珀色
                '#f87171'  // Level 4: 較亮的紅色
              ]
              return colors[level - 1] || '#6b7280'
            },
            'opacity': (ele: NodeSingular) => {
              const isAdjacent = ele.data('isAdjacent')
              return isAdjacent ? 0.3 : 1
            },
            'label': 'data(label)',
            'color': '#fff',
            'text-valign': 'center',
            'text-halign': 'center',
            'font-size': (ele: NodeSingular) => {
              const level = ele.data('level')
              // 2.5D: Level 越低字體越大
              const sizes = [12, 11, 10, 9]
              return sizes[level - 1] || 10
            },
            'font-weight': (ele: NodeSingular) => {
              const level = ele.data('level')
              // Level 1 字體更粗
              return level === 1 ? 'bold' : 'normal'
            },
            'width': (ele: NodeSingular) => {
              const isExtended = ele.data('isExtended')
              const isAdjacent = ele.data('isAdjacent')
              const level = ele.data('level')
              // 2.5D: Level 越低節點越大（製造遠近感）
              const levelSizes = [70, 65, 60, 55]
              const baseSize = isExtended ? levelSizes[level - 1] - 10 : levelSizes[level - 1]
              return isAdjacent ? baseSize * 0.7 : baseSize
            },
            'height': (ele: NodeSingular) => {
              const isExtended = ele.data('isExtended')
              const isAdjacent = ele.data('isAdjacent')
              const level = ele.data('level')
              const levelSizes = [70, 65, 60, 55]
              const baseSize = isExtended ? levelSizes[level - 1] - 10 : levelSizes[level - 1]
              return isAdjacent ? baseSize * 0.7 : baseSize
            },
            'text-wrap': 'wrap',
            'text-max-width': '60px',
            'border-width': (ele: NodeSingular) => {
              const isExtended = ele.data('isExtended')
              return isExtended ? '2px' : '0px'
            },
            'border-style': 'dashed',
            'border-color': '#666'
            // 注意: Cytoscape 的陰影效果在某些版本可能不支援
            // 我們用其他方式製造 2.5D 效果
          }
        },
        {
          selector: 'node:active',
          style: {
            'overlay-color': '#000',
            'overlay-padding': 10,
            'overlay-opacity': 0.1
          }
        },
        {
          selector: 'node:selected',
          style: {
            'border-width': '3px',
            'border-color': '#000',
            'border-style': 'solid'
          }
        },
        {
          selector: 'edge[type="prerequisite"]',
          style: {
            'width': (ele: any) => {
              // 2.5D: 根據 source 和 target 的 level 差異調整線條粗細
              const sourceLevel = ele.source().data('level')
              const targetLevel = ele.target().data('level')
              const levelDiff = Math.abs(targetLevel - sourceLevel)
              return levelDiff > 1 ? 3 : 2
            },
            'line-color': (ele: any) => {
              // 2.5D: 向上爬升的線條顏色漸變
              const sourceLevel = ele.source().data('level')
              const targetLevel = ele.target().data('level')
              if (targetLevel > sourceLevel) {
                // 向上：較深的顏色
                return '#555'
              }
              return '#888'
            },
            'target-arrow-color': '#666',
            'target-arrow-shape': 'triangle',
            'curve-style': 'bezier',
            'arrow-scale': 1.5,
            'opacity': 0.8
          }
        },
        {
          selector: 'edge[type="related"]',
          style: {
            'width': 1.5,
            'line-color': '#aaa',
            'line-style': 'dashed',
            'curve-style': 'bezier',
            'opacity': 0.5
          }
        }
      ],
      minZoom: 0.3,
      maxZoom: 3,
      wheelSensitivity: 0.2
    })

    cyRef.current = cy
    
    // 手動運行布局並儲存引用
    const layout = cy.layout({
      name: 'cola',
      animate: true,
      randomize: false,
      nodeSpacing: 80,
      edgeLength: 120,
      fit: true,
      padding: 50,
      avoidOverlap: true
    } as any)
    
    layoutRef.current = layout
    layout.run()

    // 點擊節點事件
    cy.on('tap', 'node', (event: any) => {
      const node = event.target
      const nodeData = node.data() as ConceptNode
      setSelectedNode(nodeData)
      setIsPanelOpen(true)
    })

    // 點擊背景關閉面板
    cy.on('tap', (event: any) => {
      if (event.target === cy) {
        setIsPanelOpen(false)
        setSelectedNode(null)
      }
    })

    return () => {
      // 清理：先停止布局動畫，移除所有事件監聽器，再銷毀實例
      if (layoutRef.current) {
        try {
          layoutRef.current.stop()
        } catch (e) {
          // 忽略已停止的布局錯誤
        }
        layoutRef.current = null
      }
      
      if (cy && !cy.destroyed()) {
        cy.removeAllListeners()
        cy.stop() // 停止所有動畫
        cy.destroy()
      }
      cyRef.current = null
    }
  }, [viewMode, currentTopic, mapData]) // 當 viewMode 或主題改變時重新渲染

  const handleClosePanel = () => {
    setIsPanelOpen(false)
    setSelectedNode(null)
    if (cyRef.current && !cyRef.current.destroyed()) {
      cyRef.current.$(':selected').unselect()
    }
  }

  const handleNodeClick = (nodeId: string) => {
    if (cyRef.current && !cyRef.current.destroyed()) {
      const targetNode = cyRef.current.$(`#${nodeId}`)
      if (targetNode.length > 0) {
        // 取消其他選取
        cyRef.current.$(':selected').unselect()
        // 選取並聚焦
        targetNode.select()
        cyRef.current.animate({
          center: { eles: targetNode },
          zoom: 1.5
        }, {
          duration: 500
        })
        // 更新面板
        const nodeData = targetNode.data() as ConceptNode
        setSelectedNode(nodeData)
        setIsPanelOpen(true)
      }
    }
  }

  const handleResetView = () => {
    if (cyRef.current) {
      cyRef.current.animate({
        fit: {
          eles: cyRef.current.elements(),
          padding: 50
        },
        duration: 500
      })
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
            🌐 全局觀
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
            Level 1 - 基礎觀念
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
            Level 2 - 核心概念
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
            Level 3 - 進階應用
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
            Level 4 - 整合應用
          </button>
        </div>
      </div>

      {/* 圖譜容器 - 加上 top padding 避免被 Tab 遮住，加上 ID 用於 CSS 樣式 */}
      <div ref={containerRef} id="cy-container" className="w-full h-full pt-16" />
      
      {/* 重置視圖按鈕 - 調整位置避開 Tab */}
      <button
        onClick={handleResetView}
        className="absolute top-20 right-4 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg shadow-lg z-10 flex items-center gap-2 transition-colors"
        title="重置視圖"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
        </svg>
        重置視圖
      </button>
      
      {/* 圖例 - 調整位置 */}
      <div className="absolute top-36 right-4 bg-white shadow-lg rounded-lg p-4 z-10 max-w-xs">
        <h3 className="font-bold mb-2 text-gray-800">圖例</h3>
        {viewMode !== 'all' && (
          <div className="mb-3 p-2 bg-blue-50 rounded text-xs text-blue-800">
            💡 當前層級：正常顯示<br />
            👻 相鄰層級：半透明較小
          </div>
        )}
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-green-500"></div>
            <span>第一層：基礎觀念</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-blue-500"></div>
            <span>第二層：核心概念</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-amber-500"></div>
            <span>第三層：進階應用</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-red-500"></div>
            <span>第四層：整合應用</span>
          </div>
          <hr className="my-2" />
          <div className="flex items-center gap-2">
            <div className="w-8 h-0.5 bg-gray-600"></div>
            <span>強依賴 (必須先懂)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-0.5 bg-gray-400 border-dashed" style={{borderTop: '1px dashed #999'}}></div>
            <span>弱依賴 (相關概念)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-gray-400 border-2 border-dashed border-gray-600"></div>
            <span>延伸教材</span>
          </div>
        </div>
      </div>

      {/* 控制說明 */}
      <div className="absolute bottom-4 left-4 bg-white shadow-lg rounded-lg p-3 z-10 text-sm text-gray-600">
        <p>💡 點擊節點查看詳細資訊</p>
        <p>🖱️ 拖曳移動 | 滾輪縮放</p>
      </div>

      {/* 節點詳細資訊面板 */}
      <NodePanel 
        node={selectedNode}
        isOpen={isPanelOpen}
        onClose={handleClosePanel}
        onNodeClick={handleNodeClick}
        allNodes={mapData.nodes as ConceptNode[]}
      />
    </div>
  )
}
