import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sun, Moon, Lock as LockIcon } from 'lucide-react'
import { useTheme, THEMES } from '../context/ThemeContext'
import { useServerData } from '../hooks/useServerData'

// ─── react-icons imports ─────────────────────────────────────────────
import { FaHome, FaServer, FaFilm, FaTv, FaCity, FaGlobe, FaFolderOpen,
         FaDownload, FaStar, FaClock, FaSearch, FaTimes, FaExternalLinkAlt,
         FaUser, FaGhost, FaShieldAlt, FaPlus, FaEdit, FaTrash, FaCopy,
         FaCheck, FaBars, FaChevronRight, FaSignOutAlt, FaMagnet,
         FaNetworkWired, FaDatabase, FaPlay, FaSatelliteDish, FaArchive,
         FaBroadcastTower, FaEye, FaLock, FaUnlock, FaTag, FaLink,
         FaWifi, FaHdd, FaDesktop, FaSync, FaBookmark, FaFilter } from 'react-icons/fa'
import { MdLiveTv, MdSportsBaseball, MdSportsCricket, MdLocalMovies,
         MdVideoLibrary, MdCloud, MdStorage, MdCast } from 'react-icons/md'
import { SiNetflix, SiBittorrent } from 'react-icons/si'
import { HiOutlineStatusOnline } from 'react-icons/hi'
import { BiNetworkChart } from 'react-icons/bi'

// ─── Icon Map ─────────────────────────────────────────────────────────
const ICON_MAP = {
  FaHome, FaServer, FaFilm, FaTv, FaCity, FaGlobe, FaFolderOpen,
  FaDownload, FaStar, FaClock, FaSearch, FaTimes, FaExternalLinkAlt,
  FaUser, FaGhost, FaShieldAlt, FaPlus, FaEdit, FaTrash, FaCopy,
  FaCheck, FaBars, FaChevronRight, FaSignOutAlt, FaMagnet,
  FaNetworkWired, FaDatabase, FaPlay, FaSatelliteDish, FaArchive,
  FaBroadcastTower, FaEye, FaLock, FaUnlock, FaTag, FaLink,
  FaWifi, FaHdd, FaDesktop, FaSync, FaBookmark, FaFilter,
  MdLiveTv, MdSportsBaseball, MdSportsCricket, MdLocalMovies,
  MdVideoLibrary, MdCloud, MdStorage, MdCast,
  SiNetflix, SiBittorrent, HiOutlineStatusOnline, BiNetworkChart,
}

const Icon = ({ name, size = 16, color, className = '' }) => {
  const Comp = ICON_MAP[name] || FaServer
  return <Comp size={size} color={color} className={className} />
}

// ─── Available icons for picker ───────────────────────────────────────
const ICON_OPTIONS = [
  'FaGlobe','FaServer','FaFilm','FaTv','FaCity','FaHome','FaFolderOpen',
  'FaDownload','FaMagnet','FaNetworkWired','FaDatabase','FaPlay','FaSatelliteDish',
  'FaArchive','FaBroadcastTower','FaWifi','FaHdd','FaDesktop','FaSync',
  'MdLiveTv','MdLocalMovies','MdVideoLibrary','MdCloud','MdStorage','MdCast',
  'MdSportsCricket','SiNetflix','SiBittorrent','FaSearch','FaEye',
]

const CAT_COLORS = ['#00E5FF','#FF4C4C','#7B61FF','#FFD700','#00FF88','#FF6B35','#FF69B4','#00CED1']

// ─── Unique ID ────────────────────────────────────────────────────────
const uid = () => Math.random().toString(36).slice(2, 9)

// ─── Favorites localStorage helpers ──────────────────────────────────
const LS_FAV = 'msp_favorites_v2'
const loadFavorites = () => { try { const d = localStorage.getItem(LS_FAV); return d ? JSON.parse(d) : [] } catch { return [] } }
const saveFavorites = (favs) => localStorage.setItem(LS_FAV, JSON.stringify(favs))

// ─── Toast ────────────────────────────────────────────────────────────
function useToast() {
  const [toast, setToast] = useState(null)
  const show = (msg, type = 'success') => {
    setToast({ msg, type, id: uid() })
    setTimeout(() => setToast(null), 2800)
  }
  return { toast, show }
}

function Toast({ toast }) {
  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          key={toast.id}
          initial={{ opacity: 0, y: 50, scale: 0.85, x: 20 }}
          animate={{ opacity: 1, y: 0, scale: 1, x: 0 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          style={{
            position: 'fixed', bottom: 28, right: 28, zIndex: 9999,
            background: toast.type === 'error'
              ? 'linear-gradient(135deg,rgba(255,50,50,0.18),rgba(180,0,0,0.10))'
              : 'linear-gradient(135deg,rgba(0,229,255,0.16),rgba(123,97,255,0.10))',
            border: `1px solid ${toast.type === 'error' ? 'rgba(255,80,80,0.45)' : 'rgba(0,229,255,0.40)'}`,
            borderRadius: 16, padding: '12px 20px',
            color: toast.type === 'error' ? '#ff7070' : '#00E5FF',
            fontSize: 13, fontWeight: 700, backdropFilter: 'blur(20px)',
            boxShadow: toast.type === 'error'
              ? '0 8px 32px rgba(255,0,0,0.18)'
              : '0 8px 32px rgba(0,229,255,0.15)',
            display: 'flex', alignItems: 'center', gap: 10,
            minWidth: 220,
          }}
        >
          <span style={{
            width: 26, height: 26, borderRadius: 8, flexShrink: 0,
            background: toast.type === 'error' ? 'rgba(255,80,80,0.2)' : 'rgba(0,229,255,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Icon name={toast.type === 'error' ? 'FaShieldAlt' : 'FaCheck'} size={13} />
          </span>
          {toast.msg}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// ─── Save Status Indicator ────────────────────────────────────────────
function SaveStatus({ saving, apiAvailable }) {
  const dot = (color) => (
    <span style={{
      width: 7, height: 7, borderRadius: '50%', background: color,
      display: 'inline-block', marginRight: 5,
      boxShadow: `0 0 6px ${color}`,
      animation: saving ? 'pulse 1s infinite' : 'none',
    }}/>
  )

  if (!apiAvailable) return (
    <span style={{
      fontSize: 10, fontWeight: 700, letterSpacing: '0.08em',
      color: '#FF8C00', background: 'rgba(255,140,0,0.1)',
      border: '1px solid rgba(255,140,0,0.25)',
      padding: '3px 9px', borderRadius: 7,
      display: 'flex', alignItems: 'center',
    }}>
      {dot('#FF8C00')} LOCAL ONLY
    </span>
  )
  if (saving) return (
    <span style={{
      fontSize: 10, fontWeight: 700, letterSpacing: '0.08em',
      color: '#00E5FF', background: 'rgba(0,229,255,0.1)',
      border: '1px solid rgba(0,229,255,0.25)',
      padding: '3px 9px', borderRadius: 7,
      display: 'flex', alignItems: 'center',
    }}>
      {dot('#00E5FF')} SAVING…
    </span>
  )
  return (
    <span style={{
      fontSize: 10, fontWeight: 700, letterSpacing: '0.08em',
      color: '#00FF88', background: 'rgba(0,255,136,0.08)',
      border: '1px solid rgba(0,255,136,0.22)',
      padding: '3px 9px', borderRadius: 7,
      display: 'flex', alignItems: 'center',
    }}>
      {dot('#00FF88')} SAVED TO FILE
    </span>
  )
}

// ─── Modal Base ───────────────────────────────────────────────────────
function Modal({ open, onClose, title, children, width = 480, t }) {
  if (!open) return null
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, zIndex: 1000,
          background: 'rgba(0,0,0,0.80)', backdropFilter: 'blur(10px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16,
        }}
      >
        <motion.div
          initial={{ scale: 0.86, opacity: 0, y: 36 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 12 }}
          transition={{ type: 'spring', stiffness: 320, damping: 26 }}
          onClick={e => e.stopPropagation()}
          style={{
            background: t.theme === 'dark'
              ? 'linear-gradient(145deg, #0e2040 0%, #080f1e 100%)'
              : 'linear-gradient(145deg, #ffffff 0%, #f0f4fb 100%)',
            border: `1px solid ${t.theme === 'dark' ? 'rgba(0,229,255,0.22)' : 'rgba(0,0,0,0.09)'}`,
            borderRadius: 22, padding: 28, width: '100%', maxWidth: width,
            boxShadow: t.theme === 'dark'
              ? '0 40px 90px rgba(0,0,0,0.65), 0 0 50px rgba(0,229,255,0.07), inset 0 1px 0 rgba(255,255,255,0.05)'
              : '0 40px 90px rgba(0,0,0,0.14)',
            maxHeight: '90vh', overflowY: 'auto',
          }}
        >
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom: 24 }}>
            <h3 style={{ color: t.textBright, fontWeight: 800, fontSize: 17, margin: 0, letterSpacing: '-0.01em' }}>{title}</h3>
            <button onClick={onClose} style={{
              background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 10, padding: '6px 11px', cursor: 'pointer', color: '#888',
              display:'flex', alignItems:'center', transition:'all .18s',
            }}
              onMouseEnter={e=>{e.currentTarget.style.color='#fff';e.currentTarget.style.background='rgba(255,255,255,0.12)'}}
              onMouseLeave={e=>{e.currentTarget.style.color='#888';e.currentTarget.style.background='rgba(255,255,255,0.07)'}}
            >
              <FaTimes size={13}/>
            </button>
          </div>
          {children}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

// ─── Form Input ───────────────────────────────────────────────────────
function FormInput({ label, value, onChange, placeholder, type = 'text', required, t }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display:'block', fontSize: 10.5, fontWeight: 800, color: '#777', textTransform:'uppercase', letterSpacing:'0.1em', marginBottom: 7 }}>
        {label}{required && <span style={{ color:'#ff4c4c', marginLeft:3 }}>*</span>}
      </label>
      <input
        type={type} value={value} onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width:'100%', padding:'10px 14px', borderRadius:12, fontSize:13,
          background: t.inputBg, border:'1px solid rgba(0,229,255,0.15)',
          color: t.textBright, outline:'none', boxSizing:'border-box', transition:'border .18s',
          fontFamily:'inherit',
        }}
        onFocus={e=>e.target.style.border='1px solid rgba(0,229,255,0.55)'}
        onBlur={e=>e.target.style.border='1px solid rgba(0,229,255,0.15)'}
      />
    </div>
  )
}

