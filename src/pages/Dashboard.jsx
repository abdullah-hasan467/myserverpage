import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

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

// ─── Initial Data ────────────────────────────────────────────────────
const INITIAL_CATEGORIES = [
  {
    id: 'fiber', name: 'Fiber@Home', iconKey: 'FaHome', color: '#00E5FF',
    description: 'Local ISP network servers and resources',
    servers: [
      { id: 'f1',  name: 'Main Portal',     url: 'http://172.19.178.180',                               description: 'Fiber@Home main access portal',      iconKey: 'FaGlobe',    tag: 'Portal'        },
      { id: 'f2',  name: 'Jhongkar FTP',    url: 'https://www.jhongkar.live/#next-section1',            description: 'JHIT FTP server with media content',  iconKey: 'FaFolderOpen', tag: 'FTP'         },
      { id: 'f3',  name: 'IPTV IDN',        url: 'http://iptvidn.com/',                                 description: 'IPTV Indonesia streaming platform',    iconKey: 'MdLiveTv',   tag: 'IPTV'          },
      { id: 'f4',  name: 'Movie Mazic',     url: 'http://moviemazic.xyz/',                              description: 'Movie streaming and download portal',  iconKey: 'FaFilm',     tag: 'Movies'        },
      { id: 'f5',  name: 'SkyView TimePass',url: 'http://timepassbd.live/',                             description: 'SkyView entertainment portal',         iconKey: 'FaPlay',     tag: 'Entertainment' },
      { id: 'f6',  name: '11Plus Live',     url: 'http://11plus.live/',                                 description: 'Live TV and streaming service',        iconKey: 'FaSatelliteDish', tag: 'Live TV'  },
      { id: 'f7',  name: 'BTSL FTP',        url: 'http://103.109.213.254/',                             description: 'BTSL FTP server access',               iconKey: 'FaDatabase', tag: 'FTP'           },
      { id: 'f8',  name: 'New FTP',         url: 'http://172.17.17.10/',                                description: 'New FTP server on local network',      iconKey: 'FaHdd',      tag: 'FTP'           },
      { id: 'f9',  name: 'Local Server 1',  url: 'http://172.16.50.4/',                                 description: 'Local network server 172.16.50.4',     iconKey: 'FaDesktop',  tag: 'Local'         },
      { id: 'f10', name: 'Circle FTP',      url: 'http://circleftp.net/',                               description: 'Circle FTP media server',              iconKey: 'FaSync',     tag: 'FTP'           },
    ]
  },
  {
    id: 'torrents', name: 'Torrents', iconKey: 'SiBittorrent', color: '#FF4C4C',
    description: 'Torrent indexers, trackers and download portals',
    servers: [
      { id: 't1', name: 'YTS Official',   url: 'https://www12.yts-official.to/',         description: 'High quality movies in small file size',      iconKey: 'FaFilm',     tag: 'Movies'  },
      { id: 't2', name: 'TorrentBD',      url: 'https://www.torrentbd.net/',             description: 'Bangladeshi torrent tracker & community',     iconKey: 'FaMagnet',   tag: 'BD'      },
      { id: 't3', name: 'RARBG Official', url: 'https://rarbg-official.is/',             description: 'Movies, TV, games & software',                iconKey: 'FaMagnet',   tag: 'Tracker' },
      { id: 't5', name: 'RARBG Movies',   url: 'https://en.rarbg-official.is/movies?',  description: 'RARBG Official movies category',              iconKey: 'MdLocalMovies', tag: 'Movies'},
      { id: 't6', name: '1337x',          url: 'https://www.1337x.tw/',                  description: 'Popular torrent search engine & index',       iconKey: 'FaSearch',   tag: 'Index'   },
      { id: 't7', name: 'The Pirate Bay', url: 'https://thepiratebay.org/index.html',    description: "World's most resilient tracker",              iconKey: 'FaMagnet',   tag: 'Tracker' },
      { id: 't8', name: 'CHD4',           url: 'https://www.chd4.com/index.php',         description: 'HD movie torrents and releases',              iconKey: 'FaDownload', tag: 'HD'      },
      { id: 't9', name: 'MoviezMad',      url: 'https://www.moviezmad.live/',            description: 'Bollywood, Hollywood & dubbed movies',        iconKey: 'FaFilm',     tag: 'Movies'  },
    ]
  },
  {
    id: 'dflix', name: 'Dflix Servers', iconKey: 'SiNetflix', color: '#7B61FF',
    description: 'Dflix media streaming ecosystem',
    servers: [
      { id: 'd1', name: 'Dflix Home',    url: 'http://stream.dflix.live:8096/web/index.html#!/home?tab=favorites', description: 'Dflix main streaming portal', iconKey: 'SiNetflix',    tag: 'Streaming' },
      { id: 'd2', name: 'Dflix CDN',     url: 'http://cdn.dflix.live:5050/',                                       description: 'Dflix CDN content delivery',  iconKey: 'MdCloud',      tag: 'CDN'       },
      { id: 'd3', name: 'Dflix K-Drama', url: "http://cdn.dflix.live:5050/TV%20Series%20Dubbed/",                  description: "K-Drama series collection",   iconKey: 'MdVideoLibrary', tag: 'K-Drama'  },
    ]
  },
  {
    id: 'livetv', name: 'Live TV', iconKey: 'MdLiveTv', color: '#FFD700',
    description: 'Live television and sports streaming',
    servers: [
      { id: 'l1', name: 'Amar TV',       url: 'https://amartv.xyz/',              description: 'Amar TV live streaming portal', iconKey: 'FaTv',             tag: 'Live TV' },
      { id: 'l2', name: 'BDIX TV',       url: 'https://bdixtv.serverbd247.com/',  description: 'BDIX live television service',  iconKey: 'FaBroadcastTower', tag: 'BD TV'   },
      { id: 'l3', name: 'IPTV IDN',      url: 'http://iptvidn.com/',              description: 'IPTV streaming platform',       iconKey: 'FaWifi',           tag: 'IPTV'    },
      { id: 'l4', name: 'Touch Cricket', url: 'https://touchcricket.live/',       description: 'Live cricket streaming',        iconKey: 'MdSportsCricket',  tag: 'Sports'  },
      { id: 'l5', name: 'WebCric',       url: 'https://go.webcric.com/',          description: 'WebCric live cricket portal',   iconKey: 'MdSportsCricket',  tag: 'Cricket' },
      { id: 'l6', name: 'ALL TV',        url: 'https://bonobo.live/',             description: 'All TV Channel',               iconKey: 'MdCast',           tag: 'TV'      },
    ]
  },
  {
    id: 'sherpur', name: 'Sherpur Servers', iconKey: 'FaCity', color: '#00FF88',
    description: 'Sherpur regional server network',
    servers: [
      { id: 's1', name: 'CTG Hall',          url: 'https://ctghall.com/',                          description: 'Chittagong Hall content server',  iconKey: 'FaServer',   tag: 'Regional'      },
      { id: 's2', name: 'Crazy CTG',         url: 'https://crazyctg.com/',                         description: 'Crazy CTG entertainment portal',  iconKey: 'FaPlay',     tag: 'Entertainment' },
      { id: 's3', name: 'CTG Movies',        url: 'https://ctgmovies.com/',                        description: 'Chittagong movies server',         iconKey: 'FaFilm',     tag: 'Movies'        },
      { id: 's4', name: 'Local WE 1',        url: 'http://172.20.2.5/we/',                         description: 'Local network server WE',          iconKey: 'FaDesktop',  tag: 'Local'         },
      { id: 's5', name: 'BDIX TV WE',        url: 'http://bdixtv.live/we/',                        description: 'BDIX TV local network access',     iconKey: 'FaTv',       tag: 'Local'         },
      { id: 's6', name: 'Discovery FTP',     url: 'https://discoveryftp.net/',                     description: 'Discovery FTP content server',     iconKey: 'FaFolderOpen', tag: 'FTP'         },
      { id: 's7', name: 'Local Server 2',    url: 'http://172.16.50.4/',                           description: 'Local network server access',      iconKey: 'FaNetworkWired', tag: 'Local'     },
      { id: 's8', name: 'Local Server 3',    url: 'http://172.27.27.84/',                          description: 'Local network server',             iconKey: 'FaServer',   tag: 'Local'         },
      { id: 's9', name: 'BCN Communication', url: 'https://www.bcncommunication.net/ftp-services', description: 'BCN Communication FTP services',   iconKey: 'FaSatelliteDish', tag: 'FTP'      },
    ]
  },
  {
    id: 'universal', name: 'Universal FTP', iconKey: 'FaGlobe', color: '#FF6B35',
    description: 'Universal FTP and streaming resources',
    servers: [
      { id: 'u1',  name: 'New Circle FTP',  url: 'http://new.circleftp.net/',         description: 'New Circle FTP server',             iconKey: 'FaSync',     tag: 'FTP'       },
      { id: 'u2',  name: 'FreeDrive Movie', url: 'https://freedrivemovie.cfd/',       description: 'Free movie drive collection',        iconKey: 'FaFilm',     tag: 'Movies'    },
      { id: 'u3',  name: 'MLS BD',          url: 'https://mlsbd.co/',                 description: 'MLS BD content server',             iconKey: 'FaFolderOpen', tag: 'FTP'     },
      { id: 'u4',  name: 'Fojik',           url: 'https://fojik.com/',                description: 'Fojik media platform',              iconKey: 'FaPlay',     tag: 'Media'     },
      { id: 'u5',  name: 'FlixMet',         url: 'https://flixmet.net/',              description: 'FlixMet streaming service',          iconKey: 'FaPlay',     tag: 'Streaming' },
      { id: 'u6',  name: '11Plus Live',     url: 'https://11plus.live/',              description: 'Live streaming portal',             iconKey: 'FaSatelliteDish', tag: 'Live'},
      { id: 'u7',  name: 'Internet Archive',url: 'https://archive.org/',              description: 'The Internet Archive & wayback',    iconKey: 'FaArchive',  tag: 'Archive'   },
      { id: 'u8',  name: 'FTP Server BD',   url: 'http://ftpserver.com.bd/live-tv-2/',description: 'Bangladesh FTP server live TV',     iconKey: 'FaHdd',      tag: 'FTP'       },
      { id: 'u9',  name: 'HiCine',          url: 'https://hicine.app/',               description: 'HiCine movie streaming app',        iconKey: 'FaFilm',     tag: 'Streaming' },
      { id: 'u10', name: 'Hurawatch',       url: 'https://hurawatchzz.tv/home',       description: 'Hurawatch anime & movies',          iconKey: 'FaEye',      tag: 'Anime'     },
      { id: 'u11', name: '9Anime TV',       url: 'https://9animetv.to/',              description: '9Anime — HD anime streaming',       iconKey: 'FaTv',       tag: 'Anime'     },
      { id: 'u12', name: 'MyDex TV',        url: 'https://watch.mydex.tv/',           description: 'MyDex TV streaming platform',       iconKey: 'MdCast',     tag: 'TV'        },
    ]
  },
]

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

