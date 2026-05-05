interface Props {
  hue: number
  isDark: boolean
  onHueChange: (h: number) => void
  onDarkChange: (d: boolean) => void
  onClose: () => void
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative w-12 h-7 rounded-full transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
        checked ? 'bg-primary' : 'bg-border'
      }`}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow transition-transform duration-200 ${
          checked ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  )
}

export function SettingsPage({ hue, isDark, onHueChange, onDarkChange, onClose }: Props) {
  const previewColor = `hsl(${hue}, 65%, ${isDark ? 55 : 38}%)`

  return (
    <div
      className="fixed inset-0 z-50 bg-bg flex flex-col"
      style={{ animation: 'slide-up 0.25s ease-out' }}
    >
      <header
        className="bg-bg border-b border-border px-5 py-4 flex items-center justify-between"
        style={{ paddingTop: 'max(env(safe-area-inset-top), 1rem)' }}
      >
        <h2 className="text-xl font-bold text-text">Settings</h2>
        <button
          onClick={onClose}
          className="w-9 h-9 flex items-center justify-center rounded-full bg-surface text-muted"
          aria-label="Close settings"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>
      </header>

      <main className="flex-1 overflow-y-auto p-5 space-y-8">
        <section>
          <p className="text-xs font-semibold uppercase tracking-widest text-muted mb-3">Appearance</p>
          <div className="bg-surface rounded-2xl px-5 py-4 flex items-center justify-between">
            <span className="text-text font-medium">Dark mode</span>
            <Toggle checked={isDark} onChange={onDarkChange} />
          </div>
        </section>

        <section>
          <p className="text-xs font-semibold uppercase tracking-widest text-muted mb-3">Theme colour</p>
          <div className="bg-surface rounded-2xl px-5 py-5 space-y-5">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-full border-2 border-border shadow-sm shrink-0"
                style={{ backgroundColor: previewColor }}
              />
              <span className="text-text font-medium">{hue}°</span>
            </div>
            <input
              type="range"
              min={0}
              max={360}
              value={hue}
              onChange={(e) => onHueChange(parseInt(e.target.value, 10))}
              className="hue-slider w-full"
              style={{ '--thumb-color': previewColor } as React.CSSProperties}
            />
          </div>
        </section>
      </main>
    </div>
  )
}