// ─── Icon Picker ──────────────────────────────────────────────────────
function IconPicker({ value, onChange }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display:'block', fontSize:10.5, fontWeight:800, color:'#777', textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:8 }}>Icon</label>
      <div style={{ display:'flex', flexWrap:'wrap', gap:7 }}>
        {ICON_OPTIONS.map(key => (
          <button
            key={key} type="button" onClick={() => onChange(key)} title={key}
            style={{
              width:36, height:36, borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center',
              background: value===key ? 'rgba(0,229,255,0.18)' : 'rgba(255,255,255,0.04)',
              border: value===key ? '1.5px solid rgba(0,229,255,0.65)' : '1px solid rgba(255,255,255,0.08)',
              cursor:'pointer', color: value===key ? '#00E5FF' : '#555', transition:'all .15s',
              transform: value===key ? 'scale(1.08)' : 'scale(1)',
            }}
            onMouseEnter={e=>{if(value!==key){e.currentTarget.style.background='rgba(255,255,255,0.09)';e.currentTarget.style.color='#999'}}}
            onMouseLeave={e=>{if(value!==key){e.currentTarget.style.background='rgba(255,255,255,0.04)';e.currentTarget.style.color='#555'}}}
          >
            <Icon name={key} size={16} />
          </button>
        ))}
      </div>
    </div>
  )
}

// ─── Color Picker ─────────────────────────────────────────────────────
function ColorPicker({ value, onChange }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display:'block', fontSize:10.5, fontWeight:800, color:'#777', textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:8 }}>Accent Color</label>
      <div style={{ display:'flex', gap:9, flexWrap:'wrap' }}>
        {CAT_COLORS.map(c => (
          <button key={c} type="button" onClick={() => onChange(c)}
            style={{
              width:30, height:30, borderRadius:9, background:c,
              border: value===c ? '2.5px solid #fff' : '2px solid transparent',
              cursor:'pointer', transition:'all .15s',
              boxShadow: value===c ? `0 0 14px ${c}99, 0 0 4px ${c}55` : `0 2px 6px ${c}44`,
              transform: value===c ? 'scale(1.15)' : 'scale(1)',
            }}
          />
        ))}
      </div>
    </div>
  )
}

// ─── Add/Edit Server Modal ────────────────────────────────────────────
function ServerModal({ open, onClose, onSave, initial, title, t }) {
  const [name, setName]       = useState(initial?.name || '')
  const [url, setUrl]         = useState(initial?.url || '')
  const [desc, setDesc]       = useState(initial?.description || '')
  const [tag, setTag]         = useState(initial?.tag || '')
  const [iconKey, setIconKey] = useState(initial?.iconKey || 'FaGlobe')

  useEffect(() => {
    if (open) {
      setName(initial?.name || ''); setUrl(initial?.url || '')
      setDesc(initial?.description || ''); setTag(initial?.tag || '')
      setIconKey(initial?.iconKey || 'FaGlobe')
    }
  }, [open, initial])

  const handleSave = () => {
    if (!name.trim() || !url.trim()) return
    onSave({ name: name.trim(), url: url.trim(), description: desc.trim(), tag: tag.trim(), iconKey })
  }

  const valid = name.trim() && url.trim()

  return (
    <Modal open={open} onClose={onClose} title={title || 'Add Server'} t={t}>
      <FormInput label="Server Name" value={name} onChange={setName} placeholder="e.g. My FTP Server" required t={t} />
      <FormInput label="URL" value={url} onChange={setUrl} placeholder="https://example.com" required t={t} />
      <FormInput label="Description" value={desc} onChange={setDesc} placeholder="Short description..." t={t} />
      <FormInput label="Tag" value={tag} onChange={setTag} placeholder="FTP, Movies, TV..." t={t} />
      <IconPicker value={iconKey} onChange={setIconKey} />
      <div style={{ display:'flex', gap:10, marginTop:8 }}>
        <button onClick={onClose} style={{
          flex:1, padding:'11px 0', borderRadius:12, fontSize:13, fontWeight:700,
          background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)',
          color:'#888', cursor:'pointer', transition:'all .18s',
        }}
          onMouseEnter={e=>{e.currentTarget.style.color='#ccc';e.currentTarget.style.background='rgba(255,255,255,0.09)'}}
          onMouseLeave={e=>{e.currentTarget.style.color='#888';e.currentTarget.style.background='rgba(255,255,255,0.05)'}}
        >Cancel</button>
        <button onClick={handleSave} disabled={!valid} style={{
          flex:2, padding:'11px 0', borderRadius:12, fontSize:13, fontWeight:700,
          background: valid ? 'linear-gradient(135deg,#00E5FF,#7B61FF)' : 'rgba(0,229,255,0.08)',
          border:'none', color: valid ? '#fff' : '#444',
          cursor: valid ? 'pointer' : 'not-allowed', transition:'all .18s',
          boxShadow: valid ? '0 4px 20px rgba(0,229,255,0.28)' : 'none',
        }}>Save Server</button>
      </div>
    </Modal>
  )
}

// ─── Add/Edit Category Modal ──────────────────────────────────────────
function CategoryModal({ open, onClose, onSave, initial, title, t }) {
  const [name, setName]       = useState(initial?.name || '')
  const [desc, setDesc]       = useState(initial?.description || '')
  const [iconKey, setIconKey] = useState(initial?.iconKey || 'FaServer')
  const [color, setColor]     = useState(initial?.color || '#00E5FF')

  useEffect(() => {
    if (open) {
      setName(initial?.name || ''); setDesc(initial?.description || '')
      setIconKey(initial?.iconKey || 'FaServer'); setColor(initial?.color || '#00E5FF')
    }
  }, [open, initial])

  const handleSave = () => {
    if (!name.trim()) return
    onSave({ name: name.trim(), description: desc.trim(), iconKey, color })
  }

  return (
    <Modal open={open} onClose={onClose} title={title || 'Add Category'} t={t}>
      <FormInput label="Category Name" value={name} onChange={setName} placeholder="e.g. My Servers" required t={t} />
      <FormInput label="Description" value={desc} onChange={setDesc} placeholder="Short description..." t={t} />
      <ColorPicker value={color} onChange={setColor} />
      <IconPicker value={iconKey} onChange={setIconKey} />
      <div style={{ display:'flex', gap:10, marginTop:8 }}>
        <button onClick={onClose} style={{
          flex:1, padding:'11px 0', borderRadius:12, fontSize:13, fontWeight:700,
          background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)',
          color:'#888', cursor:'pointer',
        }}>Cancel</button>
        <button onClick={handleSave} disabled={!name.trim()} style={{
          flex:2, padding:'11px 0', borderRadius:12, fontSize:13, fontWeight:700,
          background: name.trim() ? 'linear-gradient(135deg,#00E5FF,#7B61FF)' : 'rgba(0,229,255,0.08)',
          border:'none', color: name.trim() ? '#fff' : '#444',
          cursor: name.trim() ? 'pointer' : 'not-allowed',
          boxShadow: name.trim() ? '0 4px 20px rgba(0,229,255,0.28)' : 'none',
        }}>Save Category</button>
      </div>
    </Modal>
  )
}

