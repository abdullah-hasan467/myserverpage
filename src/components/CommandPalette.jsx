import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, ExternalLink, X, Command } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { searchServers } from '../data/servers'

export default function CommandPalette() {
  const { commandPaletteOpen, setCommandPaletteOpen, openServer } = useApp()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [selected, setSelected] = useState(0)
  const inputRef = useRef(null)

  useEffect(() => {
    if (commandPaletteOpen) {
      setQuery('')
      setResults([])
      setSelected(0)
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [commandPaletteOpen])

  useEffect(() => {
    setResults(searchServers(query))
    setSelected(0)
  }, [query])

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setSelected(s => Math.min(s + 1, results.length - 1)) }
    if (e.key === 'ArrowUp') { e.preventDefault(); setSelected(s => Math.max(s - 1, 0)) }
    if (e.key === 'Enter' && results[selected]) {
      openServer(results[selected])
      setCommandPaletteOpen(false)
    }
    if (e.key === 'Escape') setCommandPaletteOpen(false)
  }

  return (
    <AnimatePresence>
      {commandPaletteOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] modal-overlay"
            style={{ background: 'rgba(8,17,32,0.8)' }}
            onClick={() => setCommandPaletteOpen(false)}
          />

          {/* Palette */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: -20 }}
            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
            className="fixed top-1/4 left-1/2 -translate-x-1/2 z-[201] w-full max-w-xl px-4"
          >
            <div
              className="glass-strong rounded-2xl overflow-hidden"
              style={{
                border: '1px solid rgba(0,229,255,0.2)',
                boxShadow: '0 30px 80px rgba(0,0,0,0.6), 0 0 40px rgba(0,229,255,0.1)',
              }}
            >
              {/* Search input */}
              <div className="flex items-center gap-3 px-4 py-4" style={{ borderBottom: '1px solid rgba(0,229,255,0.1)' }}>
                <Search size={18} color="#00E5FF" className="flex-shrink-0" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Search servers, categories, URLs..."
                  className="flex-1 bg-transparent text-white placeholder-gray-600 text-sm outline-none"
                />
                <div className="flex items-center gap-1 text-xs text-gray-600">
                  <kbd className="px-1.5 py-0.5 rounded text-xs" style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)' }}>ESC</kbd>
                </div>
              </div>

              {/* Results */}
              <div className="max-h-80 overflow-y-auto">
                {query && results.length === 0 && (
                  <div className="py-8 text-center text-gray-600 text-sm">No results found</div>
                )}
                {!query && (
                  <div className="py-6 text-center text-gray-600 text-sm">
                    <Command size={24} className="mx-auto mb-2 opacity-30" />
                    Type to search all {' '}
                    <span style={{ color: '#00E5FF' }}>servers & resources</span>
                  </div>
                )}
                {results.map((server, i) => (
                  <motion.button
                    key={server.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.03 }}
                    onClick={() => { openServer(server); setCommandPaletteOpen(false) }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-left transition-all"
                    style={{
                      background: i === selected ? 'rgba(0,229,255,0.08)' : 'transparent',
                      borderLeft: i === selected ? '2px solid #00E5FF' : '2px solid transparent',
                    }}
                    onMouseEnter={() => setSelected(i)}
                  >
                    <span className="text-xl flex-shrink-0">{server.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-white">{server.name}</div>
                      <div className="text-xs text-gray-500 truncate">{server.url}</div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-xs px-2 py-0.5 rounded-full"
                        style={{ background: 'rgba(0,229,255,0.1)', color: '#00E5FF' }}>
                        {server.category}
                      </span>
                      <ExternalLink size={12} color="#666" />
                    </div>
                  </motion.button>
                ))}
              </div>

              {/* Footer hints */}
              <div className="flex items-center gap-4 px-4 py-3 text-xs text-gray-600"
                style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                <span><kbd className="px-1 rounded" style={{ background: 'rgba(255,255,255,0.08)' }}>↑↓</kbd> navigate</span>
                <span><kbd className="px-1 rounded" style={{ background: 'rgba(255,255,255,0.08)' }}>↵</kbd> open</span>
                <span><kbd className="px-1 rounded" style={{ background: 'rgba(255,255,255,0.08)' }}>ESC</kbd> close</span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
