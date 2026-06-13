import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Server, Star, Clock, LayoutGrid } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { getAllServers } from '../data/servers'

function AnimatedCounter({ target, duration = 1.5 }) {
  const [count, setCount] = useState(0)
  const started = useRef(false)
  const ref = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true
        const start = Date.now()
        const tick = () => {
          const elapsed = (Date.now() - start) / (duration * 1000)
          if (elapsed < 1) {
            setCount(Math.round(target * elapsed * elapsed * (3 - 2 * elapsed)))
            requestAnimationFrame(tick)
          } else {
            setCount(target)
          }
        }
        requestAnimationFrame(tick)
      }
    }, { threshold: 0.5 })
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [target, duration])

  return <span ref={ref}>{count}</span>
}

export default function StatsBar() {
  const { favorites, recentlyOpened } = useApp()
  const totalServers = getAllServers().length

  const stats = [
    { icon: Server, label: 'Total Servers', value: totalServers, color: '#00E5FF', bg: 'rgba(0,229,255,0.1)' },
    { icon: LayoutGrid, label: 'Categories', value: 5, color: '#7B61FF', bg: 'rgba(123,97,255,0.1)' },
    { icon: Star, label: 'Favorites', value: favorites.length, color: '#FFD700', bg: 'rgba(255,215,0,0.1)' },
    { icon: Clock, label: 'Recently Opened', value: recentlyOpened.length, color: '#00FF88', bg: 'rgba(0,255,136,0.1)' },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 px-6 py-4">
      {stats.map((stat, i) => {
        const Icon = stat.icon
        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="glass rounded-2xl p-4 flex items-center gap-4 shine"
            style={{
              border: `1px solid ${stat.color}22`,
              boxShadow: `0 4px 20px rgba(0,0,0,0.2)`,
            }}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: stat.bg, border: `1px solid ${stat.color}33` }}
            >
              <Icon size={18} color={stat.color} />
            </div>
            <div>
              <div
                className="text-2xl font-black"
                style={{ color: stat.color, textShadow: `0 0 15px ${stat.color}55` }}
              >
                <AnimatedCounter target={stat.value} />
              </div>
              <div className="text-xs text-gray-500 font-medium">{stat.label}</div>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}
