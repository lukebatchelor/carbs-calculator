import { useState } from 'react'
import { useFoods, type Food } from '../hooks/useFoods'
import { InputField } from './InputField'

function TrashIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" />
    </svg>
  )
}

function XIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
      <path strokeLinecap="round" strokeLinejoin="round" d="M18 6 6 18M6 6l12 12" />
    </svg>
  )
}

export function FoodCalculator() {
  const { foods, addFood, updateFood, deleteFood } = useFoods()

  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [selectedFood, setSelectedFood] = useState<Food | null>(null)
  const [isNew, setIsNew] = useState(false)
  const [editName, setEditName] = useState('')
  const [editCarbs, setEditCarbs] = useState('')
  const [targetCarbs, setTargetCarbs] = useState('')

  const filtered = foods.filter(f =>
    f.name.toLowerCase().includes(query.toLowerCase())
  )
  const hasExactMatch = foods.some(
    f => f.name.toLowerCase() === query.trim().toLowerCase()
  )
  const showAddOption = query.trim().length > 0 && !hasExactMatch
  const showPanel = selectedFood !== null || isNew

  const editCarbsNum = parseFloat(editCarbs)
  const editCarbsValid = editCarbs !== '' && !isNaN(editCarbsNum) && editCarbsNum > 0

  const hasChanges = selectedFood !== null && (
    editName.trim() !== selectedFood.name ||
    (editCarbsValid && editCarbsNum !== selectedFood.carbsPer100g)
  )
  const canSave = editName.trim() !== '' && editCarbsValid && (isNew || hasChanges)

  const carbsForCalc = editCarbsValid ? editCarbsNum : null
  const targetNum = parseFloat(targetCarbs)
  const result = targetCarbs && carbsForCalc ? (targetNum / carbsForCalc) * 100 : null
  const resultValid = result !== null && isFinite(result) && result > 0

  function selectFood(food: Food) {
    setSelectedFood(food)
    setIsNew(false)
    setEditName(food.name)
    setEditCarbs(food.carbsPer100g.toString())
    setQuery(food.name)
    setIsOpen(false)
  }

  function startAddNew() {
    setSelectedFood(null)
    setIsNew(true)
    setEditName(query.trim())
    setEditCarbs('')
    setQuery('')
    setIsOpen(false)
  }

  function clearSelection() {
    setSelectedFood(null)
    setIsNew(false)
    setEditName('')
    setEditCarbs('')
    setQuery('')
    setIsOpen(false)
  }

  function handleSave() {
    if (!canSave) return
    const carbs = parseFloat(editCarbs)
    if (isNew) {
      const food = addFood(editName.trim(), carbs)
      setSelectedFood(food)
      setIsNew(false)
    } else if (selectedFood) {
      updateFood(selectedFood.id, editName.trim(), carbs)
      setSelectedFood({ ...selectedFood, name: editName.trim(), carbsPer100g: carbs })
      setQuery(editName.trim())
    }
  }

  function handleDelete() {
    if (!selectedFood) return
    deleteFood(selectedFood.id)
    clearSelection()
  }

  return (
    <div className="p-5">
      <p className="text-muted text-sm mb-6">Select a food to calculate grams for a carb target</p>

      {/* Typeahead */}
      <div className="relative mb-4">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted mb-2">Food</p>
        <div className="flex items-center bg-surface border-2 border-border rounded-2xl px-5 py-3 gap-3 focus-within:border-primary transition-colors">
          <input
            type="text"
            value={query}
            onChange={e => { setQuery(e.target.value); setIsOpen(true) }}
            onFocus={() => setIsOpen(true)}
            onBlur={() => {
              setTimeout(() => {
                setIsOpen(false)
                if (selectedFood) setQuery(selectedFood.name)
                else if (!isNew) setQuery('')
              }, 150)
            }}
            placeholder="Search or add a food..."
            className="flex-1 text-lg font-medium text-text bg-transparent outline-none min-w-0 placeholder:text-border"
          />
          {(query || showPanel) && (
            <button
              onMouseDown={e => { e.preventDefault(); clearSelection() }}
              className="text-muted hover:text-text transition-colors p-0.5 shrink-0"
              aria-label="Clear selection"
            >
              <XIcon />
            </button>
          )}
        </div>

        {isOpen && (filtered.length > 0 || showAddOption) && (
          <div className="absolute z-10 top-full mt-1 left-0 right-0 bg-bg border border-border rounded-2xl shadow-lg overflow-hidden max-h-64 overflow-y-auto">
            {filtered.map(food => (
              <button
                key={food.id}
                onClick={() => selectFood(food)}
                className="w-full text-left px-5 py-3 hover:bg-surface transition-colors flex items-center justify-between gap-3"
              >
                <span className="font-medium text-text truncate">{food.name}</span>
                <span className="text-sm text-muted shrink-0">{food.carbsPer100g}g / 100g</span>
              </button>
            ))}
            {showAddOption && (
              <button
                onClick={startAddNew}
                className={`w-full text-left px-5 py-3 hover:bg-surface transition-colors text-primary font-medium${filtered.length > 0 ? ' border-t border-border' : ''}`}
              >
                + Add "{query.trim()}"
              </button>
            )}
          </div>
        )}
      </div>

      {/* Edit / new food panel */}
      {showPanel && (
        <div className="mb-6 bg-surface border border-border rounded-2xl p-4">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted mb-3">
            {isNew ? 'New Food' : 'Edit Food'}
          </p>

          <div className="mb-3">
            <label className="text-xs text-muted block mb-1.5">Name</label>
            <input
              type="text"
              value={editName}
              onChange={e => setEditName(e.target.value)}
              className="w-full bg-bg border border-border rounded-xl px-4 py-2.5 text-text font-medium outline-none focus:border-primary transition-colors"
            />
          </div>

          <div className="mb-4">
            <label className="text-xs text-muted block mb-1.5">Carbs per 100g</label>
            <div className="flex items-center bg-bg border border-border rounded-xl px-4 py-2.5 gap-2 focus-within:border-primary transition-colors">
              <input
                type="number"
                inputMode="decimal"
                value={editCarbs}
                onChange={e => setEditCarbs(e.target.value)}
                placeholder="0"
                className="flex-1 text-text font-medium bg-transparent outline-none min-w-0 placeholder:text-border"
              />
              <span className="text-sm text-muted shrink-0">g / 100g</span>
            </div>
          </div>

          <div className="flex gap-2">
            {!isNew && (
              <button
                onClick={handleDelete}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-border text-muted hover:text-red-500 hover:border-red-300 transition-colors text-sm font-medium shrink-0"
              >
                <TrashIcon />
                Delete
              </button>
            )}
            <button
              onClick={handleSave}
              disabled={!canSave}
              className={`flex-1 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                canSave
                  ? 'bg-primary text-white'
                  : 'bg-border text-muted cursor-not-allowed opacity-60'
              }`}
            >
              Save
            </button>
          </div>
        </div>
      )}

      {/* Calculator */}
      <InputField
        label="Target carbs"
        value={targetCarbs}
        onChange={setTargetCarbs}
        unit="g"
      />

      <div className="mt-6 rounded-3xl bg-primary-subtle p-8 text-center min-h-36 flex flex-col items-center justify-center">
        {resultValid ? (
          <>
            <p className="text-xs font-semibold uppercase tracking-widest text-muted mb-2">Use</p>
            <p className="text-6xl font-bold text-result leading-none">{(result as number).toFixed(1)}</p>
            <p className="text-lg text-muted mt-2">
              grams of {isNew ? (editName || 'food') : selectedFood?.name}
            </p>
          </>
        ) : (
          <p className="text-muted text-sm">
            {!showPanel
              ? 'Select or add a food above'
              : !targetCarbs
              ? 'Enter a carb target above'
              : 'Enter valid values above'}
          </p>
        )}
      </div>
    </div>
  )
}
