import { createContext, useContext, useState, useEffect, useCallback } from 'react'

const AppContext = createContext(null)

export const themes = {
  dark: { name: 'Dark AI', accent: '#00E5FF', accent2: '#7B61FF', bg: '#081120' },
  cyber: { name: 'Cyber Blue', accent: '#00FF9F', accent2: '#00E5FF', bg: '#071018' },
  gold: { name: 'FIFA Gold', accent: '#FFD700', accent2: '#FFA500', bg: '#0a0a00' },
  purple: { name: 'Midnight Purple', accent: '#7B61FF', accent2: '#9B7FFF', bg: '#080812' },
}

export function AppProvider({ children }) {
  const [favorites, setFavorites] = useState(() => {
    try { return JSON.parse(localStorage.getItem('msp_favorites') || '[]') } catch { return [] }
  })
  const [recentlyOpened, setRecentlyOpened] = useState(() => {
    try { return JSON.parse(localStorage.getItem('msp_recent') || '[]') } catch { return [] }
  })
  const [theme, setTheme] = useState(() => localStorage.getItem('msp_theme') || 'dark')
  const [toasts, setToasts] = useState([])
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  useEffect(() => { localStorage.setItem('msp_favorites', JSON.stringify(favorites)) }, [favorites])
  useEffect(() => { localStorage.setItem('msp_recent', JSON.stringify(recentlyOpened)) }, [recentlyOpened])
  useEffect(() => { localStorage.setItem('msp_theme', theme) }, [theme])

  const addToast = useCallback((message, type = 'info') => {
    const id = Date.now()
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3200)
  }, [])

  const toggleFavorite = useCallback((server) => {
    setFavorites(prev => {
      const exists = prev.find(f => f.id === server.id)
      if (exists) {
        addToast(`Removed from Favorites`, 'remove')
        return prev.filter(f => f.id !== server.id)
      } else {
        addToast(`Added to Favorites`, 'add')
        return [server, ...prev]
      }
    })
  }, [addToast])

  const isFavorite = useCallback((id) => favorites.some(f => f.id === id), [favorites])

  const openServer = useCallback((server) => {
    setRecentlyOpened(prev => {
      const filtered = prev.filter(r => r.id !== server.id)
      return [{ ...server, openedAt: Date.now() }, ...filtered].slice(0, 10)
    })
    window.open(server.url, '_blank', 'noopener,noreferrer')
  }, [])

  const copyLink = useCallback((url) => {
    navigator.clipboard.writeText(url).then(() => addToast('Link Copied to Clipboard', 'copy'))
  }, [addToast])

  useEffect(() => {
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        setCommandPaletteOpen(prev => !prev)
      }
      if (e.key === 'Escape') setCommandPaletteOpen(false)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  const currentTheme = themes[theme] || themes.dark

  return (
    <AppContext.Provider value={{
      favorites, toggleFavorite, isFavorite,
      recentlyOpened, openServer, copyLink,
      theme, setTheme, currentTheme,
      toasts, addToast,
      commandPaletteOpen, setCommandPaletteOpen,
      sidebarCollapsed, setSidebarCollapsed,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
