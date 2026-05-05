import { useEffect, useState } from 'react'

const DEFAULT_HUE = 142

export function accentVars(hue: number, isDark: boolean) {
  const l  = isDark ? 55 : 38
  const ld = isDark ? 45 : 30
  return {
    '--color-primary':        `hsl(${hue}, 65%, ${l}%)`,
    '--color-primary-dark':   `hsl(${hue}, 70%, ${ld}%)`,
    '--color-primary-subtle': isDark ? `hsl(${hue}, 30%, 16%)` : `hsl(${hue}, 60%, 95%)`,
    '--color-result':         isDark ? `hsl(${hue}, 60%, 80%)` : `hsl(${hue}, 75%, 20%)`,
  }
}

function applyTheme(hue: number, isDark: boolean) {
  const root = document.documentElement
  const vars = accentVars(hue, isDark)
  for (const [k, v] of Object.entries(vars)) root.style.setProperty(k, v)
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
