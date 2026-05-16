import { useState, useCallback, useMemo } from 'react'

export type MealKey = 'breakfast' | 'snack1' | 'lunch' | 'snack2' | 'dinner' | 'snack3'

export interface DiaryEntry {
  id: string
  name: string
  serves: number
}

export interface DayData {
  date: string
  breakfast: DiaryEntry[]
  snack1: DiaryEntry[]
  lunch: DiaryEntry[]
  snack2: DiaryEntry[]
  dinner: DiaryEntry[]
  snack3: DiaryEntry[]
}

export const MEAL_KEYS: MealKey[] = ['breakfast', 'snack1', 'lunch', 'snack2', 'dinner', 'snack3']

const STORAGE_KEY = 'carbs-tracker-diary'

function emptyDay(date: string): DayData {
  return { date, breakfast: [], snack1: [], lunch: [], snack2: [], dinner: [], snack3: [] }
}

function load(): DayData[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as DayData[]) : []
  } catch {
    return []
  }
}

function persist(days: DayData[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(days))
}

export function useDiary() {
  const [days, setDays] = useState<DayData[]>(load)

  const getDayData = useCallback((date: string): DayData => {
    return days.find(d => d.date === date) ?? emptyDay(date)
  }, [days])

  const addEntry = useCallback((date: string, meal: MealKey, name: string, serves: number) => {
    const entry: DiaryEntry = { id: crypto.randomUUID(), name: name.trim(), serves }
    setDays(prev => {
      const existing = prev.find(d => d.date === date)
      let next: DayData[]
      if (existing) {
        next = prev.map(d => d.date === date ? { ...d, [meal]: [...d[meal], entry] } : d)
      } else {
        const newDay = emptyDay(date)
        newDay[meal] = [entry]
        next = [...prev, newDay].sort((a, b) => a.date.localeCompare(b.date))
      }
      persist(next)
      return next
    })
  }, [])

  const deleteEntry = useCallback((date: string, meal: MealKey, entryId: string) => {
    setDays(prev => {
      const next = prev.map(d => {
        if (d.date !== date) return d
        return { ...d, [meal]: d[meal].filter(e => e.id !== entryId) }
      }).filter(d => MEAL_KEYS.some(k => d[k].length > 0))
      persist(next)
      return next
    })
  }, [])

  const oldestDate = useMemo(() => {
    return days.length > 0 ? days[0].date : null
  }, [days])

  const previousMeals = useMemo(() => {
    const seen = new Map<string, { name: string; serves: number }>()
    const sorted = [...days].sort((a, b) => b.date.localeCompare(a.date))
    for (const day of sorted) {
      for (const meal of MEAL_KEYS) {
        for (const entry of day[meal]) {
          const key = entry.name.toLowerCase()
          if (!seen.has(key)) seen.set(key, { name: entry.name, serves: entry.serves })
        }
      }
    }
    return Array.from(seen.values())
  }, [days])

  return { getDayData, addEntry, deleteEntry, oldestDate, previousMeals }
}
