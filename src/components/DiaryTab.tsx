import { useState, useRef, useId } from 'react'
import { useDiary, type MealKey, type DiaryEntry, MEAL_KEYS } from '../hooks/useDiary'

const MEAL_LABELS: Record<MealKey, string> = {
  breakfast: 'Breakfast',
  snack1: 'Snack 1',
  lunch: 'Lunch',
  snack2: 'Snack 2',
  dinner: 'Dinner',
  snack3: 'Snack 3',
}

function todayStr(): string {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function shiftDate(date: string, n: number): string {
  const d = new Date(`${date}T00:00:00`)
  d.setDate(d.getDate() + n)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function formatDate(dateStr: string): string {
  const t = todayStr()
  if (dateStr === t) return 'Today'
  if (dateStr === shiftDate(t, -1)) return 'Yesterday'
  const d = new Date(`${dateStr}T00:00:00`)
  return d.toLocaleDateString('en-AU', { weekday: 'short', day: 'numeric', month: 'short' })
}

function formatServes(n: number): string {
  return n === Math.floor(n) ? String(n) : n.toFixed(1)
}

function ChevronLeftIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 18l-6-6 6-6" />
    </svg>
  )
}

function ChevronRightIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 18l6-6-6-6" />
    </svg>
  )
}

function PlusIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4">
      <path strokeLinecap="round" d="M12 5v14M5 12h14" />
    </svg>
  )
}

function XSmallIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M18 6 6 18M6 6l12 12" />
    </svg>
  )
}

interface AddMealFormProps {
  previousMeals: { name: string; serves: number }[]
  onSave: (name: string, serves: number) => void
  onCancel: () => void
}