// ─── LocalStorage helpers ────────────────────────────────────────────
const LS_KEY = 'msp_data_v2'
const LS_FAV  = 'msp_favorites_v2'
const loadCategories = () => {
  try { const d = localStorage.getItem(LS_KEY); return d ? JSON.parse(d) : INITIAL_CATEGORIES } catch { return INITIAL_CATEGORIES }
}
const saveCategories = (cats) => localStorage.setItem(LS_KEY, JSON.stringify(cats))
const loadFavorites  = () => { try { const d = localStorage.getItem(LS_FAV); return d ? JSON.parse(d) : [] } catch { return [] } }
const saveFavorites  = (favs) => localStorage.setItem(LS_FAV, JSON.stringify(favs))

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

// ─── Modal Base ───────────────────────────────────────────────────────
function Modal({ open, onClose, title, children, width = 480 }) {
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
            background: 'linear-gradient(135deg, #0d1f35 0%, #0a1628 100%)',
            border: '1px solid rgba(0,229,255,0.2)',
            borderRadius: 20, padding: 28, width: '100%', maxWidth: width,
            boxShadow: '0 30px 80px rgba(0,0,0,0.6), 0 0 40px rgba(0,229,255,0.08)',
            maxHeight: '90vh', overflowY: 'auto',
          }}
        >
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom: 22 }}>
            <h3 style={{ color: '#fff', fontWeight: 800, fontSize: 17, margin: 0 }}>{title}</h3>
            <button onClick={onClose} style={{
              background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 10, padding: '6px 10px', cursor: 'pointer', color: '#aaa',
              display:'flex', alignItems:'center', transition:'all .2s',
            }} onMouseEnter={e=>e.currentTarget.style.color='#fff'} onMouseLeave={e=>e.currentTarget.style.color='#aaa'}>
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
function FormInput({ label, value, onChange, placeholder, type = 'text', required }) {
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
          background:'rgba(255,255,255,0.05)', border:'1px solid rgba(0,229,255,0.15)',
          color:'#fff', outline:'none', boxSizing:'border-box', transition:'border .2s',
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
          <button
            key={key} type="button" onClick={() => onChange(key)}
            title={key}
            style={{
              width:36, height:36, borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center',
              background: value===key ? 'rgba(0,229,255,0.2)' : 'rgba(255,255,255,0.05)',
              border: value===key ? '1px solid rgba(0,229,255,0.6)' : '1px solid rgba(255,255,255,0.08)',
              cursor:'pointer', color: value===key ? '#00E5FF' : '#666', transition:'all .15s',
            }}
            onMouseEnter={e=>{if(value!==key){e.currentTarget.style.background='rgba(255,255,255,0.1)';e.currentTarget.style.color='#aaa'}}}
            onMouseLeave={e=>{if(value!==key){e.currentTarget.style.background='rgba(255,255,255,0.05)';e.currentTarget.style.color='#666'}}}
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
              width:28, height:28, borderRadius:8, background:c, border: value===c ? '2px solid #fff' : '2px solid transparent',
              cursor:'pointer', boxShadow: value===c ? `0 0 10px ${c}88` : 'none', transition:'all .15s',
            }}
          />
        ))}
      </div>
    </div>
  )
}

