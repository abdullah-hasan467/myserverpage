import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Command, Zap } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { getAllServers } from '../data/servers'

const FloatingParticle = ({ x, y, size, color, duration, delay }) => (
  <div
    className="particle"
    style={{
      left: `${x}%`, top: `${y}%`,
      width: `${size}px`, height: `${size}px`,
      background: color,
      '--duration': `${duration}s`,
      '--delay': `${delay}s`,
      filter: 'blur(1px)',
    }}
  />
)

const Football = () => {
  const [active, setActive] = useState(true)
  useEffect(() => {
    const interval = setInterval(() => {
      setActive(false)
      setTimeout(() => setActive(true), 200)
    }, 6000)
    return () => clearInterval(interval)
  }, [])

  if (!active) return null

  return (
    <motion.div
      className="absolute pointer-events-none z-10"
      style={{ top: '35%' }}
      initial={{ x: '-150px', y: 0, rotate: 0, opacity: 0 }}
      animate={{ x: '110vw', y: '-80px', rotate: 720, opacity: [0, 1, 1, 0] }}
      transition={{ duration: 4, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <div style={{ position: 'relative' }}>
        <div style={{
          position: 'absolute', right: '100%', top: '50%',
          transform: 'translateY(-50%)',
          width: '140px', height: '5px',
          background: 'linear-gradient(90deg, transparent, rgba(0,229,255,0.4), rgba(255,215,0,0.7))',
          filter: 'blur(3px)', borderRadius: '3px',
        }} />
        <div style={{
          width: '52px', height: '52px',
          borderRadius: '50%',
          background: 'radial-gradient(circle at 35% 30%, #ffffff, #dddddd 50%, #aaaaaa)',
          boxShadow: '0 0 25px rgba(255,215,0,0.9), 0 0 50px rgba(0,229,255,0.5), inset 0 0 15px rgba(0,0,0,0.3)',
          border: '2px solid rgba(255,215,0,0.6)',
          overflow: 'hidden',
          position: 'relative',
        }}>
          {/* Pentagon pattern */}
          <svg viewBox="0 0 52 52" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.4 }}>
            <polygon points="26,5 38,18 34,32 18,32 14,18" fill="#111" />
            <polygon points="5,20 14,18 18,32 8,40 0,32" fill="#111" />
            <polygon points="47,20 38,18 34,32 44,40 52,32" fill="#111" />
          </svg>
        </div>
      </div>
    </motion.div>
  )
}

export default function HeroSection({ onSearch }) {
  const { setCommandPaletteOpen } = useApp()
  const [searchVal, setSearchVal] = useState('')
  const totalServers = getAllServers().length
  const inputRef = useRef(null)

  const particles = useRef(
    [...Array(20)].map((_, i) => ({
      x: Math.random() * 100, y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      color: i % 3 === 0 ? 'rgba(0,229,255,0.7)' : i % 3 === 1 ? 'rgba(123,97,255,0.7)' : 'rgba(255,215,0,0.5)',
      duration: 6 + Math.random() * 6,
      delay: Math.random() * 4,
    }))
  ).current

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchVal.trim()) onSearch(searchVal)
  }

  return (
    <div
      className="relative overflow-hidden"
      style={{
        minHeight: '420px',
        background: 'linear-gradient(180deg, rgba(0,229,255,0.04) 0%, transparent 100%)',
      }}
    >
      {/* Particles */}
      {particles.map((p, i) => <FloatingParticle key={i} {...p} />)}

      {/* Football */}
      <Football />

      {/* Stadium light beams */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(4)].map((_, i) => (
          <div key={i} style={{
            position: 'absolute',
            left: `${15 + i * 22}%`, top: 0,
            width: '2px', height: '100%',
            background: `linear-gradient(180deg, rgba(255,215,0,0.08), transparent 70%)`,
            transform: `rotate(${-10 + i * 7}deg)`,
            transformOrigin: 'top center',
            animation: `stadiumLight ${3 + i * 0.7}s ease-in-out ${i * 0.4}s infinite`,
          }} />
        ))}
      </div>

      {/* Grid overlay */}
      <div className="absolute inset-0 grid-pattern opacity-50 pointer-events-none" />

      {/* Aurora orbs */}
      <div className="absolute pointer-events-none" style={{
        top: '-100px', left: '-100px',
        width: '500px', height: '500px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(0,229,255,0.06) 0%, transparent 70%)',
        filter: 'blur(40px)',
        animation: 'aurora 8s ease-in-out infinite',
      }} />
      <div className="absolute pointer-events-none" style={{
        bottom: '-80px', right: '-80px',
        width: '400px', height: '400px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(123,97,255,0.06) 0%, transparent 70%)',
        filter: 'blur(40px)',
        animation: 'aurora 10s ease-in-out 3s infinite',
      }} />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center px-6 py-16 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex items-center gap-2 px-4 py-1.5 rounded-full mb-6"
          style={{
            background: 'rgba(0,229,255,0.08)',
            border: '1px solid rgba(0,229,255,0.2)',
          }}
        >
          <Zap size={12} color="#00E5FF" />
          <span className="text-xs font-semibold tracking-widest uppercase" style={{ color: '#00E5FF' }}>
            FIFA 2026 Inspired · Premium Portal
          </span>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tight mb-4"
          style={{ lineHeight: 1.05 }}
        >
          <span className="gradient-text text-glow-cyan">MY SERVER</span>
          <br />
          <span className="text-white">PAGE</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-gray-400 text-lg max-w-2xl mb-10 leading-relaxed"
        >
          Your Ultimate Gateway To{' '}
          <span style={{ color: '#00E5FF' }}>Streaming</span>,{' '}
          <span style={{ color: '#7B61FF' }}>FTP</span>,{' '}
          <span style={{ color: '#FFD700' }}>Media</span>{' '}
          & Digital Resources
        </motion.p>

        {/* Search */}
        <motion.form
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          onSubmit={handleSearch}
          className="w-full max-w-xl relative"
        >
          <div
            className="flex items-center gap-3 px-5 py-4 rounded-2xl"
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(0,229,255,0.2)',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 0 40px rgba(0,229,255,0.08)',
            }}
          >
            <Search size={18} color="#00E5FF" />
            <input
              ref={inputRef}
              type="text"
              value={searchVal}
              onChange={e => setSearchVal(e.target.value)}
              placeholder="Search servers, categories, URLs..."
              className="flex-1 bg-transparent text-white placeholder-gray-600 text-sm outline-none"
            />
            <button
              type="button"
              onClick={() => setCommandPaletteOpen(true)}
              className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs text-gray-500 transition-colors hover:text-gray-300"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              <Command size={10} />
              <span>K</span>
            </button>
          </div>
        </motion.form>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex items-center gap-8 mt-8 text-center"
        >
          {[
            { label: 'Total Servers', value: totalServers, color: '#00E5FF' },
            { label: 'Categories', value: 5, color: '#7B61FF' },
            { label: 'Live TV Channels', value: 5, color: '#FFD700' },
          ].map((stat, i) => (
            <div key={i}>
              <div className="text-2xl font-black" style={{ color: stat.color, textShadow: `0 0 20px ${stat.color}66` }}>
                {stat.value}+
              </div>
              <div className="text-xs text-gray-500 tracking-wider">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}
