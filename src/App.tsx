import { useState } from 'react'
import { ServesCalculator } from './components/ServesCalculator'
import { TotalCarbsCalculator } from './components/TotalCarbsCalculator'
import { TabBar, type Tab } from './components/TabBar'

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('serves')

  return (
    <div className="flex flex-col h-dvh bg-bg text-text">
      <header
        className="bg-bg border-b border-border px-5 py-4"
        style={{ paddingTop: 'max(env(safe-area-inset-top), 1rem)' }}
      >
        <h1 className="text-xl font-bold text-text">Carbs Tracker</h1>
      </header>
      <main className="flex-1 overflow-y-auto">
        {activeTab === 'serves' ? <ServesCalculator /> : <TotalCarbsCalculator />}
      </main>
      <TabBar activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  )
}