function AddMealForm({ previousMeals, onSave, onCancel }: AddMealFormProps) {
  const nameId = useId()
  const servesId = useId()

  const [query, setQuery] = useState('')
  const [dropdownOpen, setDropdownOpen] = useState(true)
  const [showPanel, setShowPanel] = useState(false)
  const [editName, setEditName] = useState('')
  const [editServes, setEditServes] = useState('')

  const filtered = previousMeals.filter(m =>
    m.name.toLowerCase().includes(query.toLowerCase())
  )
  const hasExactMatch = previousMeals.some(
    m => m.name.toLowerCase() === query.trim().toLowerCase()
  )
  const showAddOption = query.trim().length > 0 && !hasExactMatch

  const editServesNum = parseFloat(editServes)
  const editServesValid = editServes !== '' && !isNaN(editServesNum) && editServesNum > 0
  const canSave = editName.trim() !== '' && editServesValid

  function selectPrior(meal: { name: string; serves: number }) {
    setEditName(meal.name)
    setEditServes(meal.serves.toString())
    setQuery(meal.name)
    setDropdownOpen(false)
    setShowPanel(true)
  }

  function startAddNew() {
    setEditName(query.trim())
    setEditServes('')
    setDropdownOpen(false)
    setShowPanel(true)
  }

  function handleSave() {
    if (!canSave) return
    onSave(editName.trim(), editServesNum)
  }

  return (
    <div className="mt-2 pt-3 border-t border-border">
      {/* Autocomplete input */}
      <div className="relative mb-2">
        <div className="flex items-center bg-bg border border-border rounded-xl px-4 py-2.5 gap-2 focus-within:border-primary transition-colors">
          <input
            autoFocus
            type="text"
            value={query}
            onChange={e => { setQuery(e.target.value); setDropdownOpen(true); setShowPanel(false) }}
            onFocus={() => setDropdownOpen(true)}
            onBlur={() => setTimeout(() => setDropdownOpen(false), 150)}
            placeholder="Search or add a meal…"
            className="flex-1 bg-transparent outline-none min-w-0 text-text font-medium placeholder:text-border"
          />
        </div>

        {dropdownOpen && (filtered.length > 0 || showAddOption) && (
          <div className="absolute z-10 top-full mt-1 left-0 right-0 bg-bg border border-border rounded-xl shadow-lg overflow-hidden max-h-48 overflow-y-auto">
            {filtered.map(meal => (
              <button
                key={meal.name}
                onMouseDown={e => { e.preventDefault(); selectPrior(meal) }}
                className="w-full text-left px-4 py-2.5 hover:bg-surface transition-colors flex items-center justify-between gap-3"
              >
                <span className="font-medium text-text truncate">{meal.name}</span>
                <span className="text-sm text-muted shrink-0">({formatServes(meal.serves)} serves)</span>
              </button>
            ))}
            {showAddOption && (
              <button
                onMouseDown={e => { e.preventDefault(); startAddNew() }}
                className={`w-full text-left px-4 py-2.5 hover:bg-surface transition-colors text-primary font-medium${filtered.length > 0 ? ' border-t border-border' : ''}`}
              >
                + Add "{query.trim()}"
              </button>
            )}
          </div>
        )}
      </div>

      {/* Edit panel */}
      {showPanel && (
        <div className="mb-2 bg-surface border border-border rounded-xl p-3">
          <div className="mb-2.5">
            <label htmlFor={nameId} className="text-xs text-muted block mb-1">Name</label>
            <input
              id={nameId}
              type="text"
              value={editName}
              onChange={e => setEditName(e.target.value)}
              className="w-full bg-bg border border-border rounded-lg px-3 py-2 text-sm text-text font-medium outline-none focus:border-primary transition-colors"
            />
          </div>
          <div className="mb-3">
            <label htmlFor={servesId} className="text-xs text-muted block mb-1">Serves</label>
            <div className="flex items-center bg-bg border border-border rounded-lg px-3 py-2 gap-2 focus-within:border-primary transition-colors">
              <input
                id={servesId}
                type="number"
                inputMode="decimal"
                value={editServes}
                onChange={e => setEditServes(e.target.value)}
                placeholder="0"
                className="flex-1 text-sm text-text font-medium bg-transparent outline-none min-w-0 placeholder:text-border"
              />
              <span className="text-xs text-muted shrink-0">serves</span>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={onCancel}
              className="px-4 py-2 rounded-lg border border-border text-muted text-sm font-medium hover:text-text transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!canSave}
              className={`flex-1 py-2 rounded-lg font-semibold text-sm transition-all ${
                canSave ? 'bg-primary text-white' : 'bg-border text-muted cursor-not-allowed opacity-60'
              }`}
            >
              Add
            </button>
          </div>
        </div>
      )}

      {!showPanel && (
        <div className="flex justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-lg border border-border text-muted text-sm font-medium hover:text-text transition-colors"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  )
}

interface MealSectionProps {
  label: string
  entries: DiaryEntry[]
  isAdding: boolean
  previousMeals: { name: string; serves: number }[]
  onStartAdd: () => void
  onSaveEntry: (name: string, serves: number) => void
  onCancelAdd: () => void
  onDeleteEntry: (id: string) => void
}

function MealSection({
  label, entries, isAdding, previousMeals,
  onStartAdd, onSaveEntry, onCancelAdd, onDeleteEntry,
}: MealSectionProps) {
  const sectionServes = entries.reduce((s, e) => s + e.serves, 0)

  return (
    <div className="mb-5">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-baseline gap-2">
          <span className="text-sm font-semibold text-text">{label}</span>
          {sectionServes > 0 && (
            <span className="text-xs text-muted">{formatServes(sectionServes)} serves</span>
          )}
        </div>
        {!isAdding && (
          <button
            onClick={onStartAdd}
            className="w-7 h-7 flex items-center justify-center rounded-full bg-surface text-primary hover:bg-primary-subtle transition-colors"
            aria-label={`Add to ${label}`}
          >
            <PlusIcon />
          </button>
        )}
      </div>

      {entries.length > 0 && (
        <div className="space-y-1.5">
          {entries.map(entry => (
            <div key={entry.id} className="flex items-center justify-between bg-surface rounded-xl px-4 py-2.5 gap-3">
              <span className="text-sm font-medium text-text truncate">{entry.name}</span>
              <div className="flex items-center gap-2.5 shrink-0">
                <span className="text-sm text-muted">{formatServes(entry.serves)} serves</span>
                <button
                  onClick={() => onDeleteEntry(entry.id)}
                  className="text-muted hover:text-red-500 transition-colors p-0.5"
                  aria-label={`Remove ${entry.name}`}
                >
                  <XSmallIcon />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {isAdding && (
        <AddMealForm
          previousMeals={previousMeals}
          onSave={onSaveEntry}
          onCancel={onCancelAdd}
        />
      )}
    </div>
  )
}

export function DiaryTab() {
  const { getDayData, addEntry, deleteEntry, oldestDate, previousMeals } = useDiary()
  const [currentDate, setCurrentDate] = useState(todayStr)
  const [addingTo, setAddingTo] = useState<MealKey | null>(null)
  const dateInputRef = useRef<HTMLInputElement>(null)

  const dayData = getDayData(currentDate)
  const today = todayStr()
  const canGoBack = oldestDate !== null && currentDate > oldestDate
  const canGoForward = currentDate < today

  const totalServes = MEAL_KEYS.reduce((sum, meal) =>
    sum + dayData[meal].reduce((s, e) => s + e.serves, 0), 0
  )

  function goBack() {
    if (!canGoBack) return
    setCurrentDate(shiftDate(currentDate, -1))
    setAddingTo(null)
  }

  function goForward() {
    if (!canGoForward) return
    setCurrentDate(shiftDate(currentDate, 1))
    setAddingTo(null)
  }

  function handleDateChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.value) {
      setCurrentDate(e.target.value)
      setAddingTo(null)
    }
  }

  function handleSaveEntry(meal: MealKey, name: string, serves: number) {
    addEntry(currentDate, meal, name, serves)
    setAddingTo(null)
  }

  const isFirstVisit = oldestDate === null

  return (
    <div className="p-5">
      {/* Date navigation */}
      <div className="flex items-center justify-between mb-5">
        <button
          onClick={goBack}
          disabled={!canGoBack}
          className={`w-9 h-9 flex items-center justify-center rounded-full transition-colors ${
            canGoBack ? 'text-text hover:bg-surface' : 'text-border cursor-not-allowed'
          }`}
          aria-label="Previous day"
        >
          <ChevronLeftIcon />
        </button>

        <div className="relative">
          <button
            className="text-base font-semibold text-text hover:text-primary transition-colors cursor-pointer"
            onClick={() => {
              try { dateInputRef.current?.showPicker() } catch { dateInputRef.current?.click() }
            }}
          >
            {formatDate(currentDate)}
          </button>
          <input
            ref={dateInputRef}
            type="date"
            value={currentDate}
            max={today}
            onChange={handleDateChange}
            className="absolute left-1/2 top-full opacity-0 pointer-events-none w-0 h-0"
            tabIndex={-1}
            aria-hidden="true"
          />
        </div>

        <button
          onClick={goForward}
          disabled={!canGoForward}
          className={`w-9 h-9 flex items-center justify-center rounded-full transition-colors ${
            canGoForward ? 'text-text hover:bg-surface' : 'text-border cursor-not-allowed'
          }`}
          aria-label="Next day"
        >
          <ChevronRightIcon />
        </button>
      </div>

      {/* Total serves */}
      <div className="mb-6 rounded-3xl bg-primary-subtle p-6 text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted mb-1">Total</p>
        <p className="text-5xl font-bold text-result leading-none">{formatServes(totalServes)}</p>
        <p className="text-sm text-muted mt-2">{totalServes === 1 ? 'serve' : 'serves'} today</p>
      </div>

      {/* First-visit empty state */}
      {isFirstVisit && (
        <p className="text-sm text-muted text-center mb-5">Add your first meal below to start tracking</p>
      )}

      {/* Meal sections */}
      {MEAL_KEYS.map(meal => (
        <MealSection
          key={meal}
          label={MEAL_LABELS[meal]}
          entries={dayData[meal]}
          isAdding={addingTo === meal}
          previousMeals={previousMeals}
          onStartAdd={() => setAddingTo(meal)}
          onSaveEntry={(name, serves) => handleSaveEntry(meal, name, serves)}
          onCancelAdd={() => setAddingTo(null)}
          onDeleteEntry={id => deleteEntry(currentDate, meal, id)}
        />
      ))}
    </div>
  )
}
