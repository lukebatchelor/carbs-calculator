import { useEffect, useState } from 'react'

const DEFAULT_HUE = 142

function applyTheme(hue: number, isDark: boolean) {
  const root = document.documentElement
  root.style.setProperty('--hue', String(hue))
  root.classList.toggle('dark', isDark)
}

export function useTheme() {
  const [hue, setHueState] = useState<number>(() => {
    const s = localStorage.getItem('theme-hue')
    return s ? parseInt(s, 10) : DEFAULT_HUE
  })

  const [isDark, setIsDarkState] = useState<boolean>(() => {
    const s = localStorage.getItem('theme-dark')
    return s !== null ? s === 'true' : window.matchMedia('(prefers-color-scheme: dark)').matches
  })

  useEffect(() => {
    applyTheme(hue, isDark)
  }, [hue, isDark])

  const setHue = (h: number) => {
    localStorage.setItem('theme-hue', String(h))
    setHueState(h)
  }

  const setIsDark = (dark: boolean) => {
    localStorage.setItem('theme-dark', String(dark))
    setIsDarkState(dark)
  }

  return { hue, isDark, setHue, setIsDark }
}
