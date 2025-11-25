'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

interface TopicContextType {
  currentTopic: string
  setCurrentTopic: (topic: string) => void
}

const TopicContext = createContext<TopicContextType | undefined>(undefined)

export function TopicProvider({ children }: { children: ReactNode }) {
  const [currentTopic, setCurrentTopic] = useState('trigonometry')

  return (
    <TopicContext.Provider value={{ currentTopic, setCurrentTopic }}>
      {children}
    </TopicContext.Provider>
  )
}

export function useTopic() {
  const context = useContext(TopicContext)
  if (context === undefined) {
    throw new Error('useTopic must be used within a TopicProvider')
  }
  return context
}
