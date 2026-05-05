export type Tab = 'serves' | 'total'

interface Props {
  activeTab: Tab
  onTabChange: (tab: Tab) => void
}

function ServesIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
      <rect x="3" y="5" width="18" height="3" rx="1.5" />
      <rect x="5" y="10" width="14" height="3" rx="1.5" />
      <rect x="7" y="15" width="10" height="3" rx="1.5" />
    </svg>
  )
}

function TargetIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  )
}

const tabs: { id: Tab; label: string; Icon: () => React.JSX.Element }[] = [
  { id: 'serves', label: 'By Serves', Icon: ServesIcon },
  { id: 'total', label: 'Total Carbs', Icon: TargetIcon },
]

export function TabBar({ activeTab, onTabChange }: Props) {
  return (
    <nav
      className="bg-surface border-t border-border"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="flex">
        {tabs.map(({ id, label, Icon }) => (
          <button
            key={id}
            onClick={() => onTabChange(id)}
            className={`flex-1 flex flex-col items-center gap-1 py-3 transition-colors ${
              activeTab === id ? 'text-primary' : 'text-muted'
            }`}
          >
            <Icon />
            <span className="text-xs font-medium">{label}</span>
          </button>
        ))}
      </div>
    </nav>
  )
}
