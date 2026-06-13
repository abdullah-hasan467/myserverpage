import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Star, Clock, X, ExternalLink } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { categories, getAllServers, searchServers } from '../data/servers'
import Sidebar from '../components/Sidebar'
import ServerCard from '../components/ServerCard'
import HeroSection from '../components/HeroSection'
import StatsBar from '../components/StatsBar'
import Toast from '../components/Toast'
import CommandPalette from '../components/CommandPalette'

function QuickCard({ server }) {
  const { openServer, copyLink } = useApp()
  return (
    <div
      className="flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all group"
      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
      onClick={() => openServer(server)}
      onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(0,229,255,0.2)'}
      onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'}
    >
      <span className="text-xl">{server.icon}</span>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-semibold text-white truncate">{server.name}</div>
        <div className="text-xs text-gray-600 truncate">{server.url}</div>
      </div>
      <ExternalLink size={14} color="#666" className="group-hover:text-cyan-400 transition-colors flex-shrink-0" />
    </div>
  )
}

function CategorySection({ category }) {
  return (
    <section className="mb-10">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center gap-3 mb-5 px-6"
      >
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{
            background: `${category.color}22`,
            border: `1px solid ${category.color}44`,
            boxShadow: `0 0 15px ${category.color}22`,
          }}
        >
          <span className="text-sm">{category.icon}</span>
        </div>
        <div>
          <h2 className="text-base font-bold text-white">{category.name}</h2>
          <p className="text-xs text-gray-600">{category.description}</p>
        </div>
        <div
          className="ml-auto text-xs px-3 py-1 rounded-full font-semibold"
          style={{ background: `${category.color}15`, color: category.color }}
        >
          {category.servers.length} servers
        </div>
      </motion.div>

      <div className="px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {category.servers.map((server, i) => (
          <ServerCard
            key={server.id}
            server={{ ...server, category: category.name, categoryId: category.id }}
            index={i}
          />
        ))}
      </div>
    </section>
  )
}

function SearchView({ query, onBack }) {
  const results = searchServers(query)
  return (
    <div className="px-6 py-6">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={onBack}
          className="p-2 rounded-xl transition-all hover:bg-white/10"
          style={{ border: '1px solid rgba(255,255,255,0.1)' }}>
          <X size={16} />
        </button>
        <div>
          <h2 className="text-lg font-bold text-white">
            Search: "<span style={{ color: '#00E5FF' }}>{query}</span>"
          </h2>
          <p className="text-xs text-gray-500">{results.length} result{results.length !== 1 ? 's' : ''} found</p>
        </div>
      </div>
      {results.length === 0 ? (
        <div className="text-center py-20 text-gray-600">
          <Search size={40} className="mx-auto mb-4 opacity-30" />
          <p>No results for "{query}"</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {results.map((server, i) => <ServerCard key={server.id} server={server} index={i} />)}
        </div>
      )}
    </div>
  )
}

function FavoritesView() {
  const { favorites } = useApp()
  if (favorites.length === 0) {
    return (
      <div className="text-center py-24 text-gray-600 px-6">
        <Star size={48} className="mx-auto mb-4 opacity-20" />
        <h3 className="text-lg font-semibold mb-2">No Favorites Yet</h3>
        <p className="text-sm">Click the ⭐ on any server card to save it here</p>
      </div>
    )
  }
  return (
    <div className="px-6 py-6">
      <div className="flex items-center gap-3 mb-6">
        <Star size={20} color="#FFD700" fill="#FFD700" />
        <h2 className="text-lg font-bold text-white">Favorites</h2>
        <span className="text-sm text-gray-500">({favorites.length})</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {favorites.map((server, i) => <ServerCard key={server.id} server={server} index={i} />)}
      </div>
    </div>
  )
}

function RecentView() {
  const { recentlyOpened } = useApp()
  if (recentlyOpened.length === 0) {
    return (
      <div className="text-center py-24 text-gray-600 px-6">
        <Clock size={48} className="mx-auto mb-4 opacity-20" />
        <h3 className="text-lg font-semibold mb-2">No Recent Activity</h3>
        <p className="text-sm">Servers you open will appear here</p>
      </div>
    )
  }
  return (
    <div className="px-6 py-6">
      <div className="flex items-center gap-3 mb-6">
        <Clock size={20} color="#00E5FF" />
        <h2 className="text-lg font-bold text-white">Recently Opened</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {recentlyOpened.map((server, i) => <ServerCard key={server.id} server={server} index={i} />)}
      </div>
    </div>
  )
}

