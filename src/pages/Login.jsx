import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, EyeOff, Zap, Shield, Server, Sun, Moon } from 'lucide-react'
import { useTheme, THEMES } from '../context/ThemeContext'

const CORRECT_USER = '0000'
const CORRECT_PASS = '0000'

const Particle = ({ style }) => (
  <div
    className="particle"
    style={{
      width: `${style.size}px`,
      height: `${style.size}px`,
      background: style.color,
      left: `${style.x}%`,
      top: `${style.y}%`,
      '--duration': `${style.duration}s`,
      '--delay': `${style.delay}s`,
      opacity: 0.6,
      filter: `blur(${style.blur}px)`,
    }}
  />
)

const Stadium = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {/* Stadium light beams */}
    {[...Array(6)].map((_, i) => (
      <div
        key={i}
        className="absolute"
        style={{
          left: `${10 + i * 16}%`,
          top: 0,
          width: '3px',
          height: '100%',
          background: `linear-gradient(180deg, rgba(255,215,0,${0.08 + i * 0.01}) 0%, transparent 60%)`,
          transform: `rotate(${-15 + i * 6}deg)`,
          transformOrigin: 'top center',
          animation: `stadiumLight ${3 + i * 0.5}s ease-in-out ${i * 0.3}s infinite`,
        }}
      />
    ))}
    {/* Top light sources */}
    <div className="absolute top-0 left-0 right-0 flex justify-around">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="relative">
          <div
            style={{
              width: '8px', height: '8px',
              borderRadius: '50%',
              background: i % 2 === 0 ? '#00E5FF' : '#FFD700',
              boxShadow: `0 0 20px 8px ${i % 2 === 0 ? 'rgba(0,229,255,0.4)' : 'rgba(255,215,0,0.4)'}`,
              animation: `stadiumLight ${2 + i * 0.4}s ease-in-out ${i * 0.2}s infinite`,
            }}
          />
        </div>
      ))}
    </div>
  </div>
)

const Football = ({ phase }) => (
  <AnimatePresence>
    {phase >= 2 && (
      <motion.div
        className="absolute pointer-events-none z-10"
        initial={{ x: '-150px', y: '40vh', rotate: 0, opacity: 0 }}
        animate={{ x: '110vw', y: '25vh', rotate: 720, opacity: [0, 1, 1, 0] }}
        transition={{ duration: 2.5, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.2 }}
        style={{ top: 0 }}
      >
        <div style={{ position: 'relative' }}>
          {/* Trail */}
          <div style={{
            position: 'absolute',
            right: '100%', top: '50%',
            transform: 'translateY(-50%)',
            width: '120px', height: '4px',
            background: 'linear-gradient(90deg, transparent, rgba(0,229,255,0.6), rgba(255,215,0,0.8))',
            filter: 'blur(2px)',
            borderRadius: '2px',
          }} />
          {/* Ball */}
          <div style={{
            width: '48px', height: '48px',
            borderRadius: '50%',
            background: 'radial-gradient(circle at 35% 35%, #ffffff, #cccccc)',
            boxShadow: '0 0 20px rgba(255,215,0,0.8), 0 0 40px rgba(0,229,255,0.4)',
            border: '2px solid rgba(255,215,0,0.5)',
            position: 'relative',
            overflow: 'hidden',
          }}>
            <div style={{
              position: 'absolute',
              inset: 0,
              background: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpolygon points='50,20 62,38 80,38 67,50 72,68 50,58 28,68 33,50 20,38 38,38' fill='%23111' opacity='0.4'/%3E%3C/svg%3E") center/cover`,
            }} />
          </div>
        </div>
      </motion.div>
    )}
  </AnimatePresence>
)

// ─── Theme Toggle Button ────────────────────────────────────────────
function ThemeToggle({ theme, toggleTheme }) {
  return (
    <motion.button
      type="button"
      onClick={toggleTheme}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.3 }}
      whileTap={{ scale: 0.9 }}
      title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Night Mode'}
      style={{
        position: 'fixed', top: 20, right: 20, zIndex: 50,
        width: 44, height: 44, borderRadius: 14,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: theme === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)',
        border: `1px solid ${theme === 'dark' ? 'rgba(0,229,255,0.25)' : 'rgba(0,0,0,0.1)'}`,
        color: theme === 'dark' ? '#00E5FF' : '#7B61FF',
        cursor: 'pointer', backdropFilter: 'blur(10px)',
        boxShadow: theme === 'dark' ? '0 0 20px rgba(0,229,255,0.15)' : '0 4px 14px rgba(0,0,0,0.08)',
      }}
    >
      {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
    </motion.button>
  )
}