// ─── Confirm Delete Modal ─────────────────────────────────────────────
function ConfirmModal({ open, onClose, onConfirm, message, t }) {
  return (
    <Modal open={open} onClose={onClose} title="Confirm Delete" width={380} t={t}>
      <div style={{
        background: 'rgba(255,60,60,0.06)', border: '1px solid rgba(255,60,60,0.18)',
        borderRadius: 12, padding: '14px 16px', marginBottom: 22,
      }}>
        <p style={{ color:'#bbb', fontSize:13.5, margin:0, lineHeight:1.65 }}>{message}</p>
      </div>
      <div style={{ display:'flex', gap:10 }}>
        <button onClick={onClose} style={{
          flex:1, padding:'11px 0', borderRadius:12, fontSize:13, fontWeight:700,
          background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)',
          color:'#888', cursor:'pointer',
        }}>Cancel</button>
        <button onClick={onConfirm} style={{
          flex:1, padding:'11px 0', borderRadius:12, fontSize:13, fontWeight:700,
          background:'linear-gradient(135deg,rgba(255,60,60,0.28),rgba(200,0,0,0.18))',
          border:'1px solid rgba(255,60,60,0.45)', color:'#ff7070', cursor:'pointer',
          boxShadow: '0 4px 16px rgba(255,0,0,0.14)',
        }}>Delete</button>
      </div>
    </Modal>
  )
}

// ─── Action Button ────────────────────────────────────────────────────
function ActionBtn({ onClick, title, disabled, children, highlight }) {
  const [h, setH] = useState(false)
  return (
    <button
      onClick={disabled ? undefined : onClick}
      title={title}
      onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{
        width:28, height:28, borderRadius:9,
        border: h && !disabled ? '1px solid rgba(255,255,255,0.18)' : '1px solid rgba(255,255,255,0.07)',
        background: h && !disabled
          ? (highlight ? `rgba(${highlight},0.18)` : 'rgba(255,255,255,0.12)')
          : 'rgba(255,255,255,0.04)',
        cursor: disabled ? 'not-allowed' : 'pointer',
        display:'flex', alignItems:'center', justifyContent:'center',
        transition:'all .15s', padding:0,
        transform: h && !disabled ? 'scale(1.08)' : 'scale(1)',
      }}
    >
      {children}
    </button>
  )
}