function DashboardHome({ onSearch }) {
  const { favorites, recentlyOpened } = useApp()

  return (
    <div>
      <HeroSection onSearch={onSearch} />
      <StatsBar />

      {/* Quick Access */}
      {(favorites.length > 0 || recentlyOpened.length > 0) && (
        <div className="px-6 py-4 grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {favorites.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass rounded-2xl p-5"
              style={{ border: '1px solid rgba(255,215,0,0.1)' }}
            >
              <div className="flex items-center gap-2 mb-4">
                <Star size={16} color="#FFD700" fill="#FFD700" />
                <h3 className="text-sm font-bold text-white">Pinned Favorites</h3>
              </div>
              <div className="space-y-2">
                {favorites.slice(0, 4).map(s => <QuickCard key={s.id} server={s} />)}
              </div>
            </motion.div>
          )}
          {recentlyOpened.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="glass rounded-2xl p-5"
              style={{ border: '1px solid rgba(0,229,255,0.1)' }}
            >
              <div className="flex items-center gap-2 mb-4">
                <Clock size={16} color="#00E5FF" />
                <h3 className="text-sm font-bold text-white">Recent Activity</h3>
              </div>
              <div className="space-y-2">
                {recentlyOpened.slice(0, 4).map(s => <QuickCard key={s.id} server={s} />)}
              </div>
            </motion.div>
          )}
        </div>
      )}

      {/* All categories */}
      <div className="pb-8">
        {categories.map(cat => <CategorySection key={cat.id} category={cat} />)}
      </div>
    </div>
  )
}

export default function Dashboard({ onLogout }) {
  const [activeView, setActiveView] = useState('dashboard')
  const [searchQuery, setSearchQuery] = useState('')
  const [mousePos, setMousePos] = useState({ x: -999, y: -999 })
  const contentRef = useRef(null)
  const { setCommandPaletteOpen } = useApp()

  const handleSearch = (q) => {
    setSearchQuery(q)
    setActiveView('search')
  }

  const handleMouseMove = (e) => {
    setMousePos({ x: e.clientX, y: e.clientY })
  }

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'd') { e.preventDefault(); setActiveView('dashboard') }
      if ((e.ctrlKey || e.metaKey) && e.key === 'f') { e.preventDefault(); setActiveView('favorites') }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  const renderContent = () => {
    if (activeView === 'search' && searchQuery) return <SearchView query={searchQuery} onBack={() => setActiveView('dashboard')} />
    if (activeView === 'favorites') return <FavoritesView />
    if (activeView === 'recent') return <RecentView />
    if (activeView.startsWith('cat_')) {
      const catId = activeView.replace('cat_', '')
      const cat = categories.find(c => c.id === catId)
      if (cat) return (
        <div className="py-6">
          <CategorySection category={cat} />
        </div>
      )
    }
    return <DashboardHome onSearch={handleSearch} />
  }

  return (
    <div className="flex h-screen overflow-hidden animated-bg" onMouseMove={handleMouseMove}>
      {/* Mouse glow */}
      <div
        className="mouse-glow"
        style={{ left: mousePos.x, top: mousePos.y }}
      />

      {/* Sidebar */}
      <Sidebar
        activeView={activeView}
        setActiveView={setActiveView}
        onLogout={onLogout}
        categories={categories}
      />

      {/* Main content */}
      <main
        ref={contentRef}
        className="flex-1 overflow-y-auto relative"
        style={{ background: 'transparent' }}
      >
        {/* Top bar */}
        <div
          className="sticky top-0 z-40 flex items-center justify-between px-6 py-3"
          style={{
            background: 'rgba(8,17,32,0.8)',
            backdropFilter: 'blur(20px)',
            borderBottom: '1px solid rgba(0,229,255,0.06)',
          }}
        >
          <div className="flex items-center gap-3">
            <nav className="flex items-center gap-1 text-xs text-gray-600">
              <span>Portal</span>
              <span>/</span>
              <span style={{ color: '#00E5FF' }} className="capitalize">
                {activeView === 'dashboard' ? 'Home' :
                  activeView === 'search' ? `Search: ${searchQuery}` :
                  activeView.startsWith('cat_') ? categories.find(c => c.id === activeView.replace('cat_', ''))?.name :
                  activeView.charAt(0).toUpperCase() + activeView.slice(1)}
              </span>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setCommandPaletteOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs text-gray-500 transition-all hover:text-white"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              <span>⌘K</span>
              <span>Search</span>
            </button>
          </div>
        </div>

        {/* Page content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeView}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>

        {/* Footer */}
        <footer
          className="px-6 py-8 text-center"
          style={{ borderTop: '1px solid rgba(0,229,255,0.06)' }}
        >
          <div className="gradient-text font-bold text-sm mb-1">MY SERVER PAGE</div>
          <div className="text-xs text-gray-600 mb-3">Created by <span style={{ color: '#00E5FF' }}>Hasan</span></div>
          <div className="flex items-center justify-center gap-4 text-xs text-gray-700">
            <span>v1.0.0</span>
            <span>·</span>
            <span>© 2026 Hasan. All rights reserved.</span>
            <span>·</span>
            <span>FIFA 2026 Inspired</span>
          </div>
        </footer>
      </main>

      {/* Global overlays */}
      <CommandPalette />
      <Toast />
    </div>
  )
}
