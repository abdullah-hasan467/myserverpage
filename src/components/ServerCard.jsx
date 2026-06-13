import { useState } from 'react'
import { motion } from 'framer-motion'
import { ExternalLink, Star, Copy, Info } from 'lucide-react'
import { useApp } from '../context/AppContext'

export default function ServerCard({ server, index = 0 }) {
  const { openServer, toggleFavorite, isFavorite, copyLink } = useApp()
  const [hovered, setHovered] = useState(false)
  const fav = isFavorite(server.id)

  const tagColors = {
    FTP: '#00E5FF', Streaming: '#7B61FF', 'Live TV': '#FFD700', Movies: '#FF6B6B',
    Sports: '#00FF88', 'K-Drama': '#FF69B4', CDN: '#FFA500', Anime: '#FF6B35',
    Archive: '#9B7FFF', Portal: '#00E5FF', Local: '#64748B', IPTV: '#FFD700',
    Entertainment: '#FF69B4', Media: '#7B61FF', Cricket: '#00FF88', 'BD TV': '#00E5FF',
    'Live': '#00FF88', Regional: '#64748B', default: '#7B61FF',
  }
  const tagColor = tagColors[server.tag] || tagColors.default

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.04, ease: [0.4, 0, 0.2, 1] }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className="server-card glass shine rounded-2xl p-5 flex flex-col gap-4 cursor-default"
      style={{
        border: hovered ? '1px solid rgba(0,229,255,0.25)' : '1px solid rgba(255,255,255,0.06)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Top glow when hovered */}
      {hovered && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(circle at 50% 0%, rgba(0,229,255,0.05) 0%, transparent 70%)',
          }}
        />
      )}

      {/* Header row */}
      <div className="flex items-start gap-3">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
          style={{
            background: `linear-gradient(135deg, ${tagColor}22, ${tagColor}11)`,
            border: `1px solid ${tagColor}33`,
            boxShadow: hovered ? `0 0 20px ${tagColor}33` : 'none',
            transition: 'all 0.3s ease',
          }}
        >
          {server.icon}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <h3 className="text-sm font-bold text-white truncate">{server.name}</h3>
          </div>
          <span
            className="inline-block text-xs px-2 py-0.5 rounded-full font-semibold"
            style={{ background: `${tagColor}22`, color: tagColor, border: `1px solid ${tagColor}33` }}
          >
            {server.tag}
          </span>
        </div>

        <button
          onClick={() => toggleFavorite(server)}
          className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200"
          style={{
            background: fav ? 'rgba(255,215,0,0.15)' : 'rgba(255,255,255,0.05)',
            border: `1px solid ${fav ? 'rgba(255,215,0,0.4)' : 'rgba(255,255,255,0.1)'}`,
          }}
          title="Toggle favorite"
        >
          <Star size={14} fill={fav ? '#FFD700' : 'none'} color={fav ? '#FFD700' : '#666'} />
        </button>
      </div>

      {/* Description */}
      <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 flex-1">
        {server.description}
      </p>

      {/* URL preview */}
      <div
        className="px-3 py-2 rounded-lg text-xs truncate"
        style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.06)',
          color: 'rgba(0,229,255,0.5)',
          fontFamily: 'monospace',
        }}
      >
        {server.url}
      </div>

      {/* Action buttons */}
      <div className="flex gap-2">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => openServer(server)}
          className="btn-primary flex-1 py-2 rounded-xl text-xs font-bold tracking-wider flex items-center justify-center gap-1.5"
        >
          <ExternalLink size={13} />
          Launch
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => copyLink(server.url)}
          className="w-9 h-9 rounded-xl flex items-center justify-center transition-all"
          style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            color: '#666',
          }}
          title="Copy link"
          onMouseEnter={e => { e.currentTarget.style.color = '#00E5FF'; e.currentTarget.style.borderColor = 'rgba(0,229,255,0.3)' }}
          onMouseLeave={e => { e.currentTarget.style.color = '#666'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)' }}
        >
          <Copy size={13} />
        </motion.button>
      </div>
    </motion.div>
  )
}
