import { useState } from 'react'
import { AppProvider } from './context/AppContext'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false)

  return (
    <AppProvider>
      {loggedIn
        ? <Dashboard onLogout={() => setLoggedIn(false)} />
        : <Login onLogin={() => setLoggedIn(true)} />
      }
    </AppProvider>
  )
}
