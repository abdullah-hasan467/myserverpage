import { useState, useEffect } from 'react'
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

// ─── Icon Resolver ───────────────────────────────────────────────────
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

// ─── Available icons for picker ──────────────────────────────────────
const ICON_OPTIONS = [
  'FaGlobe','FaServer','FaFilm','FaTv','FaCity','FaHome','FaFolderOpen',
  'FaDownload','FaMagnet','FaNetworkWired','FaDatabase','FaPlay','FaSatelliteDish',
  'FaArchive','FaBroadcastTower','FaWifi','FaHdd','FaDesktop','FaSync',
  'MdLiveTv','MdLocalMovies','MdVideoLibrary','MdCloud','MdStorage','MdCast',
  'MdSportsCricket','SiNetflix','SiBittorrent','FaSearch','FaEye',
]

const CAT_COLORS = ['#00E5FF','#FF4C4C','#7B61FF','#FFD700','#00FF88','#FF6B35','#FF69B4','#00CED1']

// ─── Unique ID generator ─────────────────────────────────────────────
const uid = () => Math.random().toString(36).slice(2, 9)

// ─── Favorites localStorage helpers (favorites stay local, not in servers.js) ─
const LS_FAV = 'msp_favorites_v2'
const loadFavorites = () => { try { const d = localStorage.getItem(LS_FAV); return d ? JSON.parse(d) : [] } catch { return [] } }
const saveFavorites = (favs) => localStorage.setItem(LS_FAV, JSON.stringify(favs))

// ─── Toast ───────────────────────────────────────────────────────────
function useToast() {
  const [toast, setToast] = useState(null)
  const show = (msg, type = 'success') => {
    setToast({ msg, type, id: uid() })
    setTimeout(() => setToast(null), 2500)
  }
  return { toast, show }
}

function Toast({ toast }) {
  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          key={toast.id}
          initial={{ opacity: 0, y: 40, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          style={{
            position: 'fixed', bottom: 28, right: 28, zIndex: 9999,
            background: toast.type === 'error' ? 'rgba(255,50,50,0.15)' : 'rgba(0,229,255,0.12)',
            border: `1px solid ${toast.type === 'error' ? 'rgba(255,50,50,0.4)' : 'rgba(0,229,255,0.35)'}`,
            borderRadius: 14, padding: '11px 20px',
            color: toast.type === 'error' ? '#ff6b6b' : '#00E5FF',
            fontSize: 13, fontWeight: 600, backdropFilter: 'blur(12px)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
            display: 'flex', alignItems: 'center', gap: 10,
          }}
        >
          <Icon name={toast.type === 'error' ? 'FaShieldAlt' : 'FaCheck'} size={14} />
          {toast.msg}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// ─── Save Status Indicator ────────────────────────────────────────────
function SaveStatus({ saving, apiAvailable }) {
  if (!apiAvailable) return (
    <span style={{ fontSize: 10, color: '#FF8C00', background: 'rgba(255,140,0,0.1)', padding: '3px 8px', borderRadius: 6, fontWeight: 700, letterSpacing: '0.06em' }}>
      ⚠ LOCAL ONLY
    </span>
  )
  if (saving) return (
    <span style={{ fontSize: 10, color: '#00E5FF', background: 'rgba(0,229,255,0.1)', padding: '3px 8px', borderRadius: 6, fontWeight: 700, letterSpacing: '0.06em' }}>
      💾 SAVING…
    </span>
  )
  return (
    <span style={{ fontSize: 10, color: '#00FF88', background: 'rgba(0,255,136,0.1)', padding: '3px 8px', borderRadius: 6, fontWeight: 700, letterSpacing: '0.06em' }}>
      ✓ SAVED TO FILE
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
          background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16,
        }}
      >
        <motion.div
          initial={{ scale: 0.88, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={e => e.stopPropagation()}
          style={{
            background: t.theme === 'dark'
              ? 'linear-gradient(135deg, #0d1f35 0%, #0a1628 100%)'
              : 'linear-gradient(135deg, #ffffff 0%, #f4f7fb 100%)',
            border: `1px solid ${t.theme === 'dark' ? 'rgba(0,229,255,0.2)' : 'rgba(0,0,0,0.08)'}`,
            borderRadius: 20, padding: 28, width: '100%', maxWidth: width,
            boxShadow: t.theme === 'dark'
              ? '0 30px 80px rgba(0,0,0,0.6), 0 0 40px rgba(0,229,255,0.08)'
              : '0 30px 80px rgba(0,0,0,0.12)',
            maxHeight: '90vh', overflowY: 'auto',
          }}
        >
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom: 22 }}>
            <h3 style={{ color: t.textBright, fontWeight: 800, fontSize: 17, margin: 0 }}>{title}</h3>
            <button onClick={onClose} style={{
              background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 10, padding: '6px 10px', cursor: 'pointer', color: '#aaa',
              display:'flex', alignItems:'center',
            }}>
              <FaTimes size={14}/>
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
      <label style={{ display:'block', fontSize: 11, fontWeight: 700, color: '#888', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom: 7 }}>
        {label}{required && <span style={{ color:'#ff4c4c', marginLeft:3 }}>*</span>}
      </label>
      <input
        type={type} value={value} onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width:'100%', padding:'10px 14px', borderRadius:12, fontSize:13,
          background: t.inputBg, border:'1px solid rgba(0,229,255,0.15)',
          color: t.textBright, outline:'none', boxSizing:'border-box',
          fontFamily:'inherit',
        }}
        onFocus={e=>e.target.style.border='1px solid rgba(0,229,255,0.5)'}
        onBlur={e=>e.target.style.border='1px solid rgba(0,229,255,0.15)'}
      />
    </div>
  )
}