// ─── Add/Edit Server Modal ────────────────────────────────────────────
function ServerModal({ open, onClose, onSave, initial, title }) {
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
    <Modal open={open} onClose={onClose} title={title || 'Add Server'}>
      <FormInput label="Server Name" value={name} onChange={setName} placeholder="e.g. My FTP Server" required />
      <FormInput label="URL" value={url} onChange={setUrl} placeholder="https://example.com" required />
      <FormInput label="Description" value={desc} onChange={setDesc} placeholder="Short description..." />
      <FormInput label="Tag" value={tag} onChange={setTag} placeholder="FTP, Movies, TV..." />
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
          boxShadow: (!name.trim()||!url.trim()) ? 'none' : '0 0 20px rgba(0,229,255,0.3)',
        }}>Save Server</button>
      </div>
    </Modal>
  )
}

// ─── Add/Edit Category Modal ──────────────────────────────────────────
function CategoryModal({ open, onClose, onSave, initial, title }) {
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
    <Modal open={open} onClose={onClose} title={title || 'Add Category'}>
      <FormInput label="Category Name" value={name} onChange={setName} placeholder="e.g. My Servers" required />
      <FormInput label="Description" value={desc} onChange={setDesc} placeholder="Short description..." />
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
          boxShadow: !name.trim() ? 'none' : '0 0 20px rgba(0,229,255,0.3)',
        }}>Save Category</button>
      </div>
    </Modal>
  )
}

