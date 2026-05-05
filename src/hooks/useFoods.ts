import { useState, useCallback } from 'react'

export interface Food {
  id: string
  name: string
  carbsPer100g: number
}

const DEFAULT_FOODS: Food[] = [
  { id: 'default-1', name: 'Basmati Rice (cooked)', carbsPer100g: 25.2 },
  { id: 'default-2', name: 'Pasta (cooked)', carbsPer100g: 25 },
  { id: 'default-3', name: 'Bread (white)', carbsPer100g: 49 },
  { id: 'default-4', name: 'Oats (dry)', carbsPer100g: 67 },
  { id: 'default-5', name: 'Weetbix', carbsPer100g: 63 },
  { id: 'default-6', name: 'Potato (boiled)', carbsPer100g: 17 },
  { id: 'default-7', name: 'Sweet Potato (boiled)', carbsPer100g: 20 },
  { id: 'default-8', name: 'Banana', carbsPer100g: 23 },
  { id: 'default-9', name: 'Cornflakes', carbsPer100g: 84 },
  { id: 'default-10', name: 'Sourdough', carbsPer100g: 44 },
]

const STORAGE_KEY = 'carbs-tracker-foods'

function load(): Food[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as Food[]) : DEFAULT_FOODS
  } catch {
    return DEFAULT_FOODS
  }
}

function persist(foods: Food[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(foods))
}

export function useFoods() {
  const [foods, setFoods] = useState<Food[]>(load)

  const addFood = useCallback((name: string, carbsPer100g: number): Food => {
    const food: Food = { id: crypto.randomUUID(), name, carbsPer100g }
    setFoods(prev => {
      const next = [...prev, food]
      persist(next)
      return next
    })
    return food
  }, [])

  const updateFood = useCallback((id: string, name: string, carbsPer100g: number) => {
    setFoods(prev => {
      const next = prev.map(f => f.id === id ? { ...f, name, carbsPer100g } : f)
      persist(next)
      return next
    })
  }, [])

  const deleteFood = useCallback((id: string) => {
    setFoods(prev => {
      const next = prev.filter(f => f.id !== id)
      persist(next)
      return next
    })
  }, [])

  return { foods, addFood, updateFood, deleteFood }
}
