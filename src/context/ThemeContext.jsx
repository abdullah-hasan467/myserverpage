import { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext({ theme: 'dark', toggleTheme: () => {} })

const LS_THEME = 'msp_theme'

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem(LS_THEME) || 'dark'
    } catch {
      return 'dark'
    }
  })

  useEffect(() => {
    try { localStorage.setItem(LS_THEME, theme) } catch {}
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  const toggleTheme = () => setTheme(prev => (prev === 'dark' ? 'light' : 'dark'))

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)

// ─── Shared theme tokens used across Login & Dashboard ─────────────────
export const THEMES = {
  dark: {
    bgPrimary: '#070f1c',
    bgSecondary: '#0d1f35',
    bgGradientFrom: '#0a1628',
    text: '#ccc',
    textBright: '#f0f0f0',
    textMuted: '#555',
    textFaint: '#444',
    cardBg: 'rgba(255,255,255,0.03)',
    cardBgHover: 'rgba(255,255,255,0.06)',
    border: 'rgba(255,255,255,0.07)',
    glassBg: 'rgba(7,15,28,0.9)',
    inputBg: 'rgba(255,255,255,0.05)',
    sidebarBg: 'rgba(6,14,26,0.98)',
    initBg: '#081120',
  },
  light: {
    bgPrimary: '#f4f7fb',
    bgSecondary: '#ffffff',
    bgGradientFrom: '#ffffff',
    text: '#333',
    textBright: '#1a1f2b',
    textMuted: '#888',
    textFaint: '#aaa',
    cardBg: 'rgba(0,0,0,0.02)',
    cardBgHover: 'rgba(0,0,0,0.05)',
    border: 'rgba(0,0,0,0.08)',
    glassBg: 'rgba(255,255,255,0.85)',
    inputBg: 'rgba(0,0,0,0.03)',
    sidebarBg: 'rgba(255,255,255,0.98)',
    initBg: '#eef2f8',
  },
}