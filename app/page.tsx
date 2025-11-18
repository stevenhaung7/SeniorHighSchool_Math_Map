import ConceptMap from '@/components/ConceptMap'
import Header from '@/components/Header'

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <ConceptMap />
      </main>
    </div>
  )
}