// ─── Server Card ──────────────────────────────────────────────────────
function ServerCard({ server, catColor, isGuest, isFav, onToggleFav, onEdit, onDelete, showToast, t }) {
  const [hovered, setHovered] = useState(false)
  const [copied, setCopied]   = useState(false)

  const handleCopy = (e) => {
    e.stopPropagation()
    if (isGuest) { showToast('Copy disabled — Guest mode', 'error'); return }
    navigator.clipboard.writeText(server.url).then(() => {
      setCopied(true); showToast('URL copied to clipboard!')
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const handleOpen = () => {
    if (isGuest) { showToast('Navigation disabled — Guest mode', 'error'); return }
    window.open(server.url, '_blank', 'noopener,noreferrer')
  }

  const handleFav = (e) => {
    e.stopPropagation()
    if (isGuest) { showToast('Favorites disabled — Guest mode', 'error'); return }
    onToggleFav(server)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 18, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.22 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={handleOpen}
      style={{
        background: hovered ? t.cardBgHover : t.cardBg,
        border: hovered ? `1px solid ${catColor}60` : `1px solid ${t.border}`,
        borderRadius: 18, padding: '16px 16px 14px',
        cursor: isGuest ? 'not-allowed' : 'pointer',
        transition: 'all .22s cubic-bezier(0.4,0,0.2,1)',
        position:'relative', overflow:'hidden',
        boxShadow: hovered
          ? `0 12px 40px rgba(0,0,0,0.35), 0 0 0 1px ${catColor}18, 0 0 28px ${catColor}15`
          : '0 2px 8px rgba(0,0,0,0.12)',
        transform: hovered ? 'translateY(-2px)' : 'translateY(0)',
      }}
    >
      {/* Top glow edge on hover */}
      <div style={{
        position:'absolute', top:0, left:0, right:0, height:2,
        background: hovered && !isGuest
          ? `linear-gradient(90deg, transparent, ${catColor}, transparent)`
          : 'transparent',
        borderRadius:'18px 18px 0 0', transition:'all .3s',
      }}/>

      {/* Left accent bar */}
      <div style={{
        position:'absolute', top:16, left:0, width:3, height:28,
        background: `linear-gradient(180deg, ${catColor}, transparent)`,
        borderRadius:'0 3px 3px 0',
        opacity: hovered ? 1 : 0.4,
        transition:'opacity .22s',
      }}/>

      {/* Header */}
      <div style={{ display:'flex', alignItems:'flex-start', gap:12, marginBottom:10, paddingLeft:10 }}>
        <motion.div
          whileHover={{ scale: 1.1, rotate: 3 }}
          style={{
            width:40, height:40, borderRadius:12, flexShrink:0,
            background:`${catColor}18`, border:`1.5px solid ${catColor}40`,
            display:'flex', alignItems:'center', justifyContent:'center',
            boxShadow: hovered ? `0 0 16px ${catColor}30` : 'none',
            transition:'box-shadow .22s',
          }}
        >
          <Icon name={server.iconKey} size={19} color={catColor} />
        </motion.div>
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{
            fontWeight:800, fontSize:13.5, color:t.textBright, marginBottom:3,
            overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap',
            letterSpacing:'-0.01em',
          }}>
            {server.name}
          </div>
          <div style={{
            fontSize:10.5, color: hovered ? catColor : t.textMuted,
            overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap',
            transition:'color .22s', fontFamily:'monospace', letterSpacing:'0.01em',
          }}>
            {server.url}
          </div>
        </div>
      </div>

      {/* Description */}
      <p style={{
        fontSize:12, color:t.textMuted, lineHeight:1.55, marginBottom:12, minHeight:34,
        display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden',
        paddingLeft:10,
      }}>
        {server.description || 'No description'}
      </p>

      {/* Footer */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', paddingLeft:10 }}>
        <span style={{
          fontSize:9.5, fontWeight:800, letterSpacing:'0.1em', textTransform:'uppercase',
          background:`${catColor}18`, color: catColor, padding:'4px 10px', borderRadius:8,
          border:`1px solid ${catColor}28`,
        }}>
          {server.tag || 'Server'}
        </span>

        <div style={{ display:'flex', gap:4 }} onClick={e => e.stopPropagation()}>
          <ActionBtn onClick={handleCopy} title={isGuest ? 'Guest — cannot copy' : 'Copy URL'} disabled={isGuest} highlight="0,229,255">
            {copied ? <FaCheck size={11} color="#00ff88"/> : <FaCopy size={11} color={isGuest?'#333':'#777'}/>}
          </ActionBtn>
          <ActionBtn onClick={handleFav} title={isGuest ? 'Guest — no favorites' : (isFav ? 'Remove from favorites' : 'Add to favorites')} disabled={isGuest} highlight="255,215,0">
            <FaStar size={11} color={isGuest ? '#333' : (isFav ? '#FFD700' : '#777')} style={isFav&&!isGuest?{filter:'drop-shadow(0 0 5px #FFD700)'}:{}}/>
          </ActionBtn>
          {!isGuest && (
            <ActionBtn onClick={() => onEdit(server)} title="Edit server" highlight="123,97,255">
              <FaEdit size={11} color="#888"/>
            </ActionBtn>
          )}
          {!isGuest && (
            <ActionBtn onClick={() => onDelete(server)} title="Delete server" highlight="255,60,60">
              <FaTrash size={11} color="#888"/>
            </ActionBtn>
          )}
          <ActionBtn onClick={handleOpen} title={isGuest ? 'Guest — navigation disabled' : 'Open in new tab'} disabled={isGuest} highlight="0,229,255">
            <FaExternalLinkAlt size={11} color={isGuest?'#333':'#777'}/>
          </ActionBtn>
        </div>
      </div>
    </motion.div>
  )
}

// ─── Category Section ─────────────────────────────────────────────────
function CategorySection({ category, isGuest, favorites, onToggleFav, onEditServer, onDeleteServer, onAddServer, onEditCategory, onDeleteCategory, showToast, t }) {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <section style={{ marginBottom: 40 }}>
      {/* Header */}
      <div style={{
        display:'flex', alignItems:'center', gap:14, marginBottom: collapsed ? 0 : 18, padding:'0 24px',
        cursor:'pointer',
      }}
        onClick={() => setCollapsed(!collapsed)}
      >
        <motion.div
          whileHover={{ scale: 1.06 }}
          style={{
            width:40, height:40, borderRadius:12, display:'flex', alignItems:'center', justifyContent:'center',
            background:`linear-gradient(135deg, ${category.color}28, ${category.color}10)`,
            border:`1.5px solid ${category.color}50`,
            boxShadow:`0 0 20px ${category.color}20`, flexShrink:0,
          }}
        >
          <Icon name={category.iconKey} size={19} color={category.color}/>
        </motion.div>

        <div style={{ flex:1 }}>
          <h2 style={{ margin:0, fontSize:15, fontWeight:800, color:t.textBright, letterSpacing:'-0.01em' }}>{category.name}</h2>
          <p style={{ margin:0, fontSize:11.5, color:t.textMuted, marginTop:1 }}>{category.description}</p>
        </div>

        <div style={{
          fontSize:10.5, fontWeight:800, padding:'4px 13px', borderRadius:20,
          background:`${category.color}18`, color:category.color, border:`1px solid ${category.color}30`,
          letterSpacing:'0.04em',
        }}>
          {category.servers.length} servers
        </div>

        {!isGuest && (
          <div style={{ display:'flex', gap:6 }} onClick={e => e.stopPropagation()}>
            <ActionBtn onClick={() => onAddServer(category.id)} title="Add server" highlight="0,229,255">
              <FaPlus size={11} color="#00E5FF"/>
            </ActionBtn>
            <ActionBtn onClick={() => onEditCategory(category)} title="Edit category" highlight="123,97,255">
              <FaEdit size={11} color="#888"/>
            </ActionBtn>
            <ActionBtn onClick={() => onDeleteCategory(category)} title="Delete category" highlight="255,60,60">
              <FaTrash size={11} color="#888"/>
            </ActionBtn>
          </div>
        )}

        <motion.div
          animate={{ rotate: collapsed ? -90 : 0 }}
          transition={{ duration: 0.22 }}
          onClick={e => { e.stopPropagation(); setCollapsed(!collapsed) }}
          style={{ color: t.textFaint, cursor:'pointer', padding:4 }}
        >
          <FaChevronRight size={11}/>
        </motion.div>
      </div>

      {/* Server grid */}
      <AnimatePresence>
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{
              display:'grid', padding:'0 24px',
              gridTemplateColumns:'repeat(auto-fill, minmax(265px, 1fr))', gap:14,
            }}>
              {category.servers.map((srv, i) => (
                <motion.div
                  key={srv.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                >
                  <ServerCard
                    server={srv} catColor={category.color}
                    isGuest={isGuest} isFav={favorites.includes(srv.id)}
                    onToggleFav={onToggleFav}
                    onEdit={(s) => onEditServer(category.id, s)}
                    onDelete={(s) => onDeleteServer(category.id, s)}
                    showToast={showToast}
                    t={t}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

// ─── Sidebar ──────────────────────────────────────────────────────────
function Sidebar({ categories, activeView, setActiveView, onLogout, isGuest, collapsed, setCollapsed, t }) {
  const navItem = (id, label, iconName, color) => {
    const active = activeView === id
    return (
      <button
        key={id}
        onClick={() => setActiveView(id)}
        style={{
          display:'flex', alignItems:'center', gap:10, width:'100%',
          padding: collapsed ? '10px 0' : '9px 13px',
          justifyContent: collapsed ? 'center' : 'flex-start',
          borderRadius:11, marginBottom:3, border:'none', cursor:'pointer', transition:'all .18s',
          background: active ? `${color || '#00E5FF'}16` : 'transparent',
          color: active ? (color || '#00E5FF') : t.textMuted,
          borderLeft: active ? `2.5px solid ${color || '#00E5FF'}` : '2.5px solid transparent',
        }}
        onMouseEnter={e=>{ if(!active){ e.currentTarget.style.background='rgba(255,255,255,0.06)'; e.currentTarget.style.color='#bbb' }}}
        onMouseLeave={e=>{ if(!active){ e.currentTarget.style.background='transparent'; e.currentTarget.style.color=t.textMuted }}}
        title={collapsed ? label : ''}
      >
        <Icon name={iconName} size={15} color={active ? (color||'#00E5FF') : undefined}/>
        {!collapsed && <span style={{ fontSize:12.5, fontWeight:600 }}>{label}</span>}
        {!collapsed && active && (
          <div style={{
            marginLeft:'auto', width:6, height:6, borderRadius:'50%',
            background: color || '#00E5FF', boxShadow:`0 0 8px ${color||'#00E5FF'}`,
          }}/>
        )}
      </button>
    )
  }

  return (
    <div style={{
      width: collapsed ? 56 : 224, flexShrink:0, height:'100vh',
      background: t.sidebarBg, borderRight:`1px solid ${t.border}`,
      display:'flex', flexDirection:'column', transition:'width .25s cubic-bezier(0.4,0,0.2,1)',
      backdropFilter:'blur(24px)', overflowX:'hidden', overflowY:'auto',
    }}>
      {/* Logo */}
      <div style={{
        padding: collapsed ? '16px 0' : '16px 15px', borderBottom:`1px solid ${t.border}`,
        display:'flex', alignItems:'center', gap:10, justifyContent: collapsed ? 'center' : 'flex-start',
        minHeight:60,
      }}>
        <div style={{
          width:32, height:32, borderRadius:10, flexShrink:0,
          background:'linear-gradient(135deg,rgba(0,229,255,0.2),rgba(123,97,255,0.2))',
          border:'1.5px solid rgba(0,229,255,0.35)', display:'flex', alignItems:'center', justifyContent:'center',
          boxShadow:'0 0 20px rgba(0,229,255,0.15)',
        }}>
          <FaServer size={14} color="#00E5FF"/>
        </div>
        {!collapsed && (
          <div>
            <div style={{ fontSize:11.5, fontWeight:900, background:'linear-gradient(90deg,#00E5FF,#7B61FF)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', letterSpacing:'0.06em' }}>MY SERVER</div>
            <div style={{ fontSize:8.5, color:t.textFaint, fontWeight:700, letterSpacing:'0.14em', marginTop:1 }}>PORTAL v1.0</div>
          </div>
        )}
      </div>

      {/* Collapse toggle */}
      <div style={{ padding:'8px 8px 4px', borderBottom:`1px solid ${t.border}` }}>
        <button
          onClick={() => setCollapsed(!collapsed)}
          style={{
            width:'100%', padding:'7px 0', borderRadius:9, border:`1px solid ${t.border}`,
            background:'rgba(255,255,255,0.04)', color:t.textMuted, cursor:'pointer', transition:'all .18s',
            display:'flex', alignItems:'center', justifyContent:'center',
          }}
          onMouseEnter={e=>{e.currentTarget.style.color='#aaa';e.currentTarget.style.background='rgba(255,255,255,0.09)'}}
          onMouseLeave={e=>{e.currentTarget.style.color=t.textMuted;e.currentTarget.style.background='rgba(255,255,255,0.04)'}}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <FaBars size={12}/>
        </button>
      </div>

      {/* Nav */}
      <div style={{ padding:'10px 8px', flex:1 }}>
        {!collapsed && (
          <div style={{ fontSize:9, color:t.textFaint, fontWeight:800, letterSpacing:'0.16em', textTransform:'uppercase', margin:'4px 6px 9px' }}>
            Navigation
          </div>
        )}
        {navItem('dashboard', 'Home', 'FaHome', '#00E5FF')}
        {navItem('search', 'Search', 'FaSearch', '#7B61FF')}
        {!isGuest && navItem('favorites', 'Favorites', 'FaStar', '#FFD700')}
        {navItem('recent', 'Recent', 'FaClock', '#00FF88')}

        {!collapsed && (
          <div style={{ fontSize:9, color:t.textFaint, fontWeight:800, letterSpacing:'0.16em', textTransform:'uppercase', margin:'18px 6px 9px' }}>
            Categories
          </div>
        )}
        {collapsed && <div style={{ margin:'8px 0', height:1, background:t.border }}/>}
        {categories.map(cat => navItem(`cat_${cat.id}`, cat.name, cat.iconKey, cat.color))}
      </div>

      {/* Logout */}
      <div style={{ padding:'10px 8px', borderTop:`1px solid ${t.border}` }}>
        <button
          onClick={onLogout}
          style={{
            display:'flex', alignItems:'center', gap:9, width:'100%',
            padding: collapsed ? '10px 0' : '9px 13px',
            justifyContent: collapsed ? 'center' : 'flex-start',
            borderRadius:11, border:'1px solid rgba(255,60,60,0.15)', cursor:'pointer',
            background:'rgba(255,60,60,0.06)', color:'#b84444', transition:'all .2s',
          }}
          title={collapsed ? 'Logout' : ''}
          onMouseEnter={e=>{e.currentTarget.style.background='rgba(255,60,60,0.14)';e.currentTarget.style.color='#ff7070';e.currentTarget.style.borderColor='rgba(255,60,60,0.35)'}}
          onMouseLeave={e=>{e.currentTarget.style.background='rgba(255,60,60,0.06)';e.currentTarget.style.color='#b84444';e.currentTarget.style.borderColor='rgba(255,60,60,0.15)'}}
        >
          <FaSignOutAlt size={14}/>
          {!collapsed && <span style={{ fontSize:12.5, fontWeight:700 }}>Logout</span>}
        </button>
      </div>
    </div>
  )
}

// ─── Stats Bar ────────────────────────────────────────────────────────
function StatsBar({ categories, favCount, t }) {
  const total = categories.reduce((a, c) => a + c.servers.length, 0)
  const stats = [
    { label:'Categories', value: categories.length, icon:'FaFilter', color:'#7B61FF', desc:'Total groups' },
    { label:'Total Servers', value: total, icon:'FaServer', color:'#00E5FF', desc:'Across all categories' },
    { label:'Favorites', value: favCount, icon:'FaStar', color:'#FFD700', desc:'Saved servers' },
  ]
  return (
    <div style={{ display:'flex', gap:14, padding:'0 24px 24px', flexWrap:'wrap' }}>
      {stats.map((s, i) => (
        <motion.div
          key={s.label}
          initial={{ opacity:0, y:16 }}
          animate={{ opacity:1, y:0 }}
          transition={{ delay: i * 0.07 }}
          style={{
            flex:'1 1 150px', background:t.cardBg, border:`1px solid ${t.border}`,
            borderRadius:16, padding:'16px 20px', display:'flex', alignItems:'center', gap:14,
            position:'relative', overflow:'hidden',
          }}
        >
          <div style={{
            position:'absolute', top:-20, right:-20, width:80, height:80, borderRadius:'50%',
            background:`${s.color}08`, pointerEvents:'none',
          }}/>
          <div style={{
            width:40, height:40, borderRadius:12,
            background:`${s.color}18`, border:`1.5px solid ${s.color}35`,
            display:'flex', alignItems:'center', justifyContent:'center',
            boxShadow:`0 0 18px ${s.color}20`,
          }}>
            <Icon name={s.icon} size={18} color={s.color}/>
          </div>
          <div>
            <div style={{ fontSize:22, fontWeight:900, color:t.textBright, lineHeight:1, letterSpacing:'-0.02em' }}>{s.value}</div>
            <div style={{ fontSize:11, color:t.textMuted, marginTop:3, fontWeight:600 }}>{s.label}</div>
            <div style={{ fontSize:9.5, color:t.textFaint, marginTop:1 }}>{s.desc}</div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

// ─── Search View ──────────────────────────────────────────────────────
function SearchView({ categories, isGuest, favorites, onToggleFav, onEditServer, onDeleteServer, showToast, t }) {
  const [query, setQuery] = useState('')

  const results = query.trim()
    ? categories.flatMap(c => c.servers
        .filter(s =>
          s.name.toLowerCase().includes(query.toLowerCase()) ||
          s.url.toLowerCase().includes(query.toLowerCase()) ||
          (s.tag||'').toLowerCase().includes(query.toLowerCase()) ||
          (s.description||'').toLowerCase().includes(query.toLowerCase())
        )
        .map(s => ({ ...s, _catColor: c.color, _catId: c.id }))
      )
    : []

  return (
    <div style={{ padding:'24px' }}>
      <div style={{ position:'relative', marginBottom:24, maxWidth:560 }}>
        <FaSearch size={14} color={t.textMuted} style={{ position:'absolute', left:15, top:'50%', transform:'translateY(-50%)', pointerEvents:'none' }}/>
        <input
          autoFocus value={query} onChange={e => setQuery(e.target.value)}
          placeholder="Search servers, tags, URLs, descriptions…"
          style={{
            width:'100%', padding:'13px 15px 13px 44px', borderRadius:16, fontSize:14,
            background:t.inputBg, border:'1.5px solid rgba(0,229,255,0.2)',
            color:t.textBright, outline:'none', boxSizing:'border-box', fontFamily:'inherit',
            transition:'border .2s', letterSpacing:'-0.01em',
          }}
          onFocus={e=>e.target.style.border='1.5px solid rgba(0,229,255,0.55)'}
          onBlur={e=>e.target.style.border='1.5px solid rgba(0,229,255,0.2)'}
        />
        {query && (
          <button onClick={() => setQuery('')} style={{
            position:'absolute', right:13, top:'50%', transform:'translateY(-50%)',
            background:'rgba(255,255,255,0.08)', border:'1px solid rgba(255,255,255,0.1)',
            borderRadius:7, color:t.textMuted, cursor:'pointer', padding:'4px 7px',
            display:'flex', alignItems:'center',
          }}>
            <FaTimes size={11}/>
          </button>
        )}
      </div>

      {query.trim() === '' && (
        <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} style={{ textAlign:'center', padding:'80px 0', color:t.textFaint }}>
          <div style={{ fontSize:52, marginBottom:16, opacity:0.2 }}>🔍</div>
          <p style={{ margin:0, fontSize:15, fontWeight:600, color:t.textMuted }}>Search across all servers</p>
          <p style={{ margin:'6px 0 0', fontSize:12.5, color:t.textFaint }}>Try a name, URL, tag, or description</p>
        </motion.div>
      )}

      {query.trim() !== '' && results.length === 0 && (
        <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} style={{ textAlign:'center', padding:'80px 0', color:t.textFaint }}>
          <div style={{ fontSize:52, marginBottom:16, opacity:0.2 }}>😶</div>
          <p style={{ margin:0, fontSize:15, fontWeight:600, color:t.textMuted }}>No results for <span style={{color:'#00E5FF'}}>"{query}"</span></p>
          <p style={{ margin:'6px 0 0', fontSize:12.5 }}>Check the spelling or try a different term</p>
        </motion.div>
      )}

      {results.length > 0 && (
        <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }}>
          <p style={{ color:t.textMuted, fontSize:12, marginBottom:16, fontWeight:600 }}>
            <span style={{color:'#00E5FF', fontWeight:800}}>{results.length}</span> result{results.length!==1?'s':''} found
          </p>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(265px,1fr))', gap:14 }}>
            {results.map(srv => (
              <ServerCard
                key={srv.id} server={srv} catColor={srv._catColor}
                isGuest={isGuest} isFav={favorites.includes(srv.id)}
                onToggleFav={onToggleFav}
                onEdit={(s) => onEditServer(srv._catId, s)}
                onDelete={(s) => onDeleteServer(srv._catId, s)}
                showToast={showToast} t={t}
              />
            ))}
          </div>
        </motion.div>
      )}
    </div>
  )
}

// ─── Favorites View ───────────────────────────────────────────────────
function FavoritesView({ categories, favorites, onToggleFav, onEditServer, onDeleteServer, showToast, isGuest, t }) {
  if (isGuest) return (
    <div style={{ textAlign:'center', padding:'80px 24px', color:t.textFaint }}>
      <div style={{ fontSize:56, marginBottom:16, opacity:0.15 }}>🔒</div>
      <h3 style={{ margin:'0 0 8px', color:t.textMuted, fontWeight:800, fontSize:16 }}>Favorites Unavailable</h3>
      <p style={{ margin:0, fontSize:13, color:t.textFaint }}>Log in as Hasan to use favorites</p>
    </div>
  )

  const favServers = categories.flatMap(c =>
    c.servers.filter(s => favorites.includes(s.id)).map(s => ({ ...s, _catColor: c.color, _catId: c.id }))
  )

  if (favServers.length === 0) return (
    <div style={{ textAlign:'center', padding:'80px 24px', color:t.textFaint }}>
      <div style={{ fontSize:56, marginBottom:16, opacity:0.15 }}>⭐</div>
      <h3 style={{ margin:'0 0 8px', color:t.textMuted, fontWeight:800, fontSize:16 }}>No Favorites Yet</h3>
      <p style={{ margin:0, fontSize:13, color:t.textFaint }}>Click the star ★ on any server card to save it here</p>
    </div>
  )

  return (
    <div style={{ padding:'24px' }}>
      <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:22 }}>
        <div style={{
          width:38, height:38, borderRadius:12, background:'rgba(255,215,0,0.15)', border:'1.5px solid rgba(255,215,0,0.35)',
          display:'flex', alignItems:'center', justifyContent:'center',
        }}>
          <FaStar size={18} color="#FFD700" style={{ filter:'drop-shadow(0 0 8px #FFD700)' }}/>
        </div>
        <div>
          <h2 style={{ margin:0, fontSize:16, fontWeight:800, color:t.textBright, letterSpacing:'-0.01em' }}>Favorites</h2>
          <p style={{ margin:0, fontSize:11.5, color:t.textMuted }}>{favServers.length} saved server{favServers.length!==1?'s':''}</p>
        </div>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(265px,1fr))', gap:14 }}>
        {favServers.map(srv => (
          <ServerCard key={srv.id} server={srv} catColor={srv._catColor}
            isGuest={isGuest} isFav={true} onToggleFav={onToggleFav}
            onEdit={(s) => onEditServer(srv._catId, s)}
            onDelete={(s) => onDeleteServer(srv._catId, s)}
            showToast={showToast} t={t}
          />
        ))}
      </div>
    </div>
  )
}

// ─── Recent View ──────────────────────────────────────────────────────
function RecentView({ recent, categories, favorites, onToggleFav, onEditServer, onDeleteServer, showToast, isGuest, t }) {
  const recentServers = recent.map(id => {
    for (const c of categories) {
      const s = c.servers.find(x => x.id === id)
      if (s) return { ...s, _catColor: c.color, _catId: c.id }
    }
    return null
  }).filter(Boolean)

  if (recentServers.length === 0) return (
    <div style={{ textAlign:'center', padding:'80px 24px', color:t.textFaint }}>
      <div style={{ fontSize:56, marginBottom:16, opacity:0.15 }}>🕐</div>
      <h3 style={{ margin:'0 0 8px', color:t.textMuted, fontWeight:800, fontSize:16 }}>No Recent Activity</h3>
      <p style={{ margin:0, fontSize:13, color:t.textFaint }}>Servers you open will appear here</p>
    </div>
  )

  return (
    <div style={{ padding:'24px' }}>
      <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:22 }}>
        <div style={{
          width:38, height:38, borderRadius:12, background:'rgba(0,229,255,0.12)', border:'1.5px solid rgba(0,229,255,0.30)',
          display:'flex', alignItems:'center', justifyContent:'center',
        }}>
          <FaClock size={17} color="#00E5FF"/>
        </div>
        <div>
          <h2 style={{ margin:0, fontSize:16, fontWeight:800, color:t.textBright, letterSpacing:'-0.01em' }}>Recently Opened</h2>
          <p style={{ margin:0, fontSize:11.5, color:t.textMuted }}>{recentServers.length} server{recentServers.length!==1?'s':''}</p>
        </div>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(265px,1fr))', gap:14 }}>
        {recentServers.map(srv => (
          <ServerCard key={srv.id} server={srv} catColor={srv._catColor}
            isGuest={isGuest} isFav={favorites.includes(srv.id)} onToggleFav={onToggleFav}
            onEdit={(s) => onEditServer(srv._catId, s)}
            onDelete={(s) => onDeleteServer(srv._catId, s)}
            showToast={showToast} t={t}
          />
        ))}
      </div>
    </div>
  )
}

// ─── Hero Section ─────────────────────────────────────────────────────
function HeroSection({ isGuest, onAddCategory, t }) {
  return (
    <div style={{
      padding:'40px 24px 28px',
      background:`linear-gradient(180deg, rgba(0,229,255,0.05) 0%, rgba(123,97,255,0.02) 60%, transparent 100%)`,
      borderBottom:`1px solid ${t.border}`, marginBottom:8, position:'relative', overflow:'hidden',
    }}>
      {/* Decorative bg orbs */}
      <div style={{ position:'absolute', top:-60, right:80, width:260, height:260, borderRadius:'50%', background:'radial-gradient(circle, rgba(0,229,255,0.06) 0%, transparent 70%)', pointerEvents:'none' }}/>
      <div style={{ position:'absolute', top:20, right:300, width:180, height:180, borderRadius:'50%', background:'radial-gradient(circle, rgba(123,97,255,0.05) 0%, transparent 70%)', pointerEvents:'none' }}/>

      <div style={{ display:'flex', alignItems:'center', gap:18, flexWrap:'wrap', position:'relative' }}>
        <div>
          <div style={{ fontSize:10.5, fontWeight:800, letterSpacing:'0.16em', textTransform:'uppercase', color:'#00E5FF', marginBottom:6, opacity:0.8 }}>
            ⚡ MY SERVER PORTAL
          </div>
          <h1 style={{
            margin:0, fontSize:30, fontWeight:900, letterSpacing:'-0.02em',
            background:'linear-gradient(90deg,#00E5FF 0%,#7B61FF 60%,#FF6B35 100%)',
            WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent',
          }}>
            {isGuest ? 'Server Directory' : 'Welcome back, Hasan'}
          </h1>
          <p style={{ margin:'8px 0 0', fontSize:13.5, color:t.textMuted, lineHeight:1.5 }}>
            {isGuest
              ? <span>Browsing as <strong style={{color:'#FF8C00'}}>Guest</strong> · Read-only mode. All write actions are disabled.</span>
              : <span>Full <strong style={{color:'#00E5FF'}}>admin access</strong> enabled. Add, edit, and manage all servers.</span>}
          </p>
        </div>
        {!isGuest && (
          <div style={{ marginLeft:'auto', display:'flex', gap:9, flexWrap:'wrap' }}>
            <motion.button
              whileHover={{ scale: 1.03, y: -1 }}
              whileTap={{ scale: 0.97 }}
              onClick={onAddCategory}
              style={{
                display:'flex', alignItems:'center', gap:8, padding:'10px 18px', borderRadius:13,
                background:'linear-gradient(135deg,rgba(0,229,255,0.18),rgba(123,97,255,0.14))',
                border:'1.5px solid rgba(0,229,255,0.35)',
                color:'#00E5FF', fontWeight:800, fontSize:12.5, cursor:'pointer',
                letterSpacing:'0.03em', boxShadow:'0 4px 20px rgba(0,229,255,0.14)',
              }}
            >
              <FaPlus size={12}/> Add Category
            </motion.button>
          </div>
        )}
      </div>
    </div>
  )
}


// ─── User Badge ───────────────────────────────────────────────────────
function UserBadge({ isGuest, t }) {
  return (
    <div style={{
      display:'flex', alignItems:'center', gap:8, padding:'6px 12px', borderRadius:12,
      background: isGuest
        ? 'rgba(255,255,255,0.04)'
        : 'linear-gradient(135deg,rgba(0,229,255,0.12),rgba(123,97,255,0.10))',
      border: `1px solid ${isGuest ? t.border : 'rgba(0,229,255,0.30)'}`,
    }}>
      {isGuest
        ? <FaGhost size={13} color="#666"/>
        : <FaUser size={13} color="#00E5FF"/>}
      <span style={{ fontSize:12, fontWeight:800, color: isGuest ? t.textMuted : '#00E5FF', letterSpacing:'0.04em' }}>
        {isGuest ? 'Guest' : 'Hasan'}
      </span>
      {isGuest ? (
        <span style={{
          fontSize:9, fontWeight:700, color:t.textFaint,
          background:'rgba(255,255,255,0.05)', padding:'2px 7px', borderRadius:5,
          letterSpacing:'0.1em', textTransform:'uppercase',
          display:'flex', alignItems:'center', gap:4,
        }}>
          <FaLock size={8}/> Read Only
        </span>
      ) : (
        <span style={{
          fontSize:9, fontWeight:800, color:'#00E5FF',
          background:'rgba(0,229,255,0.12)', padding:'2px 7px', borderRadius:5,
          letterSpacing:'0.1em', textTransform:'uppercase',
          border:'1px solid rgba(0,229,255,0.2)',
        }}>Admin</span>
      )}
    </div>
  )
}

// ─── Guest Banner ─────────────────────────────────────────────────────
function GuestBanner() {
  return (
    <motion.div
      initial={{ opacity:0, y:-10 }} animate={{ opacity:1, y:0 }}
      transition={{ duration:0.3 }}
      style={{
        margin:'12px 20px 0', padding:'11px 18px', borderRadius:14,
        background:'linear-gradient(135deg,rgba(255,140,0,0.08),rgba(255,80,0,0.05))',
        border:'1px solid rgba(255,140,0,0.22)',
        display:'flex', alignItems:'center', gap:12, fontSize:13, color:'#aaa',
      }}
    >
      <div style={{
        width:32, height:32, borderRadius:9, background:'rgba(255,140,0,0.14)', border:'1px solid rgba(255,140,0,0.3)',
        display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0,
      }}>
        <FaGhost size={14} color="#FF8C00"/>
      </div>
      <div>
        <strong style={{ color:'#FF8C00', fontWeight:800 }}>Guest Mode</strong>
        <span style={{ color:'#888', marginLeft:8 }}>Copy, Favorite, Navigate and all write actions are disabled.</span>
      </div>
    </motion.div>
  )
}

// ─── Theme Toggle ─────────────────────────────────────────────────────
function ThemeToggleBtn({ theme, toggleTheme }) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.96 }}
      onClick={toggleTheme}
      title={theme === 'dark' ? 'Switch to Light' : 'Switch to Dark'}
      style={{
        display:'flex', alignItems:'center', gap:7, padding:'7px 12px', borderRadius:10,
        background: theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
        border: `1px solid ${theme === 'dark' ? 'rgba(0,229,255,0.2)' : 'rgba(0,0,0,0.1)'}`,
        color: theme === 'dark' ? '#00E5FF' : '#7B61FF',
        cursor:'pointer', fontSize:12, fontWeight:600,
      }}
    >
      {theme === 'dark' ? <Sun size={14}/> : <Moon size={14}/>}
      <span style={{ fontSize:11 }}>{theme === 'dark' ? 'Light' : 'Dark'}</span>
    </motion.button>
  )
}

