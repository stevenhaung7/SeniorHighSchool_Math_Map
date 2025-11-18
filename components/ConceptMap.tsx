'use client'

import { useEffect, useRef, useState } from 'react'
import cytoscape, { Core, NodeSingular } from 'cytoscape'
import cola from 'cytoscape-cola'
import { ConceptNode } from '@/types'
import mapData from '@/data/trigonometry.json'
import NodePanel from './NodePanel'

// 註冊 cola 布局
if (typeof cytoscape !== 'undefined') {
  cytoscape.use(cola)
}

export default function ConceptMap() {
  const containerRef = useRef<HTMLDivElement>(null)
  const cyRef = useRef<Core | null>(null)
  const [selectedNode, setSelectedNode] = useState<ConceptNode | null>(null)
  const [isPanelOpen, setIsPanelOpen] = useState(false)

  useEffect(() => {
    if (!containerRef.current) return

    // 準備節點資料
    const nodes = mapData.nodes.map(node => ({
      data: {
        label: node.name,
        ...node
      }
    }))

    // 從 prerequisites 和 related 建立邊
    const edges: any[] = []
    mapData.nodes.forEach(node => {
      // 強依賴 (prerequisites)
      node.prerequisites.forEach(prereq => {
        edges.push({
          data: {
            id: `${prereq}-${node.id}`,
            source: prereq,
            target: node.id,
            type: 'prerequisite'
          }
        })
      })
      
      // 弱依賴 (related)
      node.related.forEach(rel => {
        edges.push({
          data: {
            id: `${rel}-${node.id}-related`,
            source: rel,
            target: node.id,
            type: 'related'
          }
        })
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
              const colors = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444']
              return colors[level - 1] || '#6b7280'
            },
            'label': 'data(label)',
            'color': '#fff',
            'text-valign': 'center',
            'text-halign': 'center',
            'font-size': '10px',
            'width': (ele: NodeSingular) => {
              const isExtended = ele.data('isExtended')
              return isExtended ? '50px' : '60px'
            },
            'height': (ele: NodeSingular) => {
              const isExtended = ele.data('isExtended')
              return isExtended ? '50px' : '60px'
            },
            'text-wrap': 'wrap',
            'text-max-width': '55px',
            'border-width': (ele: NodeSingular) => {
              const isExtended = ele.data('isExtended')
              return isExtended ? '2px' : '0px'
            },
            'border-style': 'dashed',
            'border-color': '#666'
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
            'width': 2,
            'line-color': '#666',
            'target-arrow-color': '#666',
            'target-arrow-shape': 'triangle',
            'curve-style': 'bezier',
            'arrow-scale': 1.2
          }
        },
        {
          selector: 'edge[type="related"]',
          style: {
            'width': 1,
            'line-color': '#999',
            'line-style': 'dashed',
            'curve-style': 'bezier'
          }
        }
      ],
      layout: {
        name: 'cola',
        animate: true,
        randomize: false,
        nodeSpacing: 80,
        edgeLength: 120,
        fit: true,
        padding: 50,
        avoidOverlap: true
      } as any,
      minZoom: 0.3,
      maxZoom: 3,
      wheelSensitivity: 0.2
    })

    cyRef.current = cy

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
      cy.destroy()
    }
  }, [])

  const handleClosePanel = () => {
    setIsPanelOpen(false)
    setSelectedNode(null)
    if (cyRef.current) {
      cyRef.current.$(':selected').unselect()
    }
  }

  const handleNodeClick = (nodeId: string) => {
    if (cyRef.current) {
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
      <div ref={containerRef} className="w-full h-full" />
      
      {/* 重置視圖按鈕 */}
      <button
        onClick={handleResetView}
        className="absolute top-4 right-4 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg shadow-lg z-10 flex items-center gap-2 transition-colors"
        title="重置視圖"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
        </svg>
        重置視圖
      </button>
      
      {/* 圖例 */}
      <div className="absolute top-20 right-4 bg-white shadow-lg rounded-lg p-4 z-10">
        <h3 className="font-bold mb-2 text-gray-800">圖例</h3>
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
