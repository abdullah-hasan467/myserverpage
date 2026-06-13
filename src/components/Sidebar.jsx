import { motion, AnimatePresence } from 'framer-motion'
import { Home, Star, Clock, Search, Palette, LogOut, ChevronLeft, ChevronRight, Server, Tv, HardDrive, Globe, Zap } from 'lucide-react'
import { useApp, themes } from '../context/AppContext'

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: Home },
  { id: 'search', label: 'Search', icon: Search },
  { id: 'favorites', label: 'Favorites', icon: Star },
  { id: 'recent', label: 'Recent', icon: Clock },
]

const categoryIcons = { fiber: HardDrive, dflix: Tv, livetv: Tv, sherpur: Globe, universal: Globe }

export default function Sidebar({ activeView, setActiveView, onLogout, categories }) {
  const { sidebarCollapsed, setSidebarCollapsed, theme, setTheme, favorites } = useApp()
  const collapsed = sidebarCollapsed

  return (
    <motion.aside
      animate={{ width: collapsed ? 72 : 260 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      className="relative flex-shrink-0 h-screen flex flex-col overflow-hidden"
      style={{
        background: 'rgba(8,17,32,0.95)',
        borderRight: '1px solid rgba(0,229,255,0.1)',
        backdropFilter: 'blur(20px)',
        zIndex: 50,
      }}
    >
      {/* Toggle button */}
      <button
        onClick={() => setSidebarCollapsed(!collapsed)}
        className="absolute -right-3 top-20 z-10 w-6 h-6 rounded-full flex items-center justify-center transition-all hover:scale-110"
        style={{
          background: 'linear-gradient(135deg, #00E5FF, #7B61FF)',
          boxShadow: '0 0 12px rgba(0,229,255,0.4)',
        }}
      >
        {collapsed ? <ChevronRight size={12} color="white" /> : <ChevronLeft size={12} color="white" />}
      </button>

      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5" style={{ borderBottom: '1px solid rgba(0,229,255,0.08)' }}>
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{
            background: 'linear-gradient(135deg, rgba(0,229,255,0.2), rgba(123,97,255,0.2))',
            border: '1px solid rgba(0,229,255,0.3)',
            boxShadow: '0 0 20px rgba(0,229,255,0.15)',
          }}
        >
          <Server size={20} color="#00E5FF" />
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
            >
              <div className="text-sm font-black tracking-wider gradient-text leading-tight">MY SERVER</div>
              <div className="text-xs text-gray-500 tracking-widest">PAGE</div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 space-y-1 overflow-y-auto px-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = activeView === item.id
          return (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`sidebar-item w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all ${isActive ? 'active' : ''}`}
              style={{
                background: isActive
                  ? 'linear-gradient(135deg, rgba(0,229,255,0.1), rgba(123,97,255,0.1))'
                  : 'transparent',
                color: isActive ? '#00E5FF' : 'rgba(255,255,255,0.5)',
              }}
              title={collapsed ? item.label : undefined}
            >
              <Icon size={18} className="flex-shrink-0" />
              <AnimatePresence>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0, x: -5 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -5 }}
                    transition={{ duration: 0.15 }}
                    className="text-sm font-medium"
                  >
                    {item.label}
                    {item.id === 'favorites' && favorites.length > 0 && (
                      <span className="ml-2 text-xs px-1.5 py-0.5 rounded-full"
                        style={{ background: 'rgba(0,229,255,0.15)', color: '#00E5FF' }}>
                        {favorites.length}
                      </span>
                    )}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          )
        })}

        {/* Divider */}
        <div className="py-2 px-3">
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-xs font-semibold tracking-widest uppercase mb-2"
                style={{ color: 'rgba(255,255,255,0.2)' }}
              >
                Categories
              </motion.div>
            )}
          </AnimatePresence>
          {!collapsed && <div style={{ height: '1px', background: 'rgba(0,229,255,0.08)' }} />}
        </div>

        {/* Category shortcuts */}
        {categories.map((cat) => {
          const isActive = activeView === `cat_${cat.id}`
          return (
            <button
              key={cat.id}
              onClick={() => setActiveView(`cat_${cat.id}`)}
              className={`sidebar-item w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left transition-all ${isActive ? 'active' : ''}`}
              style={{
                background: isActive ? `${cat.color}15` : 'transparent',
                color: isActive ? cat.color : 'rgba(255,255,255,0.4)',
              }}
              title={collapsed ? cat.name : undefined}
            >
              <span className="text-base flex-shrink-0">{cat.icon}</span>
              <AnimatePresence>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0, x: -5 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="text-xs font-medium truncate"
                  >
                    {cat.name}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          )
        })}
      </nav>

      {/* Theme & Logout */}
      <div className="px-2 pb-4 space-y-2" style={{ borderTop: '1px solid rgba(0,229,255,0.08)', paddingTop: '12px' }}>
        {/* Theme picker */}
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <div className="text-xs font-semibold tracking-widest uppercase mb-2 px-1"
                style={{ color: 'rgba(255,255,255,0.2)' }}>
                Theme
              </div>
              <div className="grid grid-cols-4 gap-1">
                {Object.entries(themes).map(([key, t]) => (
                  <button
                    key={key}
                    onClick={() => setTheme(key)}
                    title={t.name}
                    className="h-6 rounded-lg transition-all"
                    style={{
                      background: `linear-gradient(135deg, ${t.accent}, ${t.accent2})`,
                      opacity: theme === key ? 1 : 0.4,
                      transform: theme === key ? 'scale(1.1)' : 'scale(1)',
                      boxShadow: theme === key ? `0 0 10px ${t.accent}66` : 'none',
                    }}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <button
          onClick={onLogout}
          className="sidebar-item w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all"
          style={{ color: 'rgba(255,100,100,0.6)' }}
          title={collapsed ? 'Logout' : undefined}
        >
          <LogOut size={18} className="flex-shrink-0" />
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-sm font-medium"
              >
                Logout
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
    </motion.aside>
  )
}
