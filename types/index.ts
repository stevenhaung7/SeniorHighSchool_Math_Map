/**
 * 觀念節點
 */
export interface ConceptNode {
  id: string;
  name: string;
  description: string;
  category: '基礎觀念' | '核心概念' | '進階應用' | '整合應用';
  level: 1 | 2 | 3 | 4;
  prerequisites: string[];  // 強依賴 - 必須先懂的觀念
  related: string[];        // 弱依賴 - 相關但非必要的觀念
  tags: string[];
  isExtended?: boolean;     // 是否為延伸教材
  crossDiscipline?: string; // 跨學科標記
  examples?: string[];      // 預留題目 ID 欄位
}

/**
 * 連結邊
 */
export interface Edge {
  from: string;
  to: string;
  type: 'prerequisite' | 'related';
  strength?: 'strong' | 'weak';
}

/**
 * 題目範例
 */
export interface Example {
  id: string;
  title: string;
  question: string;          // 題目敘述
  options?: string[];        // 選擇題選項（選填）
  answer: string;            // 答案
  solution: string;          // 詳解
  difficulty: 'easy' | 'medium' | 'hard';
  relatedNodes: string[];
  tags: string[];
  hint?: string;             // 提示
  type: 'choice' | 'calc' | 'proof';  // 題型：選擇、計算、證明
}

/**
 * 完整資料結構
 */
export interface MathMapData {
  topic: string;
  version: string;
  lastUpdated: string;
  nodes: ConceptNode[];
  edges: Edge[];
  examples: Example[];
}
