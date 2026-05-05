import { useState } from 'react'
import { ServesCalculator } from './components/ServesCalculator'
import { TotalCarbsCalculator } from './components/TotalCarbsCalculator'
import { FoodCalculator } from './components/FoodCalculator'
import { TabBar, type Tab } from './components/TabBar'
import { SettingsPage } from './components/SettingsPage'
import { useTheme } from './hooks/useTheme'
import { useInstallPrompt } from './hooks/useInstallPrompt'

function InstallIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v12m0 0-4-4m4 4 4-4M4 20h16" />
    </svg>
  )
}

function CogIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z" />
    </svg>
  )
}

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('food')
  const [showSettings, setShowSettings] = useState(false)
  const { hue, isDark, setHue, setIsDark } = useTheme()
  const { canInstall, install } = useInstallPrompt()

  return (
    <div className="flex flex-col h-dvh bg-bg text-text">
      <header
        className="bg-bg border-b border-border px-5 py-4 flex items-center justify-between"
        style={{ paddingTop: 'max(env(safe-area-inset-top), 1rem)' }}
      >
        <h1 className="text-xl font-bold text-text">Carbs Calculator</h1>
        <div className="flex items-center gap-2">
          {canInstall && (
            <button
              onClick={install}
              className="w-9 h-9 flex items-center justify-center rounded-full bg-surface text-muted"
              aria-label="Install app"
            >
              <InstallIcon />
            </button>
          )}
          <button
            onClick={() => setShowSettings(true)}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-surface text-muted"
            aria-label="Open settings"
          >
            <CogIcon />
          </button>
        </div>
      </header>

      <main className="flex-1 min-h-0 overflow-y-auto">
        {activeTab === 'serves' && <ServesCalculator />}
        {activeTab === 'total' && <TotalCarbsCalculator />}
        {activeTab === 'food' && <FoodCalculator />}
      </main>

      <TabBar activeTab={activeTab} onTabChange={setActiveTab} />

      {showSettings && (
        <SettingsPage
          hue={hue}
          isDark={isDark}
          onHueChange={setHue}
          onDarkChange={setIsDark}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  )
}