export default function Login({ onLogin }) {
  const { theme, toggleTheme } = useTheme()
  const t = THEMES[theme]

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [remember, setRemember] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [phase, setPhase] = useState(0)
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 })

  const particles = useRef(
    [...Array(30)].map((_, i) => ({
      size: Math.random() * 4 + 1,
      x: Math.random() * 100,
      y: Math.random() * 100,
      color: i % 3 === 0 ? 'rgba(0,229,255,0.8)' : i % 3 === 1 ? 'rgba(123,97,255,0.8)' : 'rgba(255,215,0,0.8)',
      duration: 6 + Math.random() * 8,
      delay: Math.random() * 4,
      blur: Math.random() * 2,
    }))
  ).current

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 300),
      setTimeout(() => setPhase(2), 800),
      setTimeout(() => setPhase(3), 1200),
      setTimeout(() => setPhase(4), 1800),
    ]
    return () => timers.forEach(clearTimeout)
  }, [])

  useEffect(() => {
    const stored = localStorage.getItem('msp_remember')
    if (stored) {
      try {
        const { u, p } = JSON.parse(stored)
        setUsername(u); setPassword(p); setRemember(true)
      } catch {}
    }
  }, [])

  const handleMouseMove = (e) => {
    setMousePos({ x: (e.clientX / window.innerWidth) * 100, y: (e.clientY / window.innerHeight) * 100 })
  }

  const handleGuestLogin = () => {
    localStorage.setItem('guestMode', 'true')
    onLogin('guest')
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    if (!username || !password) { setError('Enter credentials'); return }

    setLoading(true)
    await new Promise(r => setTimeout(r, 1200))

    if (username === CORRECT_USER && password === CORRECT_PASS) {
      if (remember) localStorage.setItem('msp_remember', JSON.stringify({ u: username, p: password }))
      else localStorage.removeItem('msp_remember')
      localStorage.setItem('guestMode', 'false')
      setSuccess(true)
      await new Promise(r => setTimeout(r, 1000))
      onLogin('admin')
    } else {
      setLoading(false)
      setError('Invalid credentials. Try again.')
    }
  }

  return (
    <div
      className="relative min-h-screen overflow-hidden animated-bg grid-pattern flex items-center justify-center"
      onMouseMove={handleMouseMove}
      style={{ background: theme === 'dark' ? undefined : t.bgPrimary }}
    >
      {/* Theme Toggle */}
      <ThemeToggle theme={theme} toggleTheme={toggleTheme} />

      {/* Mouse glow */}
      <div
        className="mouse-glow"
        style={{ left: `${mousePos.x}%`, top: `${mousePos.y}%` }}
      />

      {/* Particles */}
      {particles.map((p, i) => <Particle key={i} style={p} />)}

      {/* Stadium lights */}
      <Stadium />

      {/* Football */}
      <Football phase={phase} />

      {/* Aurora orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-10 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #00E5FF, transparent)', filter: 'blur(60px)', animation: 'aurora 6s ease-in-out infinite' }} />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full opacity-10 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #7B61FF, transparent)', filter: 'blur(60px)', animation: 'aurora 8s ease-in-out 2s infinite' }} />

      {/* Login Card */}
      <AnimatePresence>
        {phase >= 3 && (
          <motion.div
            initial={{ opacity: 0, y: 60, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="relative z-20 w-full max-w-md px-4"
          >
            <div
              className="glass-strong rounded-3xl p-8 shine"
              style={{
                border: `1px solid ${theme === 'dark' ? 'rgba(0,229,255,0.2)' : 'rgba(0,0,0,0.08)'}`,
                boxShadow: theme === 'dark'
                  ? '0 30px 80px rgba(0,0,0,0.5), 0 0 60px rgba(0,229,255,0.1), inset 0 1px 0 rgba(255,255,255,0.1)'
                  : '0 30px 80px rgba(0,0,0,0.08), 0 0 60px rgba(0,229,255,0.05), inset 0 1px 0 rgba(255,255,255,0.6)',
                background: theme === 'dark' ? undefined : t.glassBg,
              }}
            >
              {/* Header */}
              <div className="text-center mb-8">
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
                  className="w-20 h-20 mx-auto mb-4 rounded-2xl flex items-center justify-center relative"
                  style={{
                    background: 'linear-gradient(135deg, rgba(0,229,255,0.2), rgba(123,97,255,0.2))',
                    border: '1px solid rgba(0,229,255,0.3)',
                    boxShadow: '0 0 30px rgba(0,229,255,0.2)',
                  }}
                >
                  <Server size={36} color="#00E5FF" />
                  <div
                    className="absolute inset-0 rounded-2xl"
                    style={{
                      border: '1px solid rgba(0,229,255,0.4)',
                      animation: 'borderGlow 3s ease-in-out infinite',
                    }}
                  />
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-3xl font-black tracking-wider gradient-text mb-1"
                >
                  MY SERVER PAGE
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="text-sm tracking-widest uppercase"
                  style={{ color: t.textMuted }}
                >
                  Control Center Access
                </motion.p>
              </div>

              {/* Form */}
              <form onSubmit={handleLogin} className="space-y-5">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
                  <label className="block text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: t.textMuted }}>Username</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={username}
                      onChange={e => setUsername(e.target.value)}
                      placeholder="Enter username"
                      autoComplete="username"
                      className="w-full px-4 py-3 rounded-xl placeholder-gray-600 text-sm font-medium transition-all duration-200"
                      style={{
                        background: t.inputBg,
                        border: '1px solid rgba(0,229,255,0.15)',
                        outline: 'none',
                        color: t.textBright,
                      }}
                      onFocus={e => e.target.style.border = '1px solid rgba(0,229,255,0.5)'}
                      onBlur={e => e.target.style.border = '1px solid rgba(0,229,255,0.15)'}
                    />
                  </div>
                </motion.div>

                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }}>
                  <label className="block text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: t.textMuted }}>Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="Enter password"
                      autoComplete="current-password"
                      className="w-full px-4 py-3 pr-12 rounded-xl placeholder-gray-600 text-sm font-medium transition-all duration-200"
                      style={{
                        background: t.inputBg,
                        border: '1px solid rgba(0,229,255,0.15)',
                        outline: 'none',
                        color: t.textBright,
                      }}
                      onFocus={e => e.target.style.border = '1px solid rgba(0,229,255,0.5)'}
                      onBlur={e => e.target.style.border = '1px solid rgba(0,229,255,0.15)'}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                      style={{ color: t.textMuted }}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </motion.div>

                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.65 }}
                  className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setRemember(!remember)}
                    className="relative w-5 h-5 rounded flex items-center justify-center transition-all"
                    style={{
                      background: remember ? 'linear-gradient(135deg, #00E5FF, #7B61FF)' : t.inputBg,
                      border: `1px solid ${remember ? '#00E5FF' : t.border}`,
                    }}
                  >
                    {remember && <span className="text-white text-xs font-bold">✓</span>}
                  </button>
                  <span className="text-sm" style={{ color: t.textMuted }}>Remember me</span>
                </motion.div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm"
                    style={{ background: 'rgba(255,50,50,0.1)', border: '1px solid rgba(255,50,50,0.3)', color: '#ff6b6b' }}
                  >
                    <Shield size={16} />
                    {error}
                  </motion.div>
                )}

                <motion.button
                  type="submit"
                  disabled={loading || success}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-3.5 rounded-xl font-bold text-sm tracking-widest uppercase transition-all duration-300"
                  style={{
                    background: success
                      ? 'linear-gradient(135deg, #00ff88, #00cc66)'
                      : 'linear-gradient(135deg, #00E5FF, #7B61FF)',
                    boxShadow: success
                      ? '0 0 30px rgba(0,255,136,0.4)'
                      : '0 0 30px rgba(0,229,255,0.3)',
                    color: 'white',
                    cursor: loading ? 'not-allowed' : 'pointer',
                  }}
                >
                  {loading && !success ? (
                    <span className="flex items-center justify-center gap-2">
                      <div style={{ width: 18, height: 18, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
                      Authenticating...
                    </span>
                  ) : success ? (
                    <span className="flex items-center justify-center gap-2">
                      <Zap size={18} />
                      Access Granted
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <Zap size={18} />
                      Enter Portal
                    </span>
                  )}
                </motion.button>

                <motion.button
                  type="button"
                  onClick={handleGuestLogin}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-3.5 rounded-xl font-bold text-sm tracking-widest uppercase transition-all duration-300 mt-3"
                  style={{
                    background: theme === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)',
                    border: `1px solid ${t.border}`,
                    color: t.textBright,
                  }}
                >
                  Login As Guest
                </motion.button>
              </form>

              {/* Footer */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="mt-6 text-center text-xs"
                style={{ color: t.textFaint }}
              >
                Secured Access Portal · Created by Hasan
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Phase 1-2: pre-login animation text */}
      <AnimatePresence>
        {phase < 3 && (
          <motion.div
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 flex flex-col items-center justify-center z-30"
            style={{ background: t.initBg }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: phase >= 1 ? 1 : 0, scale: phase >= 1 ? 1 : 0.8 }}
              className="text-center"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, ease: 'linear', repeat: Infinity }}
                className="w-16 h-16 mx-auto mb-6"
                style={{
                  border: '2px solid transparent',
                  borderTopColor: '#00E5FF',
                  borderRightColor: '#7B61FF',
                  borderRadius: '50%',
                }}
              />
              <h2 className="text-2xl font-black tracking-widest gradient-text">INITIALIZING</h2>
              <p className="text-sm mt-2 tracking-widest" style={{ color: t.textMuted }}>MY SERVER PAGE</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}