// ─── Confirm Delete Modal ─────────────────────────────────────────────
function ConfirmModal({ open, onClose, onConfirm, message }) {
  return (
    <Modal open={open} onClose={onClose} title="Confirm Delete" width={380}>
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

// ─── Server Card ──────────────────────────────────────────────────────
function ServerCard({ server, catColor, isGuest, isFav, onToggleFav, onEdit, onDelete, showToast }) {
  const [hovered, setHovered] = useState(false)
  const [copied, setCopied]   = useState(false)

  const handleCopy = (e) => {
    e.stopPropagation()
    if (isGuest) { showToast('Copy disabled in Guest mode', 'error'); return }
    navigator.clipboard.writeText(server.url).then(() => {
      setCopied(true); showToast('URL copied!');
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const handleOpen = () => {
    if (isGuest) { showToast('Navigation disabled in Guest mode', 'error'); return }
    window.open(server.url, '_blank', 'noopener,noreferrer')
  }

  const handleFav = (e) => {
    e.stopPropagation()
    if (isGuest) { showToast('Favorites disabled in Guest mode', 'error'); return }
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
        background: hovered ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.03)',
        border: hovered ? `1px solid ${catColor}55` : '1px solid rgba(255,255,255,0.07)',
        borderRadius: 16, padding: '16px 16px 14px',
        cursor: isGuest ? 'not-allowed' : 'pointer',
        transition: 'all .22s', position:'relative', overflow:'hidden',
        boxShadow: hovered ? `0 8px 30px rgba(0,0,0,0.3), 0 0 20px ${catColor}18` : 'none',
      }}
    >
      {/* Glow edge */}
      {hovered && !isGuest && (
        <div style={{
          position:'absolute', top:0, left:0, right:0, height:2,
          background:`linear-gradient(90deg, transparent, ${catColor}, transparent)`,
          borderRadius:'16px 16px 0 0',
        }}/>
      )}

      {/* Header row */}
      <div style={{ display:'flex', alignItems:'flex-start', gap:12, marginBottom:10 }}>
        <div style={{
          width:38, height:38, borderRadius:11, flexShrink:0,
          background:`${catColor}18`, border:`1px solid ${catColor}33`,
          display:'flex', alignItems:'center', justifyContent:'center',
        }}>
          <Icon name={server.iconKey} size={18} color={catColor} />
        </div>
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ fontWeight:700, fontSize:13.5, color:'#f0f0f0', marginBottom:3, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
            {server.name}
          </div>
          <div style={{ fontSize:10.5, color:'#555', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
            {server.url}
          </div>
        </div>
      </div>

      {/* Description */}
      <p style={{ fontSize:12, color:'#666', lineHeight:1.5, marginBottom:12, minHeight:32,
        display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden' }}>
        {server.description}
      </p>

      {/* Footer row */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <span style={{
          fontSize:10, fontWeight:700, letterSpacing:'0.08em', textTransform:'uppercase',
          background:`${catColor}18`, color: catColor, padding:'3px 8px', borderRadius:6,
        }}>
          {server.tag}
        </span>

        <div style={{ display:'flex', gap:4 }} onClick={e => e.stopPropagation()}>
          {/* Copy */}
          <ActionBtn onClick={handleCopy} title={isGuest ? 'Disabled in Guest mode' : 'Copy URL'} disabled={isGuest}>
            {copied ? <FaCheck size={11} color="#00ff88"/> : <FaCopy size={11} color={isGuest?'#444':'#888'}/>}
          </ActionBtn>
          {/* Favorite */}
          <ActionBtn onClick={handleFav} title={isGuest ? 'Disabled in Guest mode' : (isFav ? 'Unfavorite' : 'Favorite')} disabled={isGuest}>
            <FaStar size={11} color={isGuest ? '#444' : (isFav ? '#FFD700' : '#888')} style={isFav&&!isGuest?{filter:'drop-shadow(0 0 4px #FFD700)'}:{}}/>
          </ActionBtn>
          {/* Edit — Hasan only */}
          {!isGuest && (
            <ActionBtn onClick={() => onEdit(server)} title="Edit server">
              <FaEdit size={11} color="#888"/>
            </ActionBtn>
          )}
          {/* Delete — Hasan only */}
          {!isGuest && (
            <ActionBtn onClick={() => onDelete(server)} title="Delete server">
              <FaTrash size={11} color="#888"/>
            </ActionBtn>
          )}
          {/* Open link */}
          <ActionBtn onClick={handleOpen} title={isGuest ? 'Disabled in Guest mode' : 'Open link'} disabled={isGuest}>
            <FaExternalLinkAlt size={11} color={isGuest?'#444':'#888'}/>
          </ActionBtn>
        </div>
      </div>
    </motion.div>
  )
}

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
        justifyContent:'center', transition:'all .15s', padding:0,
      }}
    >
      {children}
    </button>
  )
}

// ─── Category Section ─────────────────────────────────────────────────
function CategorySection({ category, isGuest, favorites, onToggleFav, onEditServer, onDeleteServer, onAddServer, onEditCategory, onDeleteCategory, showToast }) {
  return (
    <section style={{ marginBottom: 40 }}>
      {/* Header */}
      <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:18, padding:'0 24px' }}>
        <div style={{
          width:38, height:38, borderRadius:12, display:'flex', alignItems:'center', justifyContent:'center',
          background:`${category.color}20`, border:`1px solid ${category.color}44`,
          boxShadow:`0 0 18px ${category.color}22`, flexShrink:0,
        }}>
          <Icon name={category.iconKey} size={18} color={category.color}/>
        </div>
        <div style={{ flex:1 }}>
          <h2 style={{ margin:0, fontSize:15, fontWeight:800, color:'#f0f0f0' }}>{category.name}</h2>
          <p style={{ margin:0, fontSize:11.5, color:'#555' }}>{category.description}</p>
        </div>
        <div style={{
          fontSize:11, fontWeight:700, padding:'3px 12px', borderRadius:20,
          background:`${category.color}15`, color:category.color,
        }}>
          {category.servers.length} servers
        </div>
        {/* Hasan admin actions */}
        {!isGuest && (
          <div style={{ display:'flex', gap:6 }}>
            <ActionBtn onClick={() => onAddServer(category.id)} title="Add server to this category">
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

      {/* Server grid */}
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
          />
        ))}
      </div>
    </section>
  )
}