// ═══════════════════════════════════════════════════════════════════════
// ─── MAIN DASHBOARD ───────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════
export default function Dashboard({ onLogout, role }) {
  const { theme, toggleTheme } = useTheme()
  const t = { ...THEMES[theme], theme }
  const isGuest = role === 'guest'

  // useServerData: loads from servers.js via local API, falls back to localStorage
  const { categories, setCategories, save, apiAvailable, saving } = useServerData()

  const [favorites, setFavorites]   = useState(loadFavorites)
  const [recent, setRecent]         = useState([])
  const [activeView, setActiveView] = useState('dashboard')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const { toast, show: showToast } = useToast()

  // Modals
  const [addServerModal,  setAddServerModal]  = useState({ open:false, catId:null })
  const [editServerModal, setEditServerModal] = useState({ open:false, catId:null, server:null })
  const [delServerModal,  setDelServerModal]  = useState({ open:false, catId:null, server:null })
  const [addCatModal,     setAddCatModal]     = useState(false)
  const [editCatModal,    setEditCatModal]    = useState({ open:false, category:null })
  const [delCatModal,     setDelCatModal]     = useState({ open:false, category:null })

  // Persist favorites to localStorage
  useEffect(() => saveFavorites(favorites), [favorites])

  // ── Helper: update state AND write to servers.js via local API ──────
  const updateAndSave = (newCats) => {
    setCategories(newCats)
    save(newCats)
  }

  // ── Favorite toggle ──────────────────────────────────────────────────
  const handleToggleFav = (server) => {
    if (isGuest) return
    const isFav = favorites.includes(server.id)
    setFavorites(prev => isFav ? prev.filter(id => id !== server.id) : [server.id, ...prev])
    showToast(isFav ? 'Removed from favorites' : 'Added to favorites ⭐')
  }

  // ── Add Server ────────────────────────────────────────────────────────
  const handleAddServer = (catId, data) => {
    if (isGuest) return
    const newSrv = { id: uid(), ...data }
    const updated = categories.map(c =>
      c.id === catId ? { ...c, servers: [...c.servers, newSrv] } : c
    )
    updateAndSave(updated)
    setAddServerModal({ open:false, catId:null })
    showToast(apiAvailable ? `"${data.name}" added & saved to file!` : `"${data.name}" added (local only)`)
  }

  // ── Edit Server ───────────────────────────────────────────────────────
  const handleEditServer = (catId, data) => {
    if (isGuest) return
    const updated = categories.map(c =>
      c.id === catId
        ? { ...c, servers: c.servers.map(s => s.id === editServerModal.server.id ? { ...s, ...data } : s) }
        : c
    )
    updateAndSave(updated)
    setEditServerModal({ open:false, catId:null, server:null })
    showToast(apiAvailable ? 'Server updated & saved to file!' : 'Server updated (local only)')
  }

  // ── Delete Server ─────────────────────────────────────────────────────
  const handleDeleteServer = () => {
    if (isGuest) return
    const { catId, server } = delServerModal
    const updated = categories.map(c =>
      c.id === catId ? { ...c, servers: c.servers.filter(s => s.id !== server.id) } : c
    )
    updateAndSave(updated)
    setFavorites(prev => prev.filter(id => id !== server.id))
    setDelServerModal({ open:false, catId:null, server:null })
    showToast(apiAvailable ? 'Server deleted & saved' : 'Server deleted (local only)')
  }

  // ── Add Category ──────────────────────────────────────────────────────
  const handleAddCategory = (data) => {
    if (isGuest) return
    const newCat = { id: uid(), servers: [], ...data }
    const updated = [...categories, newCat]
    updateAndSave(updated)
    setAddCatModal(false)
    showToast(apiAvailable ? `"${data.name}" added & saved to file!` : `"${data.name}" added (local only)`)
  }

  // ── Edit Category ─────────────────────────────────────────────────────
  const handleEditCategory = (data) => {
    if (isGuest) return
    const updated = categories.map(c =>
      c.id === editCatModal.category.id ? { ...c, ...data } : c
    )
    updateAndSave(updated)
    setEditCatModal({ open:false, category:null })
    showToast(apiAvailable ? 'Category updated & saved to file!' : 'Category updated (local only)')
  }

  // ── Delete Category ───────────────────────────────────────────────────
  const handleDeleteCategory = () => {
    if (isGuest) return
    const { category } = delCatModal
    const updated = categories.filter(c => c.id !== category.id)
    updateAndSave(updated)
    setFavorites(prev => prev.filter(id => !category.servers.find(s => s.id === id)))
    setDelCatModal({ open:false, category:null })
    if (activeView === `cat_${category.id}`) setActiveView('dashboard')
    showToast(apiAvailable ? 'Category deleted & saved' : 'Category deleted (local only)')
  }

  // ── Render Content ────────────────────────────────────────────────────
  const renderContent = () => {
    if (activeView === 'search') return (
      <SearchView categories={categories} isGuest={isGuest} favorites={favorites}
        onToggleFav={handleToggleFav}
        onEditServer={(catId, s) => setEditServerModal({ open:true, catId, server:s })}
        onDeleteServer={(catId, s) => setDelServerModal({ open:true, catId, server:s })}
        showToast={showToast} t={t}
      />
    )
    if (activeView === 'favorites') return (
      <FavoritesView categories={categories} favorites={favorites} isGuest={isGuest}
        onToggleFav={handleToggleFav}
        onEditServer={(catId, s) => setEditServerModal({ open:true, catId, server:s })}
        onDeleteServer={(catId, s) => setDelServerModal({ open:true, catId, server:s })}
        showToast={showToast} t={t}
      />
    )
    if (activeView === 'recent') return (
      <RecentView recent={recent} categories={categories} favorites={favorites} isGuest={isGuest}
        onToggleFav={handleToggleFav}
        onEditServer={(catId, s) => setEditServerModal({ open:true, catId, server:s })}
        onDeleteServer={(catId, s) => setDelServerModal({ open:true, catId, server:s })}
        showToast={showToast} t={t}
      />
    )
    if (activeView.startsWith('cat_')) {
      const catId = activeView.replace('cat_', '')
      const cat = categories.find(c => c.id === catId)
      if (cat) return (
        <div style={{ paddingTop:24 }}>
          <CategorySection
            category={cat} isGuest={isGuest} favorites={favorites}
            onToggleFav={handleToggleFav}
            onEditServer={(cid, s) => setEditServerModal({ open:true, catId:cid, server:s })}
            onDeleteServer={(cid, s) => setDelServerModal({ open:true, catId:cid, server:s })}
            onAddServer={(cid) => setAddServerModal({ open:true, catId:cid })}
            onEditCategory={(c) => setEditCatModal({ open:true, category:c })}
            onDeleteCategory={(c) => setDelCatModal({ open:true, category:c })}
            showToast={showToast} t={t}
          />
        </div>
      )
    }
    // Default: dashboard home
    return (
      <div>
        <HeroSection isGuest={isGuest} onAddCategory={() => setAddCatModal(true)} t={t}/>
        <div style={{ padding:'18px 0 0' }}>
          <StatsBar categories={categories} favCount={favorites.length} t={t}/>
        </div>
        <div style={{ paddingBottom:48 }}>
          {categories.map(cat => (
            <CategorySection
              key={cat.id} category={cat} isGuest={isGuest} favorites={favorites}
              onToggleFav={handleToggleFav}
              onEditServer={(catId, s) => setEditServerModal({ open:true, catId, server:s })}
              onDeleteServer={(catId, s) => setDelServerModal({ open:true, catId, server:s })}
              onAddServer={(catId) => setAddServerModal({ open:true, catId })}
              onEditCategory={(c) => setEditCatModal({ open:true, category:c })}
              onDeleteCategory={(c) => setDelCatModal({ open:true, category:c })}
              showToast={showToast} t={t}
            />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div style={{
      display:'flex', height:'100vh', overflow:'hidden',
      background:t.bgPrimary, color:t.text,
      fontFamily:"'Inter','Segoe UI',system-ui,sans-serif",
    }}>
      {/* Sidebar */}
      <Sidebar
        categories={categories} activeView={activeView}
        setActiveView={setActiveView} onLogout={onLogout}
        isGuest={isGuest} collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed} t={t}
      />

      {/* Main */}
      <main style={{ flex:1, overflowY:'auto', display:'flex', flexDirection:'column', minWidth:0 }}>

        {/* Top Bar */}
        <div style={{
          position:'sticky', top:0, zIndex:50,
          background:t.glassBg, backdropFilter:'blur(24px)',
          borderBottom:`1px solid ${t.border}`,
          padding:'10px 20px',
          display:'flex', alignItems:'center', justifyContent:'space-between', gap:12,
        }}>
          <div style={{ display:'flex', alignItems:'center', gap:10, minWidth:0, overflow:'hidden' }}>
            <UserBadge isGuest={isGuest} t={t}/>
            <div style={{ width:1, height:18, background:t.border, flexShrink:0 }}/>
            {/* Save Status — admin only */}
            {!isGuest && (
              <>
                <SaveStatus saving={saving} apiAvailable={apiAvailable}/>
                <div style={{ width:1, height:18, background:t.border, flexShrink:0 }}/>
              </>
            )}
            {/* Breadcrumb */}
            <nav style={{ display:'flex', alignItems:'center', gap:5, fontSize:11.5, color:t.textMuted, overflow:'hidden' }}>
              <span style={{ flexShrink:0 }}>Portal</span>
              <FaChevronRight size={8} style={{ flexShrink:0, opacity:0.5 }}/>
              <span style={{ color:'#00E5FF', fontWeight:700, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                {activeView === 'dashboard' ? 'Home'
                  : activeView === 'search' ? 'Search'
                  : activeView === 'favorites' ? 'Favorites'
                  : activeView === 'recent' ? 'Recent'
                  : activeView.startsWith('cat_')
                    ? (categories.find(c => c.id === activeView.replace('cat_',''))?.name || 'Category')
                    : activeView}
              </span>
            </nav>
          </div>

          <div style={{ display:'flex', gap:8, alignItems:'center', flexShrink:0 }}>
            <ThemeToggleBtn theme={theme} toggleTheme={toggleTheme}/>
            <button
              onClick={() => setActiveView('search')}
              style={{
                display:'flex', alignItems:'center', gap:7, padding:'7px 14px', borderRadius:10,
                background:'rgba(255,255,255,0.04)', border:`1px solid ${t.border}`,
                color:t.textMuted, cursor:'pointer', fontSize:12, fontWeight:600, transition:'all .18s',
              }}
              onMouseEnter={e=>{e.currentTarget.style.color='#ccc';e.currentTarget.style.background='rgba(255,255,255,0.09)'}}
              onMouseLeave={e=>{e.currentTarget.style.color=t.textMuted;e.currentTarget.style.background='rgba(255,255,255,0.04)'}}
            >
              <FaSearch size={11}/><span>Search</span>
            </button>
            {!isGuest && (
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setAddCatModal(true)}
                style={{
                  display:'flex', alignItems:'center', gap:7, padding:'7px 14px', borderRadius:10,
                  background:'linear-gradient(135deg,rgba(0,229,255,0.14),rgba(123,97,255,0.10))',
                  border:'1px solid rgba(0,229,255,0.28)',
                  color:'#00E5FF', cursor:'pointer', fontSize:12, fontWeight:800,
                  boxShadow:'0 2px 12px rgba(0,229,255,0.12)',
                }}
              >
                <FaPlus size={11}/>Category
              </motion.button>
            )}
          </div>
        </div>

        {/* Guest Banner */}
        {isGuest && <GuestBanner/>}

        {/* Page Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeView}
            initial={{ opacity:0, y:12 }}
            animate={{ opacity:1, y:0 }}
            exit={{ opacity:0, y:-8 }}
            transition={{ duration:0.22, ease:'easeOut' }}
            style={{ flex:1 }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>

        {/* Footer */}
        <footer style={{
          padding:'20px 24px', textAlign:'center',
          borderTop:`1px solid ${t.border}`, marginTop:'auto',
          background:'linear-gradient(0deg, rgba(0,229,255,0.02) 0%, transparent 100%)',
        }}>
          <div style={{
            fontSize:11.5, fontWeight:900,
            background:'linear-gradient(90deg,#00E5FF,#7B61FF)',
            WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent',
            letterSpacing:'0.14em', marginBottom:5,
          }}>
            MY SERVER PAGE
          </div>
          <div style={{ fontSize:11, color:t.textFaint }}>
            Created by <span style={{ color:'#00E5FF', fontWeight:700 }}>Hasan</span> · v1.0.0 · © 2026 · FIFA 2026 Inspired
          </div>
        </footer>
      </main>

      {/* ── Modals ────────────────────────────────────────────────────── */}
      <ServerModal
        open={addServerModal.open}
        onClose={() => setAddServerModal({ open:false, catId:null })}
        onSave={(data) => handleAddServer(addServerModal.catId, data)}
        title="Add New Server" t={t}
      />
      <ServerModal
        open={editServerModal.open}
        onClose={() => setEditServerModal({ open:false, catId:null, server:null })}
        onSave={(data) => handleEditServer(editServerModal.catId, data)}
        initial={editServerModal.server}
        title="Edit Server" t={t}
      />
      <ConfirmModal
        open={delServerModal.open}
        onClose={() => setDelServerModal({ open:false, catId:null, server:null })}
        onConfirm={handleDeleteServer}
        message={`Delete "${delServerModal.server?.name}"? This cannot be undone.`}
        t={t}
      />
      <CategoryModal
        open={addCatModal}
        onClose={() => setAddCatModal(false)}
        onSave={handleAddCategory}
        title="Add New Category" t={t}
      />
      <CategoryModal
        open={editCatModal.open}
        onClose={() => setEditCatModal({ open:false, category:null })}
        onSave={handleEditCategory}
        initial={editCatModal.category}
        title="Edit Category" t={t}
      />
      <ConfirmModal
        open={delCatModal.open}
        onClose={() => setDelCatModal({ open:false, category:null })}
        onConfirm={handleDeleteCategory}
        message={`Delete category "${delCatModal.category?.name}" and ALL its servers? This cannot be undone.`}
        t={t}
      />

      <Toast toast={toast}/>

      {/* Pulse keyframe for save indicator */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity:1; transform:scale(1); }
          50% { opacity:0.5; transform:scale(0.85); }
        }
      `}</style>
    </div>
  )
}