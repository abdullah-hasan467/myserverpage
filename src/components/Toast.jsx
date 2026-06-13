import { AnimatePresence, motion } from 'framer-motion'
import { Star, Copy, X } from 'lucide-react'
import { useApp } from '../context/AppContext'

const icons = {
  add: { icon: <Star size={14} fill="#FFD700" color="#FFD700" />, color: '#FFD700' },
  remove: { icon: <X size={14} color="#ff6b6b" />, color: '#ff6b6b' },
  copy: { icon: <Copy size={14} color="#00E5FF" />, color: '#00E5FF' },
  info: { icon: null, color: '#7B61FF' },
}

export default function Toast() {
  const { toasts } = useApp()

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2 pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => {
          const style = icons[toast.type] || icons.info
          return (
            <motion.div
              key={toast.id}
              initial={{ x: 80, opacity: 0, scale: 0.9 }}
              animate={{ x: 0, opacity: 1, scale: 1 }}
              exit={{ x: 80, opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
              className="flex items-center gap-3 px-4 py-3 rounded-xl"
              style={{
                background: 'rgba(8,17,32,0.95)',
                border: `1px solid ${style.color}44`,
                backdropFilter: 'blur(20px)',
                boxShadow: `0 8px 30px rgba(0,0,0,0.4), 0 0 15px ${style.color}22`,
                minWidth: '200px',
              }}
            >
              {style.icon}
              <span className="text-sm font-medium text-white">{toast.message}</span>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}