// ─── Sidebar ──────────────────────────────────────────────────────────
function Sidebar({ categories, activeView, setActiveView, onLogout, isGuest, collapsed, setCollapsed }) {
  const navItem = (id, label, iconName, color) => {
    const active = activeView === id
    return (
      <button
        key={id}
        onClick={() => setActiveView(id)}
        style={{
          display:'flex', alignItems:'center', gap:10, width:'100%',
          padding: collapsed ? '10px 0' : '9px 14px',
          justifyContent: collapsed ? 'center' : 'flex-start',
          borderRadius:11, marginBottom:3, border:'none', cursor:'pointer', transition:'all .18s',
          background: active ? `${color || '#00E5FF'}18` : 'transparent',
          color: active ? (color || '#00E5FF') : '#666',
          borderLeft: active ? `2px solid ${color || '#00E5FF'}` : '2px solid transparent',
        }}
        onMouseEnter={e=>{ if(!active){ e.currentTarget.style.background='rgba(255,255,255,0.05)'; e.currentTarget.style.color='#bbb' }}}
        onMouseLeave={e=>{ if(!active){ e.currentTarget.style.background='transparent'; e.currentTarget.style.color='#666' }}}
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
      background:'rgba(6,14,26,0.98)', borderRight:'1px solid rgba(0,229,255,0.08)',
      display:'flex', flexDirection:'column', transition:'width .25s ease',
      backdropFilter:'blur(20px)', overflowX:'hidden', overflowY:'auto',
    }}>
      {/* Logo */}
      <div style={{
        padding: collapsed ? '18px 0' : '18px 16px', borderBottom:'1px solid rgba(255,255,255,0.05)',
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
            <div style={{ fontSize:9, color:'#444', fontWeight:700, letterSpacing:'0.1em' }}>PORTAL v1.0</div>
          </div>
        )}
      </div>

      {/* Collapse toggle */}
      <div style={{ padding:'8px', borderBottom:'1px solid rgba(255,255,255,0.04)' }}>
        <button
          onClick={() => setCollapsed(!collapsed)}
          style={{
            width:'100%', padding:'7px 0', borderRadius:9, border:'1px solid rgba(255,255,255,0.07)',
            background:'rgba(255,255,255,0.04)', color:'#555', cursor:'pointer', transition:'all .2s',
            display:'flex', alignItems:'center', justifyContent:'center',
          }}
          onMouseEnter={e=>{e.currentTarget.style.color='#aaa';e.currentTarget.style.background='rgba(255,255,255,0.08)'}}
          onMouseLeave={e=>{e.currentTarget.style.color='#555';e.currentTarget.style.background='rgba(255,255,255,0.04)'}}
        >
          <FaBars size={12}/>
        </button>
      </div>

      {/* Nav */}
      <div style={{ padding:'10px 8px', flex:1 }}>
        {!collapsed && <div style={{ fontSize:9, color:'#333', fontWeight:800, letterSpacing:'0.15em', textTransform:'uppercase', margin:'4px 6px 8px' }}>Navigation</div>}
        {navItem('dashboard', 'Home', 'FaHome', '#00E5FF')}
        {navItem('search', 'Search', 'FaSearch', '#7B61FF')}
        {!isGuest && navItem('favorites', 'Favorites', 'FaStar', '#FFD700')}
        {navItem('recent', 'Recent', 'FaClock', '#00FF88')}

        {!collapsed && <div style={{ fontSize:9, color:'#333', fontWeight:800, letterSpacing:'0.15em', textTransform:'uppercase', margin:'16px 6px 8px' }}>Categories</div>}
        {categories.map(cat => navItem(`cat_${cat.id}`, cat.name, cat.iconKey, cat.color))}
      </div>

      {/* Logout */}
      <div style={{ padding:'10px 8px', borderTop:'1px solid rgba(255,255,255,0.05)' }}>
        <button
          onClick={onLogout}
          style={{
            display:'flex', alignItems:'center', gap:9, width:'100%',
            padding: collapsed ? '10px 0' : '9px 14px',
            justifyContent: collapsed ? 'center' : 'flex-start',
            borderRadius:11, border:'none', cursor:'pointer',
            background:'rgba(255,60,60,0.07)', color:'#cc4444', transition:'all .2s',
          }}
          title={collapsed ? 'Logout' : ''}
          onMouseEnter={e=>{e.currentTarget.style.background='rgba(255,60,60,0.15)';e.currentTarget.style.color='#ff6b6b'}}
          onMouseLeave={e=>{e.currentTarget.style.background='rgba(255,60,60,0.07)';e.currentTarget.style.color='#cc4444'}}
        >
          <FaSignOutAlt size={14}/>
          {!collapsed && <span style={{ fontSize:13, fontWeight:600 }}>Logout</span>}
        </button>
      </div>
    </div>
  )
}

// ─── Stats Bar ────────────────────────────────────────────────────────
function StatsBar({ categories, favCount }) {
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
          flex:'1 1 140px', background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)',
          borderRadius:14, padding:'14px 18px', display:'flex', alignItems:'center', gap:12,
        }}>
          <div style={{ width:36, height:36, borderRadius:11, background:`${s.color}18`, border:`1px solid ${s.color}33`, display:'flex', alignItems:'center', justifyContent:'center' }}>
            <Icon name={s.icon} size={16} color={s.color}/>
          </div>
          <div>
            <div style={{ fontSize:20, fontWeight:900, color:'#f0f0f0', lineHeight:1 }}>{s.value}</div>
            <div style={{ fontSize:11, color:'#555', marginTop:2 }}>{s.label}</div>
          </div>
        </div>
      ))}
    </div>
  )
}