// ─── Icon Picker ──────────────────────────────────────────────────────
function IconPicker({ value, onChange }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display:'block', fontSize:11, fontWeight:700, color:'#888', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:7 }}>Icon</label>
      <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
        {ICON_OPTIONS.map(key => (
          <button key={key} type="button" onClick={() => onChange(key)} title={key}
            style={{
              width:36, height:36, borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center',
              background: value===key ? 'rgba(0,229,255,0.2)' : 'rgba(255,255,255,0.05)',
              border: value===key ? '1px solid rgba(0,229,255,0.6)' : '1px solid rgba(255,255,255,0.08)',
              cursor:'pointer', color: value===key ? '#00E5FF' : '#666',
            }}
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
      <label style={{ display:'block', fontSize:11, fontWeight:700, color:'#888', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:7 }}>Color</label>
      <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
        {CAT_COLORS.map(c => (
          <button key={c} type="button" onClick={() => onChange(c)}
            style={{
              width:28, height:28, borderRadius:8, background:c,
              border: value===c ? '2px solid #fff' : '2px solid transparent',
              cursor:'pointer', boxShadow: value===c ? `0 0 10px ${c}88` : 'none',
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
          background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.12)',
          color:'#aaa', cursor:'pointer',
        }}>Cancel</button>
        <button onClick={handleSave} disabled={!name.trim()||!url.trim()} style={{
          flex:2, padding:'11px 0', borderRadius:12, fontSize:13, fontWeight:700,
          background: (!name.trim()||!url.trim()) ? 'rgba(0,229,255,0.1)' : 'linear-gradient(135deg,#00E5FF,#7B61FF)',
          border:'none', color: (!name.trim()||!url.trim()) ? '#555' : '#fff',
          cursor: (!name.trim()||!url.trim()) ? 'not-allowed' : 'pointer',
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
          background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.12)',
          color:'#aaa', cursor:'pointer',
        }}>Cancel</button>
        <button onClick={handleSave} disabled={!name.trim()} style={{
          flex:2, padding:'11px 0', borderRadius:12, fontSize:13, fontWeight:700,
          background: !name.trim() ? 'rgba(0,229,255,0.1)' : 'linear-gradient(135deg,#00E5FF,#7B61FF)',
          border:'none', color: !name.trim() ? '#555' : '#fff',
          cursor: !name.trim() ? 'not-allowed' : 'pointer',
        }}>Save Category</button>
      </div>
    </Modal>
  )
}

// ─── Confirm Delete Modal ─────────────────────────────────────────────
function ConfirmModal({ open, onClose, onConfirm, message, t }) {
  return (
    <Modal open={open} onClose={onClose} title="Confirm Delete" width={380} t={t}>
      <p style={{ color:'#aaa', fontSize:14, marginBottom:22, lineHeight:1.6 }}>{message}</p>
      <div style={{ display:'flex', gap:10 }}>
        <button onClick={onClose} style={{
          flex:1, padding:'11px 0', borderRadius:12, fontSize:13, fontWeight:700,
          background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.12)',
          color:'#aaa', cursor:'pointer',
        }}>Cancel</button>
        <button onClick={onConfirm} style={{
          flex:1, padding:'11px 0', borderRadius:12, fontSize:13, fontWeight:700,
          background:'rgba(255,60,60,0.2)', border:'1px solid rgba(255,60,60,0.4)',
          color:'#ff6b6b', cursor:'pointer',
        }}>Delete</button>
      </div>
    </Modal>
  )
}

// ─── Action Button ────────────────────────────────────────────────────
function ActionBtn({ onClick, title, disabled, children }) {
  const [h, setH] = useState(false)
  return (
    <button
      onClick={disabled ? undefined : onClick}
      title={title}
      onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{
        width:26, height:26, borderRadius:8, border:'1px solid rgba(255,255,255,0.07)',
        background: h && !disabled ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.04)',
        cursor: disabled ? 'not-allowed' : 'pointer', display:'flex', alignItems:'center',
        justifyContent:'center', padding:0,
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
    if (isGuest) { showToast('Copy disabled — No Write Access (Guest)', 'error'); return }
    navigator.clipboard.writeText(server.url).then(() => {
      setCopied(true); showToast('URL copied!')
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const handleOpen = () => {
    if (isGuest) { showToast('Navigation disabled — No Write Access (Guest)', 'error'); return }
    window.open(server.url, '_blank', 'noopener,noreferrer')
  }

  const handleFav = (e) => {
    e.stopPropagation()
    if (isGuest) { showToast('Favorites disabled — No Write Access (Guest)', 'error'); return }
    onToggleFav(server)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={handleOpen}
      style={{
        background: hovered ? t.cardBgHover : t.cardBg,
        border: hovered ? `1px solid ${catColor}55` : `1px solid ${t.border}`,
        borderRadius: 16, padding: '16px 16px 14px',
        cursor: isGuest ? 'not-allowed' : 'pointer',
        transition: 'all .22s', position:'relative', overflow:'hidden',
        boxShadow: hovered ? `0 8px 30px rgba(0,0,0,0.3), 0 0 20px ${catColor}18` : 'none',
      }}
    >
      {hovered && !isGuest && (
        <div style={{
          position:'absolute', top:0, left:0, right:0, height:2,
          background:`linear-gradient(90deg, transparent, ${catColor}, transparent)`,
        }}/>
      )}

      <div style={{ display:'flex', alignItems:'flex-start', gap:12, marginBottom:10 }}>
        <div style={{
          width:38, height:38, borderRadius:11, flexShrink:0,
          background:`${catColor}18`, border:`1px solid ${catColor}33`,
          display:'flex', alignItems:'center', justifyContent:'center',
        }}>
          <Icon name={server.iconKey} size={18} color={catColor} />
        </div>
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ fontWeight:700, fontSize:13.5, color:t.textBright, marginBottom:3, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
            {server.name}
          </div>
          <div style={{ fontSize:10.5, color:t.textMuted, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
            {server.url}
          </div>
        </div>
      </div>

      <p style={{ fontSize:12, color:t.textMuted, lineHeight:1.5, marginBottom:12, minHeight:32,
        display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden' }}>
        {server.description}
      </p>

      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <span style={{
          fontSize:10, fontWeight:700, letterSpacing:'0.08em', textTransform:'uppercase',
          background:`${catColor}18`, color: catColor, padding:'3px 8px', borderRadius:6,
        }}>
          {server.tag}
        </span>
        <div style={{ display:'flex', gap:4 }} onClick={e => e.stopPropagation()}>
          <ActionBtn onClick={handleCopy} title={isGuest ? 'No Write Access (Guest)' : 'Copy URL'} disabled={isGuest}>
            {copied ? <FaCheck size={11} color="#00ff88"/> : <FaCopy size={11} color={isGuest?'#444':'#888'}/>}
          </ActionBtn>
          <ActionBtn onClick={handleFav} title={isGuest ? 'No Write Access (Guest)' : (isFav ? 'Unfavorite' : 'Favorite')} disabled={isGuest}>
            <FaStar size={11} color={isGuest ? '#444' : (isFav ? '#FFD700' : '#888')} style={isFav&&!isGuest?{filter:'drop-shadow(0 0 4px #FFD700)'}:{}}/>
          </ActionBtn>
          {!isGuest && (
            <ActionBtn onClick={() => onEdit(server)} title="Edit server">
              <FaEdit size={11} color="#888"/>
            </ActionBtn>
          )}
          {!isGuest && (
            <ActionBtn onClick={() => onDelete(server)} title="Delete server">
              <FaTrash size={11} color="#888"/>
            </ActionBtn>
          )}
          <ActionBtn onClick={handleOpen} title={isGuest ? 'No Write Access (Guest)' : 'Open link'} disabled={isGuest}>
            <FaExternalLinkAlt size={11} color={isGuest?'#444':'#888'}/>
          </ActionBtn>
        </div>
      </div>
    </motion.div>
  )
}

// ─── Category Section ─────────────────────────────────────────────────
function CategorySection({ category, isGuest, favorites, onToggleFav, onEditServer, onDeleteServer, onAddServer, onEditCategory, onDeleteCategory, showToast, t }) {
  return (
    <section style={{ marginBottom: 40 }}>
      <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:18, padding:'0 24px' }}>
        <div style={{
          width:38, height:38, borderRadius:12, display:'flex', alignItems:'center', justifyContent:'center',
          background:`${category.color}20`, border:`1px solid ${category.color}44`,
          boxShadow:`0 0 18px ${category.color}22`, flexShrink:0,
        }}>
          <Icon name={category.iconKey} size={18} color={category.color}/>
        </div>
        <div style={{ flex:1 }}>
          <h2 style={{ margin:0, fontSize:15, fontWeight:800, color:t.textBright }}>{category.name}</h2>
          <p style={{ margin:0, fontSize:11.5, color:t.textMuted }}>{category.description}</p>
        </div>
        <div style={{
          fontSize:11, fontWeight:700, padding:'3px 12px', borderRadius:20,
          background:`${category.color}15`, color:category.color,
        }}>
          {category.servers.length} servers
        </div>
        {!isGuest && (
          <div style={{ display:'flex', gap:6 }}>
            <ActionBtn onClick={() => onAddServer(category.id)} title="Add server">
              <FaPlus size={11} color="#00E5FF"/>
            </ActionBtn>
            <ActionBtn onClick={() => onEditCategory(category)} title="Edit category">
              <FaEdit size={11} color="#888"/>
            </ActionBtn>
            <ActionBtn onClick={() => onDeleteCategory(category)} title="Delete category">
              <FaTrash size={11} color="#888"/>
            </ActionBtn>
          </div>
        )}
      </div>
      <div style={{
        display:'grid', padding:'0 24px',
        gridTemplateColumns:'repeat(auto-fill, minmax(260px, 1fr))', gap:14,
      }}>
        {category.servers.map((srv) => (
          <ServerCard
            key={srv.id} server={srv} catColor={category.color}
            isGuest={isGuest} isFav={favorites.includes(srv.id)}
            onToggleFav={onToggleFav}
            onEdit={(s) => onEditServer(category.id, s)}
            onDelete={(s) => onDeleteServer(category.id, s)}
            showToast={showToast}
            t={t}
          />
        ))}
      </div>
    </section>
  )
}

// ─── Sidebar ──────────────────────────────────────────────────────────
function Sidebar({ categories, activeView, setActiveView, onLogout, isGuest, collapsed, setCollapsed, t }) {
  const navItem = (id, label, iconName, color) => {
    const active = activeView === id
    return (
      <button key={id} onClick={() => setActiveView(id)}
        style={{
          display:'flex', alignItems:'center', gap:10, width:'100%',
          padding: collapsed ? '10px 0' : '9px 14px',
          justifyContent: collapsed ? 'center' : 'flex-start',
          borderRadius:11, marginBottom:3, border:'none', cursor:'pointer',
          background: active ? `${color || '#00E5FF'}18` : 'transparent',
          color: active ? (color || '#00E5FF') : t.textMuted,
          borderLeft: active ? `2px solid ${color || '#00E5FF'}` : '2px solid transparent',
        }}
        title={collapsed ? label : ''}
      >
        <Icon name={iconName} size={15} color={active ? (color||'#00E5FF') : undefined}/>
        {!collapsed && <span style={{ fontSize:13, fontWeight:600 }}>{label}</span>}
      </button>
    )
  }

  return (
    <div style={{
      width: collapsed ? 54 : 220, flexShrink:0, height:'100vh',
      background: t.sidebarBg, borderRight:`1px solid ${t.border}`,
      display:'flex', flexDirection:'column', transition:'width .25s ease',
      backdropFilter:'blur(20px)', overflowX:'hidden', overflowY:'auto',
    }}>
      <div style={{
        padding: collapsed ? '18px 0' : '18px 16px', borderBottom:`1px solid ${t.border}`,
        display:'flex', alignItems:'center', gap:10, justifyContent: collapsed ? 'center' : 'flex-start',
      }}>
        <div style={{
          width:30, height:30, borderRadius:9, background:'linear-gradient(135deg,#00E5FF22,#7B61FF22)',
          border:'1px solid rgba(0,229,255,0.3)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0,
        }}>
          <FaServer size={14} color="#00E5FF"/>
        </div>
        {!collapsed && (
          <div>
            <div style={{ fontSize:12, fontWeight:900, background:'linear-gradient(90deg,#00E5FF,#7B61FF)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', letterSpacing:'0.05em' }}>MY SERVER</div>
            <div style={{ fontSize:9, color:t.textFaint, fontWeight:700, letterSpacing:'0.1em' }}>PORTAL v1.0</div>
          </div>
        )}
      </div>

      <div style={{ padding:'8px', borderBottom:`1px solid ${t.border}` }}>
        <button onClick={() => setCollapsed(!collapsed)}
          style={{
            width:'100%', padding:'7px 0', borderRadius:9, border:`1px solid ${t.border}`,
            background:'rgba(255,255,255,0.04)', color:t.textMuted, cursor:'pointer',
            display:'flex', alignItems:'center', justifyContent:'center',
          }}
        >
          <FaBars size={12}/>
        </button>
      </div>

      <div style={{ padding:'10px 8px', flex:1 }}>
        {!collapsed && <div style={{ fontSize:9, color:t.textFaint, fontWeight:800, letterSpacing:'0.15em', textTransform:'uppercase', margin:'4px 6px 8px' }}>Navigation</div>}
        {navItem('dashboard', 'Home', 'FaHome', '#00E5FF')}
        {navItem('search', 'Search', 'FaSearch', '#7B61FF')}
        {!isGuest && navItem('favorites', 'Favorites', 'FaStar', '#FFD700')}
        {navItem('recent', 'Recent', 'FaClock', '#00FF88')}

        {!collapsed && <div style={{ fontSize:9, color:t.textFaint, fontWeight:800, letterSpacing:'0.15em', textTransform:'uppercase', margin:'16px 6px 8px' }}>Categories</div>}
        {categories.map(cat => navItem(`cat_${cat.id}`, cat.name, cat.iconKey, cat.color))}
      </div>

      <div style={{ padding:'10px 8px', borderTop:`1px solid ${t.border}` }}>
        <button onClick={onLogout}
          style={{
            display:'flex', alignItems:'center', gap:9, width:'100%',
            padding: collapsed ? '10px 0' : '9px 14px',
            justifyContent: collapsed ? 'center' : 'flex-start',
            borderRadius:11, border:'none', cursor:'pointer',
            background:'rgba(255,60,60,0.07)', color:'#cc4444',
          }}
          title={collapsed ? 'Logout' : ''}
        >
          <FaSignOutAlt size={14}/>
          {!collapsed && <span style={{ fontSize:13, fontWeight:600 }}>Logout</span>}
        </button>
      </div>
    </div>
  )
}

// ─── Stats Bar ────────────────────────────────────────────────────────
function StatsBar({ categories, favCount, t }) {
  const total = categories.reduce((a, c) => a + c.servers.length, 0)
  const stats = [
    { label:'Categories', value: categories.length, icon:'FaFilter', color:'#7B61FF' },
    { label:'Total Servers', value: total, icon:'FaServer', color:'#00E5FF' },
    { label:'Favorites', value: favCount, icon:'FaStar', color:'#FFD700' },
  ]
  return (
    <div style={{ display:'flex', gap:14, padding:'0 24px 24px', flexWrap:'wrap' }}>
      {stats.map(s => (
        <div key={s.label} style={{
          flex:'1 1 140px', background:t.cardBg, border:`1px solid ${t.border}`,
          borderRadius:14, padding:'14px 18px', display:'flex', alignItems:'center', gap:12,
        }}>
          <div style={{ width:36, height:36, borderRadius:11, background:`${s.color}18`, border:`1px solid ${s.color}33`, display:'flex', alignItems:'center', justifyContent:'center' }}>
            <Icon name={s.icon} size={16} color={s.color}/>
          </div>
          <div>
            <div style={{ fontSize:20, fontWeight:900, color:t.textBright, lineHeight:1 }}>{s.value}</div>
            <div style={{ fontSize:11, color:t.textMuted, marginTop:2 }}>{s.label}</div>
          </div>
        </div>
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
      <div style={{ position:'relative', marginBottom:24, maxWidth:500 }}>
        <FaSearch size={15} color={t.textMuted} style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)' }}/>
        <input
          autoFocus value={query} onChange={e => setQuery(e.target.value)}
          placeholder="Search servers, tags, URLs..."
          style={{
            width:'100%', padding:'12px 14px 12px 42px', borderRadius:14, fontSize:14,
            background:t.inputBg, border:'1px solid rgba(0,229,255,0.2)',
            color:t.textBright, outline:'none', boxSizing:'border-box', fontFamily:'inherit',
          }}
        />
        {query && (
          <button onClick={() => setQuery('')} style={{ position:'absolute', right:12, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', color:t.textMuted, cursor:'pointer', padding:4 }}>
            <FaTimes size={13}/>
          </button>
        )}
      </div>
      {query.trim() === '' && (
        <div style={{ textAlign:'center', padding:'60px 0', color:t.textFaint }}>
          <FaSearch size={40} style={{ marginBottom:12, opacity:0.3 }}/>
          <p style={{ margin:0, fontSize:14 }}>Type to search across all servers</p>
        </div>
      )}
      {query.trim() !== '' && results.length === 0 && (
        <div style={{ textAlign:'center', padding:'60px 0', color:t.textFaint }}>
          <FaSearch size={40} style={{ marginBottom:12, opacity:0.3 }}/>
          <p style={{ margin:0, fontSize:14 }}>No results for "<span style={{color:'#00E5FF'}}>{query}</span>"</p>
        </div>
      )}
      {results.length > 0 && (
        <>
          <p style={{ color:t.textMuted, fontSize:12, marginBottom:16 }}>{results.length} result{results.length!==1?'s':''} found</p>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(260px,1fr))', gap:14 }}>
            {results.map(srv => (
              <ServerCard key={srv.id} server={srv} catColor={srv._catColor}
                isGuest={isGuest} isFav={favorites.includes(srv.id)}
                onToggleFav={onToggleFav}
                onEdit={(s) => onEditServer(srv._catId, s)}
                onDelete={(s) => onDeleteServer(srv._catId, s)}
                showToast={showToast} t={t}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

// ─── Favorites View ───────────────────────────────────────────────────
function FavoritesView({ categories, favorites, onToggleFav, onEditServer, onDeleteServer, showToast, isGuest, t }) {
  if (isGuest) return (
    <div style={{ textAlign:'center', padding:'80px 24px', color:t.textFaint }}>
      <FaLock size={44} style={{ marginBottom:14, opacity:0.2 }}/>
      <h3 style={{ margin:'0 0 8px', color:t.textMuted, fontWeight:700 }}>Favorites Unavailable</h3>
      <p style={{ margin:0, fontSize:13 }}>Favorites are disabled — No Write Access (Guest).</p>
    </div>
  )
  const favServers = categories.flatMap(c =>
    c.servers.filter(s => favorites.includes(s.id)).map(s => ({ ...s, _catColor: c.color, _catId: c.id }))
  )
  if (favServers.length === 0) return (
    <div style={{ textAlign:'center', padding:'80px 24px', color:t.textFaint }}>
      <FaStar size={44} style={{ marginBottom:14, opacity:0.2 }}/>
      <h3 style={{ margin:'0 0 8px', color:t.textMuted, fontWeight:700 }}>No Favorites Yet</h3>
      <p style={{ margin:0, fontSize:13 }}>Click ⭐ on any server card to save it here</p>
    </div>
  )
  return (
    <div style={{ padding:'24px' }}>
      <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:20 }}>
        <FaStar size={18} color="#FFD700" style={{ filter:'drop-shadow(0 0 6px #FFD700)' }}/>
        <h2 style={{ margin:0, fontSize:16, fontWeight:800, color:t.textBright }}>Favorites</h2>
        <span style={{ fontSize:13, color:t.textMuted }}>({favServers.length})</span>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(260px,1fr))', gap:14 }}>
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
      <FaClock size={44} style={{ marginBottom:14, opacity:0.2 }}/>
      <h3 style={{ margin:'0 0 8px', color:t.textMuted, fontWeight:700 }}>No Recent Activity</h3>
      <p style={{ margin:0, fontSize:13 }}>Servers you open will appear here</p>
    </div>
  )
  return (
    <div style={{ padding:'24px' }}>
      <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:20 }}>
        <FaClock size={18} color="#00E5FF"/>
        <h2 style={{ margin:0, fontSize:16, fontWeight:800, color:t.textBright }}>Recently Opened</h2>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(260px,1fr))', gap:14 }}>
        {recentServers.map(srv => (
          <ServerCard key={srv.id} server={srv} catColor={srv._catColor}
            isGuest={isGuest} isFav={favorites.includes(srv.id)}
            onToggleFav={onToggleFav}
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
      padding:'36px 24px 24px',
      background:'linear-gradient(180deg, rgba(0,229,255,0.04) 0%, transparent 100%)',
      borderBottom:`1px solid ${t.border}`, marginBottom:8,
    }}>
      <div style={{ display:'flex', alignItems:'center', gap:14, flexWrap:'wrap' }}>
        <div>
          <h1 style={{
            margin:0, fontSize:26, fontWeight:900, letterSpacing:'0.03em',
            background:'linear-gradient(90deg,#00E5FF,#7B61FF)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent',
          }}>
            MY SERVER PAGE
          </h1>
          <p style={{ margin:'6px 0 0', fontSize:13, color:t.textMuted }}>
            {isGuest
              ? 'Browsing as Guest · No Write Access — navigation and writes are disabled.'
              : 'Welcome back, Hasan. Full write access enabled.'}
          </p>
        </div>
        {!isGuest && (
          <div style={{ marginLeft:'auto' }}>
            <button onClick={onAddCategory}
              style={{
                display:'flex', alignItems:'center', gap:7, padding:'9px 16px', borderRadius:12,
                background:'linear-gradient(135deg,#00E5FF22,#7B61FF22)', border:'1px solid rgba(0,229,255,0.3)',
                color:'#00E5FF', fontWeight:700, fontSize:12, cursor:'pointer',
              }}
            >
              <FaPlus size={12}/> Add Category
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── User Badge ────────────────────────────────────────────────────────
function UserBadge({ isGuest, t }) {
  return (
    <div style={{
      display:'flex', alignItems:'center', gap:8, padding:'6px 12px', borderRadius:12,
      background: isGuest ? 'rgba(255,255,255,0.04)' : 'linear-gradient(135deg,rgba(0,229,255,0.12),rgba(123,97,255,0.12))',
      border: `1px solid ${isGuest ? t.border : 'rgba(0,229,255,0.28)'}`,
    }}>
      {isGuest ? <FaGhost size={13} color="#777"/> : <FaUser size={13} color="#00E5FF"/>}
      <span style={{ fontSize:12, fontWeight:700, color: isGuest ? t.textMuted : '#00E5FF', letterSpacing:'0.06em' }}>
        {isGuest ? 'Guest' : 'Hasan'}
      </span>
      {isGuest ? (
        <span style={{
          fontSize:9, fontWeight:600, color: t.textMuted, background:'rgba(255,255,255,0.05)',
          padding:'2px 6px', borderRadius:4, letterSpacing:'0.1em', textTransform:'uppercase',
          display:'flex', alignItems:'center', gap:4,
        }}>
          <LockIcon size={9}/> No Write Access
        </span>
      ) : (
        <span style={{
          fontSize:9, fontWeight:600, color:'#00E5FF', background:'rgba(0,229,255,0.1)',
          padding:'2px 6px', borderRadius:4, letterSpacing:'0.1em', textTransform:'uppercase',
        }}>Admin</span>
      )}
    </div>
  )
}

// ─── Guest Banner ─────────────────────────────────────────────────────
function GuestBanner() {
  return (
    <motion.div initial={{ opacity:0, y:-6 }} animate={{ opacity:1, y:0 }}
      style={{
        margin:'12px 24px 0', padding:'10px 16px', borderRadius:12,
        background:'rgba(255,120,0,0.06)', border:'1px solid rgba(255,120,0,0.2)',
        display:'flex', alignItems:'center', gap:10, fontSize:12.5, color:'#aaa',
      }}
    >
      <FaGhost size={14} color="#FF8C00" style={{ flexShrink:0 }}/>
      <span>
        Browsing as <strong style={{ color:'#FF8C00' }}>Guest · No Write Access</strong>.
        Copy, Favorite, Navigate and all write actions are disabled.
      </span>
    </motion.div>
  )
}

// ─── Theme Toggle ─────────────────────────────────────────────────────
function ThemeToggleBtn({ theme, toggleTheme }) {
  return (
    <button onClick={toggleTheme}
      title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Night Mode'}
      style={{
        display:'flex', alignItems:'center', gap:7, padding:'7px 10px', borderRadius:10,
        background: theme === 'dark' ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)',
        border: `1px solid ${theme === 'dark' ? 'rgba(0,229,255,0.18)' : 'rgba(0,0,0,0.08)'}`,
        color: theme === 'dark' ? '#00E5FF' : '#7B61FF',
        cursor:'pointer', fontSize:12,
      }}
    >
      {theme === 'dark' ? <Sun size={14}/> : <Moon size={14}/>}
    </button>
  )
}

// ═══════════════════════════════════════════════════════════════════════
// ─── MAIN DASHBOARD ───────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════
export default function Dashboard({ onLogout, role }) {
  const { theme, toggleTheme } = useTheme()
  const t = { ...THEMES[theme], theme }
  const isGuest = role === 'guest'

  // ── useServerData: loads categories from servers.js via local API,
  //    falls back to localStorage if API is offline (e.g. on Netlify). ──
  const { categories, setCategories, save, apiAvailable, saving } = useServerData()

  const [favorites, setFavorites] = useState(loadFavorites)
  const [recent, setRecent]       = useState([])
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

  // Favorites still save to localStorage (they are personal, not shared via servers.js)
  useEffect(() => saveFavorites(favorites), [favorites])

  // ── Helper: update state AND write to servers.js via local API ──────
  const updateAndSave = (newCats) => {
    setCategories(newCats)
    save(newCats) // → writes src/data/servers.js when npm run api is running
  }

  // ── Favorite toggle ──────────────────────────────────────────────────
  const handleToggleFav = (server) => {
    if (isGuest) return
    const isFav = favorites.includes(server.id)
    setFavorites(prev => isFav ? prev.filter(id => id !== server.id) : [server.id, ...prev])
    showToast(isFav ? 'Removed from favorites' : 'Added to favorites')
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
    showToast(apiAvailable ? `"${data.name}" added & saved to file!` : `"${data.name}" added (local only — start npm run api to save to file)`)
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
    showToast(apiAvailable ? 'Server deleted & saved to file' : 'Server deleted (local only)')
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
    showToast(apiAvailable ? 'Category deleted & saved to file' : 'Category deleted (local only)')
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
          <CategorySection category={cat} isGuest={isGuest} favorites={favorites}
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
        <div style={{ padding:'16px 0 0' }}>
          <StatsBar categories={categories} favCount={favorites.length} t={t}/>
        </div>
        <div style={{ paddingBottom:40 }}>
          {categories.map(cat => (
            <CategorySection key={cat.id} category={cat} isGuest={isGuest} favorites={favorites}
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
    <div style={{ display:'flex', height:'100vh', overflow:'hidden', background:t.bgPrimary, color:t.text, fontFamily:"'Inter','Segoe UI',sans-serif" }}>

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
          background:t.glassBg, backdropFilter:'blur(20px)',
          borderBottom:`1px solid ${t.border}`,
          padding:'10px 20px', display:'flex', alignItems:'center', justifyContent:'space-between', gap:12,
        }}>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <UserBadge isGuest={isGuest} t={t}/>
            <div style={{ width:1, height:16, background:t.border }}/>
            {/* Save status — only show for admin */}
            {!isGuest && <SaveStatus saving={saving} apiAvailable={apiAvailable}/>}
            <div style={{ width:1, height:16, background:t.border }}/>
            <nav style={{ display:'flex', alignItems:'center', gap:4, fontSize:11.5, color:t.textMuted }}>
              <span>Portal</span>
              <FaChevronRight size={8}/>
              <span style={{ color:'#00E5FF', fontWeight:600 }}>
                {activeView === 'dashboard' ? 'Home'
                  : activeView === 'search' ? 'Search'
                  : activeView === 'favorites' ? 'Favorites'
                  : activeView === 'recent' ? 'Recent'
                  : activeView.startsWith('cat_') ? (categories.find(c => c.id === activeView.replace('cat_',''))?.name || 'Category')
                  : activeView}
              </span>
            </nav>
          </div>

          <div style={{ display:'flex', gap:8, alignItems:'center' }}>
            <ThemeToggleBtn theme={theme} toggleTheme={toggleTheme}/>
            <button onClick={() => setActiveView('search')}
              style={{
                display:'flex', alignItems:'center', gap:7, padding:'7px 14px', borderRadius:10,
                background:'rgba(255,255,255,0.04)', border:`1px solid ${t.border}`,
                color:t.textMuted, cursor:'pointer', fontSize:12,
              }}
            >
              <FaSearch size={11}/> <span>Search</span>
            </button>
            {!isGuest && (
              <button onClick={() => setAddCatModal(true)}
                style={{
                  display:'flex', alignItems:'center', gap:7, padding:'7px 14px', borderRadius:10,
                  background:'rgba(0,229,255,0.08)', border:'1px solid rgba(0,229,255,0.2)',
                  color:'#00E5FF', cursor:'pointer', fontSize:12, fontWeight:600,
                }}
              >
                <FaPlus size={11}/> Category
              </button>
            )}
          </div>
        </div>

        {/* Guest Banner */}
        {isGuest && <GuestBanner/>}

        {/* Page Content */}
        <AnimatePresence mode="wait">
          <motion.div key={activeView}
            initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }}
            exit={{ opacity:0, y:-6 }} transition={{ duration:0.2 }}
            style={{ flex:1 }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>

        {/* Footer */}
        <footer style={{ padding:'24px', textAlign:'center', borderTop:`1px solid ${t.border}`, marginTop:'auto' }}>
          <div style={{ fontSize:12, fontWeight:900, background:'linear-gradient(90deg,#00E5FF,#7B61FF)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', letterSpacing:'0.1em', marginBottom:4 }}>
            MY SERVER PAGE
          </div>
          <div style={{ fontSize:11, color:t.textFaint }}>
            Created by <span style={{ color:'#00E5FF' }}>Hasan</span> · v1.0.0 · © 2026 · FIFA 2026 Inspired
          </div>
        </footer>
      </main>

      {/* ── Modals ── */}
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
    </div>
  )
}