import { useState, useEffect } from 'react'
import { ThemeProvider } from './context/ThemeContext'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'

export default function App() {
  // role: null (not logged in) | 'admin' | 'guest'
  const [role, setRole] = useState(null)

  useEffect(() => {
    // Optional: auto-restore guest session on refresh
    const guest = localStorage.getItem('guestMode')
    if (guest === 'true') setRole('guest')
  }, [])

  const handleLogin = (loggedRole) => setRole(loggedRole || 'admin')

  const handleLogout = () => {
    localStorage.removeItem('guestMode')
    setRole(null)
  }

  return (
    <ThemeProvider>
      {role ? (
        <Dashboard onLogout={handleLogout} role={role} />
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </ThemeProvider>
  )
}