// ─── Search View ──────────────────────────────────────────────────────
function SearchView({ categories, isGuest, favorites, onToggleFav, onEditServer, onDeleteServer, showToast }) {
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
      {/* Search box */}
      <div style={{ position:'relative', marginBottom:24, maxWidth:500 }}>
        <FaSearch size={15} color="#555" style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)' }}/>
        <input
          autoFocus
          value={query} onChange={e => setQuery(e.target.value)}
          placeholder="Search servers, tags, URLs..."
          style={{
            width:'100%', padding:'12px 14px 12px 42px', borderRadius:14, fontSize:14,
            background:'rgba(255,255,255,0.05)', border:'1px solid rgba(0,229,255,0.2)',
            color:'#fff', outline:'none', boxSizing:'border-box', fontFamily:'inherit',
          }}
          onFocus={e=>e.target.style.border='1px solid rgba(0,229,255,0.5)'}
          onBlur={e=>e.target.style.border='1px solid rgba(0,229,255,0.2)'}
        />
        {query && (
          <button onClick={() => setQuery('')} style={{ position:'absolute', right:12, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', color:'#555', cursor:'pointer', padding:4 }}>
            <FaTimes size={13}/>
          </button>
        )}
      </div>

      {query.trim() === '' && (
        <div style={{ textAlign:'center', padding:'60px 0', color:'#444' }}>
          <FaSearch size={40} style={{ marginBottom:12, opacity:0.3 }}/>
          <p style={{ margin:0, fontSize:14 }}>Type to search across all servers</p>
        </div>
      )}

      {query.trim() !== '' && results.length === 0 && (
        <div style={{ textAlign:'center', padding:'60px 0', color:'#444' }}>
          <FaSearch size={40} style={{ marginBottom:12, opacity:0.3 }}/>
          <p style={{ margin:0, fontSize:14 }}>No results for "<span style={{color:'#00E5FF'}}>{query}</span>"</p>
        </div>
      )}

      {results.length > 0 && (
        <>
          <p style={{ color:'#555', fontSize:12, marginBottom:16 }}>{results.length} result{results.length!==1?'s':''} found</p>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(260px,1fr))', gap:14 }}>
            {results.map(srv => (
              <ServerCard
                key={srv.id} server={srv} catColor={srv._catColor}
                isGuest={isGuest} isFav={favorites.includes(srv.id)}
                onToggleFav={onToggleFav}
                onEdit={(s) => onEditServer(srv._catId, s)}
                onDelete={(s) => onDeleteServer(srv._catId, s)}
                showToast={showToast}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

// ─── Favorites View ───────────────────────────────────────────────────
function FavoritesView({ categories, favorites, onToggleFav, onEditServer, onDeleteServer, showToast, isGuest }) {
  if (isGuest) return (
    <div style={{ textAlign:'center', padding:'80px 24px', color:'#444' }}>
      <FaLock size={44} style={{ marginBottom:14, opacity:0.2 }}/>
      <h3 style={{ margin:'0 0 8px', color:'#555', fontWeight:700 }}>Favorites Unavailable</h3>
      <p style={{ margin:0, fontSize:13 }}>Favorites are disabled in Guest mode.</p>
    </div>
  )

  const favServers = categories.flatMap(c =>
    c.servers.filter(s => favorites.includes(s.id)).map(s => ({ ...s, _catColor: c.color, _catId: c.id }))
  )

  if (favServers.length === 0) return (
    <div style={{ textAlign:'center', padding:'80px 24px', color:'#444' }}>
      <FaStar size={44} style={{ marginBottom:14, opacity:0.2 }}/>
      <h3 style={{ margin:'0 0 8px', color:'#555', fontWeight:700 }}>No Favorites Yet</h3>
      <p style={{ margin:0, fontSize:13 }}>Click ⭐ on any server card to save it here</p>
    </div>
  )

  return (
    <div style={{ padding:'24px' }}>
      <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:20 }}>
        <FaStar size={18} color="#FFD700" style={{ filter:'drop-shadow(0 0 6px #FFD700)' }}/>
        <h2 style={{ margin:0, fontSize:16, fontWeight:800, color:'#f0f0f0' }}>Favorites</h2>
        <span style={{ fontSize:13, color:'#555' }}>({favServers.length})</span>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(260px,1fr))', gap:14 }}>
        {favServers.map(srv => (
          <ServerCard
            key={srv.id} server={srv} catColor={srv._catColor}
            isGuest={isGuest} isFav={true}
            onToggleFav={onToggleFav}
            onEdit={(s) => onEditServer(srv._catId, s)}
            onDelete={(s) => onDeleteServer(srv._catId, s)}
            showToast={showToast}
          />
        ))}
      </div>
    </div>
  )
}

// ─── Recent View ──────────────────────────────────────────────────────
function RecentView({ recent, categories, favorites, onToggleFav, onEditServer, onDeleteServer, showToast, isGuest }) {
  const recentServers = recent.map(id => {
    for (const c of categories) {
      const s = c.servers.find(x => x.id === id)
      if (s) return { ...s, _catColor: c.color, _catId: c.id }
    }
    return null
  }).filter(Boolean)

  if (recentServers.length === 0) return (
    <div style={{ textAlign:'center', padding:'80px 24px', color:'#444' }}>
      <FaClock size={44} style={{ marginBottom:14, opacity:0.2 }}/>
      <h3 style={{ margin:'0 0 8px', color:'#555', fontWeight:700 }}>No Recent Activity</h3>
      <p style={{ margin:0, fontSize:13 }}>Servers you open will appear here</p>
    </div>
  )

  return (
    <div style={{ padding:'24px' }}>
      <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:20 }}>
        <FaClock size={18} color="#00E5FF"/>
        <h2 style={{ margin:0, fontSize:16, fontWeight:800, color:'#f0f0f0' }}>Recently Opened</h2>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(260px,1fr))', gap:14 }}>
        {recentServers.map(srv => (
          <ServerCard
            key={srv.id} server={srv} catColor={srv._catColor}
            isGuest={isGuest} isFav={favorites.includes(srv.id)}
            onToggleFav={onToggleFav}
            onEdit={(s) => onEditServer(srv._catId, s)}
            onDelete={(s) => onDeleteServer(srv._catId, s)}
            showToast={showToast}
          />
        ))}
      </div>
    </div>
  )
}

