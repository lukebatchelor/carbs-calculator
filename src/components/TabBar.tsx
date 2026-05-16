export type Tab = 'diary' | 'serves' | 'total' | 'food'

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

function DiaryIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
      <rect x="4" y="3" width="16" height="18" rx="2" />
      <path strokeLinecap="round" d="M8 8h8M8 12h8M8 16h5" />
      <path strokeLinecap="round" strokeWidth="2" d="M4 7h2M4 12h2M4 17h2" />
    </svg>
  )
}

function FoodIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
      {/* Bowl body */}
      <path strokeLinecap="round" d="M4.5 9.5 C4 17 8.5 19.5 12 19.5 C15.5 19.5 20 17 19.5 9.5" />
      {/* Rim */}
      <ellipse cx="12" cy="9.5" rx="7.5" ry="2.5" />
      {/* Pasta wave 1 */}
      <path strokeLinecap="round" d="M8 12.5 Q9.5 11 11 12.5 Q12.5 14 14 12.5 Q15.5 11 16 12.5" />
      {/* Pasta wave 2 */}
      <path strokeLinecap="round" d="M9 15.5 Q10.5 14 12 15.5 Q13.5 17 15 15.5" />
    </svg>
  )
}

const tabs: { id: Tab; label: string; Icon: () => React.JSX.Element }[] = [
  { id: 'diary', label: 'Diary', Icon: DiaryIcon },
  { id: 'food', label: 'Foods', Icon: FoodIcon },
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
