// 主題配置文件
export interface Topic {
  id: string
  name: string
  description: string
  dataFile: string
  color: string // Tailwind color class
  icon: string
}

export const topics: Topic[] = [
  {
    id: 'trigonometry',
    name: '三角函數',
    description: '三角比、三角函數、恆等式與應用',
    dataFile: 'trigonometry.json',
    color: 'blue',
    icon: '📐'
  },
  {
    id: 'vector',
    name: '向量',
    description: '平面與空間向量、內積、外積',
    dataFile: 'vector.json',
    color: 'purple',
    icon: '➡️'
  },
  {
    id: 'function',
    name: '函數',
    description: '一次、二次、指數、對數、三角函數',
    dataFile: 'function.json',
    color: 'green',
    icon: '📈'
  },
  {
    id: 'algebra',
    name: '代數',
    description: '方程式、不等式、數列、級數、多項式',
    dataFile: 'algebra.json',
    color: 'orange',
    icon: '🔢'
  },
  {
    id: 'probability',
    name: '排列組合與機率',
    description: '排列、組合、機率、條件機率、期望值',
    dataFile: 'probability.json',
    color: 'pink',
    icon: '🎲'
  },
  {
    id: 'geometry',
    name: '幾何',
    description: '平面幾何、立體幾何、坐標幾何、圓錐曲線',
    dataFile: 'geometry.json',
    color: 'cyan',
    icon: '📏'
  },
  {
    id: 'statistics',
    name: '統計學',
    description: '資料整理、集中趨勢、離散趨勢、相關與迴歸',
    dataFile: 'statistics.json',
    color: 'indigo',
    icon: '📊'
  },
  {
    id: 'calculus',
    name: '微積分',
    description: '極限、導數、積分、微分方程',
    dataFile: 'calculus.json',
    color: 'rose',
    icon: '∫'
  },
  {
    id: 'linear-algebra',
    name: '線性代數',
    description: '矩陣運算、行列式、向量空間、特徵值',
    dataFile: 'linear-algebra.json',
    color: 'teal',
    icon: '⊕'
  },
  {
    id: 'discrete-math',
    name: '離散數學',
    description: '邏輯、集合、關係、圖論、數論',
    dataFile: 'discrete-math.json',
    color: 'lime',
    icon: '🔗'
  }
]

export const getTopicById = (id: string): Topic | undefined => {
  return topics.find(topic => topic.id === id)
}