// ─── Hero Section ─────────────────────────────────────────────────────
function HeroSection({ isGuest, onNav }) {
  return (
    <div style={{
      padding:'36px 24px 24px',
      background:'linear-gradient(180deg, rgba(0,229,255,0.04) 0%, transparent 100%)',
      borderBottom:'1px solid rgba(0,229,255,0.06)', marginBottom:8,
    }}>
      <div style={{ display:'flex', alignItems:'center', gap:14, flexWrap:'wrap' }}>
        <div>
          <h1 style={{
            margin:0, fontSize:26, fontWeight:900, letterSpacing:'0.03em',
            background:'linear-gradient(90deg,#00E5FF,#7B61FF)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent',
          }}>
            MY SERVER PAGE
          </h1>
          <p style={{ margin:'6px 0 0', fontSize:13, color:'#555' }}>
            {isGuest
              ? 'Browsing in Guest · Read Only mode — navigation and writes are disabled.'
              : 'Welcome back, Hasan. Full write access enabled.'}
          </p>
        </div>
        {!isGuest && (
          <div style={{ marginLeft:'auto', display:'flex', gap:8, flexWrap:'wrap' }}>
            <button
              onClick={() => onNav('add_category')}
              style={{
                display:'flex', alignItems:'center', gap:7, padding:'9px 16px', borderRadius:12,
                background:'linear-gradient(135deg,#00E5FF22,#7B61FF22)', border:'1px solid rgba(0,229,255,0.3)',
                color:'#00E5FF', fontWeight:700, fontSize:12, cursor:'pointer', letterSpacing:'0.04em',
                transition:'all .2s',
              }}
              onMouseEnter={e=>{e.currentTarget.style.background='linear-gradient(135deg,#00E5FF33,#7B61FF33)'}}
              onMouseLeave={e=>{e.currentTarget.style.background='linear-gradient(135deg,#00E5FF22,#7B61FF22)'}}
            >
              <FaPlus size={12}/> Add Category
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── User Badge (top bar) ─────────────────────────────────────────────
function UserBadge({ isGuest }) {
  return (
    <div style={{
      display:'flex', alignItems:'center', gap:8, padding:'6px 12px', borderRadius:12,
      background: isGuest ? 'rgba(255,255,255,0.04)' : 'linear-gradient(135deg,rgba(0,229,255,0.12),rgba(123,97,255,0.12))',
      border: `1px solid ${isGuest ? 'rgba(255,255,255,0.08)' : 'rgba(0,229,255,0.28)'}`,
    }}>
      {isGuest ? <FaGhost size={13} color="#777"/> : <FaUser size={13} color="#00E5FF"/>}
      <span style={{ fontSize:12, fontWeight:700, color: isGuest ? '#666' : '#00E5FF', letterSpacing:'0.06em' }}>
        {isGuest ? 'Ghost' : 'Hasan'}
      </span>
      {isGuest && (
        <span style={{
          fontSize:9, fontWeight:600, color:'#444', background:'rgba(255,255,255,0.05)',
          padding:'2px 6px', borderRadius:4, letterSpacing:'0.1em', textTransform:'uppercase',
        }}>Read Only</span>
      )}
      {!isGuest && (
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
    <motion.div
      initial={{ opacity:0, y:-6 }} animate={{ opacity:1, y:0 }}
      style={{
        margin:'12px 24px 0', padding:'10px 16px', borderRadius:12,
        background:'rgba(255,120,0,0.06)', border:'1px solid rgba(255,120,0,0.2)',
        display:'flex', alignItems:'center', gap:10, fontSize:12.5, color:'#aaa',
      }}
    >
      <FaGhost size={14} color="#FF8C00" style={{ flexShrink:0 }}/>
      <span>
        You're browsing as <strong style={{ color:'#FF8C00' }}>Ghost · Read Only</strong>. 
        Copy, Favorite, Navigate to links, and all write actions are disabled.
      </span>
    </motion.div>
  )
}

// ─── Main Dashboard ───────────────────────────────────────────────────
export default function Dashboard({ onLogout, role }) {
  const isGuest = role === 'guest'
  const [categories, setCategories] = useState(loadCategories)
  const [favorites, setFavorites]   = useState(loadFavorites)
  const [recent, setRecent]         = useState([])
  const [activeView, setActiveView] = useState('dashboard')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const { toast, show: showToast } = useToast()

  // Modals state
  const [addServerModal,  setAddServerModal]  = useState({ open:false, catId:null })
  const [editServerModal, setEditServerModal] = useState({ open:false, catId:null, server:null })
  const [delServerModal,  setDelServerModal]  = useState({ open:false, catId:null, server:null })
  const [addCatModal,     setAddCatModal]     = useState(false)
  const [editCatModal,    setEditCatModal]    = useState({ open:false, category:null })
  const [delCatModal,     setDelCatModal]     = useState({ open:false, category:null })

  // Persist
  useEffect(() => saveCategories(categories), [categories])
  useEffect(() => saveFavorites(favorites), [favorites])

  // ── Favorite toggle ──
  const handleToggleFav = (server) => {
    if (isGuest) return
    setFavorites(prev =>
      prev.includes(server.id) ? prev.filter(id => id !== server.id) : [server.id, ...prev]
    )
    showToast(favorites.includes(server.id) ? 'Removed from favorites' : 'Added to favorites')
    // track recent when opening (called from ServerCard click)
  }

  // ── Add Server ──
  const handleAddServer = (catId, data) => {
    const newSrv = { id: uid(), ...data }
    setCategories(prev => prev.map(c => c.id === catId ? { ...c, servers: [...c.servers, newSrv] } : c))
    setAddServerModal({ open:false, catId:null })
    showToast(`Server "${data.name}" added!`)
  }

  // ── Edit Server ──
  const handleEditServer = (catId, data) => {
    setCategories(prev => prev.map(c => c.id === catId
      ? { ...c, servers: c.servers.map(s => s.id === editServerModal.server.id ? { ...s, ...data } : s) }
      : c
    ))
    setEditServerModal({ open:false, catId:null, server:null })
    showToast('Server updated!')
  }

  // ── Delete Server ──
  const handleDeleteServer = () => {
    const { catId, server } = delServerModal
    setCategories(prev => prev.map(c => c.id === catId ? { ...c, servers: c.servers.filter(s => s.id !== server.id) } : c))
    setFavorites(prev => prev.filter(id => id !== server.id))
    setDelServerModal({ open:false, catId:null, server:null })
    showToast('Server deleted')
  }

  // ── Add Category ──
  const handleAddCategory = (data) => {
    const newCat = { id: uid(), servers: [], ...data }
    setCategories(prev => [...prev, newCat])
    setAddCatModal(false)
    showToast(`Category "${data.name}" added!`)
  }

  // ── Edit Category ──
  const handleEditCategory = (data) => {
    setCategories(prev => prev.map(c => c.id === editCatModal.category.id ? { ...c, ...data } : c))
    setEditCatModal({ open:false, category:null })
    showToast('Category updated!')
  }

  // ── Delete Category ──
  const handleDeleteCategory = () => {
    const { category } = delCatModal
    setCategories(prev => prev.filter(c => c.id !== category.id))
    setFavorites(prev => prev.filter(id => !category.servers.find(s => s.id === id)))
    setDelCatModal({ open:false, category:null })
    if (activeView === `cat_${category.id}`) setActiveView('dashboard')
    showToast('Category deleted')
  }

  // ── Render view ──
  const renderContent = () => {
    if (activeView === 'search') return (
      <SearchView
        categories={categories} isGuest={isGuest} favorites={favorites}
        onToggleFav={handleToggleFav}
        onEditServer={(catId, s) => setEditServerModal({ open:true, catId, server:s })}
        onDeleteServer={(catId, s) => setDelServerModal({ open:true, catId, server:s })}
        showToast={showToast}
      />
    )
    if (activeView === 'favorites') return (
      <FavoritesView
        categories={categories} favorites={favorites} isGuest={isGuest}
        onToggleFav={handleToggleFav}
        onEditServer={(catId, s) => setEditServerModal({ open:true, catId, server:s })}
        onDeleteServer={(catId, s) => setDelServerModal({ open:true, catId, server:s })}
        showToast={showToast}
      />
    )
    if (activeView === 'recent') return (
      <RecentView
        recent={recent} categories={categories} favorites={favorites} isGuest={isGuest}
        onToggleFav={handleToggleFav}
        onEditServer={(catId, s) => setEditServerModal({ open:true, catId, server:s })}
        onDeleteServer={(catId, s) => setDelServerModal({ open:true, catId, server:s })}
        showToast={showToast}
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
            showToast={showToast}
          />
        </div>
      )
    }
    // Default: dashboard home
    return (
      <div>
        <HeroSection isGuest={isGuest} onNav={(action) => {
          if (action === 'add_category') setAddCatModal(true)
        }}/>
        <div style={{ padding:'16px 0 0' }}>
          <StatsBar categories={categories} favCount={favorites.length}/>
        </div>
        <div style={{ paddingBottom:40 }}>
          {categories.map(cat => (
            <CategorySection
              key={cat.id} category={cat} isGuest={isGuest} favorites={favorites}
              onToggleFav={handleToggleFav}
              onEditServer={(catId, s) => setEditServerModal({ open:true, catId, server:s })}
              onDeleteServer={(catId, s) => setDelServerModal({ open:true, catId, server:s })}
              onAddServer={(catId) => setAddServerModal({ open:true, catId })}
              onEditCategory={(c) => setEditCatModal({ open:true, category:c })}
              onDeleteCategory={(c) => setDelCatModal({ open:true, category:c })}
              showToast={showToast}
            />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div style={{ display:'flex', height:'100vh', overflow:'hidden', background:'#070f1c', color:'#ccc', fontFamily:"'Inter','Segoe UI',sans-serif" }}>
      {/* Sidebar */}
      <Sidebar
        categories={categories} activeView={activeView}
        setActiveView={setActiveView} onLogout={onLogout}
        isGuest={isGuest} collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
      />

      {/* Main */}
      <main style={{ flex:1, overflowY:'auto', display:'flex', flexDirection:'column', minWidth:0 }}>
        {/* Top bar */}
        <div style={{
          position:'sticky', top:0, zIndex:50,
          background:'rgba(7,15,28,0.9)', backdropFilter:'blur(20px)',
          borderBottom:'1px solid rgba(0,229,255,0.06)',
          padding:'10px 20px', display:'flex', alignItems:'center', justifyContent:'space-between', gap:12,
        }}>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <UserBadge isGuest={isGuest}/>
            <div style={{ width:1, height:16, background:'rgba(255,255,255,0.08)' }}/>
            <nav style={{ display:'flex', alignItems:'center', gap:4, fontSize:11.5, color:'#555' }}>
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
            {/* Search shortcut */}
            <button
              onClick={() => setActiveView('search')}
              style={{
                display:'flex', alignItems:'center', gap:7, padding:'7px 14px', borderRadius:10,
                background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)',
                color:'#555', cursor:'pointer', fontSize:12, transition:'all .2s',
              }}
              onMouseEnter={e=>{e.currentTarget.style.color='#bbb';e.currentTarget.style.background='rgba(255,255,255,0.08)'}}
              onMouseLeave={e=>{e.currentTarget.style.color='#555';e.currentTarget.style.background='rgba(255,255,255,0.04)'}}
            >
              <FaSearch size={11}/> <span>Search</span>
            </button>
            {/* Hasan: Add Category quick button */}
            {!isGuest && (
              <button
                onClick={() => setAddCatModal(true)}
                style={{
                  display:'flex', alignItems:'center', gap:7, padding:'7px 14px', borderRadius:10,
                  background:'rgba(0,229,255,0.08)', border:'1px solid rgba(0,229,255,0.2)',
                  color:'#00E5FF', cursor:'pointer', fontSize:12, fontWeight:600, transition:'all .2s',
                }}
                onMouseEnter={e=>e.currentTarget.style.background='rgba(0,229,255,0.15)'}
                onMouseLeave={e=>e.currentTarget.style.background='rgba(0,229,255,0.08)'}
              >
                <FaPlus size={11}/> Category
              </button>
            )}
          </div>
        </div>

        {/* Guest banner */}
        {isGuest && <GuestBanner/>}

        {/* Page content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeView}
            initial={{ opacity:0, y:10 }}
            animate={{ opacity:1, y:0 }}
            exit={{ opacity:0, y:-6 }}
            transition={{ duration:0.2 }}
            style={{ flex:1 }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>

        {/* Footer */}
        <footer style={{
          padding:'24px', textAlign:'center',
          borderTop:'1px solid rgba(0,229,255,0.06)', marginTop:'auto',
        }}>
          <div style={{ fontSize:12, fontWeight:900, background:'linear-gradient(90deg,#00E5FF,#7B61FF)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', letterSpacing:'0.1em', marginBottom:4 }}>
            MY SERVER PAGE
          </div>
          <div style={{ fontSize:11, color:'#444' }}>
            Created by <span style={{ color:'#00E5FF' }}>Hasan</span> · v1.0.0 · © 2026 · FIFA 2026 Inspired
          </div>
        </footer>
      </main>

      {/* ── Modals ── */}
      <ServerModal
        open={addServerModal.open}
        onClose={() => setAddServerModal({ open:false, catId:null })}
        onSave={(data) => handleAddServer(addServerModal.catId, data)}
        title="Add New Server"
      />
      <ServerModal
        open={editServerModal.open}
        onClose={() => setEditServerModal({ open:false, catId:null, server:null })}
        onSave={(data) => handleEditServer(editServerModal.catId, data)}
        initial={editServerModal.server}
        title="Edit Server"
      />
      <ConfirmModal
        open={delServerModal.open}
        onClose={() => setDelServerModal({ open:false, catId:null, server:null })}
        onConfirm={handleDeleteServer}
        message={`Delete "${delServerModal.server?.name}"? This cannot be undone.`}
      />
      <CategoryModal
        open={addCatModal}
        onClose={() => setAddCatModal(false)}
        onSave={handleAddCategory}
        title="Add New Category"
      />
      <CategoryModal
        open={editCatModal.open}
        onClose={() => setEditCatModal({ open:false, category:null })}
        onSave={handleEditCategory}
        initial={editCatModal.category}
        title="Edit Category"
      />
      <ConfirmModal
        open={delCatModal.open}
        onClose={() => setDelCatModal({ open:false, category:null })}
        onConfirm={handleDeleteCategory}
        message={`Delete category "${delCatModal.category?.name}" and ALL its servers? This cannot be undone.`}
      />

      <Toast toast={toast}/>
    </div>
  )
}