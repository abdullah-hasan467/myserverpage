export const categories = [
  {
    id: 'fiber',
    name: 'Fiber@Home',
    icon: '🏠',
    color: '#00E5FF',
    description: 'Local ISP network servers and resources',
    servers: [
      { id: 'f1',  name: 'Main Portal',       url: 'http://172.19.178.180',                                                                    description: 'Fiber@Home main access portal',              icon: '🌐', tag: 'Portal'        },
      { id: 'f2',  name: 'Jhongkar FTP',       url: 'https://www.jhongkar.live/#next-section1',                                                 description: 'JHIT FTP server with media content',         icon: '📁', tag: 'FTP'           },
      { id: 'f3',  name: 'IPTV IDN',           url: 'http://iptvidn.com/',                                                                      description: 'IPTV Indonesia streaming platform',          icon: '📺', tag: 'IPTV'          },
      { id: 'f4',  name: 'Movie Mazic',        url: 'http://moviemazic.xyz/',                                                                   description: 'Movie streaming and download portal',        icon: '🎬', tag: 'Movies'        },
      { id: 'f5',  name: 'SkyView TimePass',   url: 'http://timepassbd.live/',                                                                  description: 'SkyView entertainment portal',              icon: '🎭', tag: 'Entertainment' },
      { id: 'f6',  name: '11Plus Live',        url: 'http://11plus.live/',                                                                      description: 'Live TV and streaming service',              icon: '📡', tag: 'Live TV'       },
      { id: 'f7',  name: 'BTSL FTP',           url: 'http://103.109.213.254/',                                                                  description: 'BTSL FTP server access',                    icon: '🗄️', tag: 'FTP'           },
      { id: 'f8',  name: 'New FTP',            url: 'http://172.17.17.10/',                                                                     description: 'New FTP server on local network',            icon: '💾', tag: 'FTP'           },
      { id: 'f9',  name: 'Local Server 1',     url: 'http://172.16.50.4/',                                                                      description: 'Local network server 172.16.50.4',           icon: '🖥️', tag: 'Local'         },
      { id: 'f10', name: 'Circle FTP',         url: 'http://circleftp.net/',                                                                    description: 'Circle FTP media server',                   icon: '🔄', tag: 'FTP'           },
    ]
  },
  {
    id: 'torrents',
    name: 'Torrents',
    icon: '🧲',
    color: '#FF4C4C',
    description: 'Torrent indexers, trackers and download portals',
    servers: [
      { id: 't1', name: 'YTS Official',       url: 'https://www12.yts-official.to/',        description: 'YTS — high quality movies in small file size',        icon: '🎬', tag: 'Movies'   },
      { id: 't2', name: 'TorrentBD',          url: 'https://www.torrentbd.net/',            description: 'TorrentBD — Bangladeshi torrent tracker & community', icon: '🇧🇩', tag: 'BD'       },
      { id: 't3', name: 'RARBG Official',     url: 'https://rarbg-official.is/',            description: 'RARBG Official — movies, TV, games & software',       icon: '🧲', tag: 'Tracker'  },
      // { id: 't4', name: 'RARBG EN',           url: 'https://en.rarbg-official.is/',         description: 'RARBG English version — full content index',          icon: '🧲', tag: 'Tracker'  },
      { id: 't5', name: 'RARBG Movies',       url: 'https://en.rarbg-official.is/movies?', description: 'RARBG Official — movies category browse',            icon: '🎥', tag: 'Movies'   },
      { id: 't6', name: '1337x',              url: 'https://www.1337x.tw/',                 description: '1337x — popular torrent search engine & index',       icon: '🔍', tag: 'Index'    },
      { id: 't7', name: 'The Pirate Bay',     url: 'https://thepiratebay.org/index.html',   description: 'The Pirate Bay — the world\'s most resilient tracker', icon: '🏴‍☠️', tag: 'Tracker'  },
      { id: 't8', name: 'CHD4',              url: 'https://www.chd4.com/index.php',        description: 'CHD4 — HD movie torrents and releases',              icon: '💿', tag: 'HD'       },
      { id: 't9', name: 'MoviezMad',          url: 'https://www.moviezmad.live/',           description: 'MoviezMad — Bollywood, Hollywood & dubbed movies',    icon: '🍿', tag: 'Movies'   },
    ]
  },
  {
    id: 'dflix',
    name: 'Dflix Servers',
    icon: '🎥',
    color: '#7B61FF',
    description: 'Dflix media streaming ecosystem',
    servers: [
      { id: 'd1', name: 'Dflix Home',    url: 'http://stream.dflix.live:8096/web/index.html#!/home?tab=favorites',                              description: 'Dflix main streaming portal with favorites', icon: '🎬', tag: 'Streaming' },
      { id: 'd2', name: 'Dflix CDN',     url: 'http://cdn.dflix.live:5050/',                                                                    description: 'Dflix CDN content delivery server',          icon: '📦', tag: 'CDN'       },
      { id: 'd3', name: 'Dflix K-Drama', url: "http://cdn.dflix.live:5050/TV%20Series%20Dubbed/It's%20Okay%20to%20Not%20Be%20Okay/Season%201", description: "It's Okay to Not Be Okay - Season 1",       icon: '🇰🇷', tag: 'K-Drama'  },
    ]
  },
  {
    id: 'livetv',
    name: 'Live TV',
    icon: '📡',
    color: '#FFD700',
    description: 'Live television and sports streaming',
    servers: [
      { id: 'l1', name: 'Amar TV',       url: 'https://amartv.xyz/',                description: 'Amar TV live streaming portal',     icon: '📺', tag: 'Live TV' },
      { id: 'l2', name: 'BDIX TV',       url: 'https://bdixtv.serverbd247.com/',    description: 'BDIX live television service',       icon: '🎙️', tag: 'BD TV'   },
      { id: 'l3', name: 'IPTV IDN',      url: 'http://iptvidn.com/',                description: 'IPTV streaming platform',            icon: '🌐', tag: 'IPTV'   },
      { id: 'l4', name: 'Touch Cricket', url: 'https://touchcricket.live/',         description: 'Live cricket streaming',             icon: '🏏', tag: 'Sports' },
      { id: 'l5', name: 'WebCric',       url: 'https://go.webcric.com/',            description: 'WebCric live cricket portal',        icon: '🏟️', tag: 'Cricket'},
      { id: 'l6', name: 'ALL TV',        url: 'https://bonobo.live/',               description: 'All TV Channel',                    icon: '🎥', tag: 'TV'     },
    ]
  },
  {
    id: 'sherpur',
    name: 'Sherpur Servers',
    icon: '🏙️',
    color: '#00E5FF',
    description: 'Sherpur regional server network',
    servers: [
      { id: 's1', name: 'CTG Hall',         url: 'https://ctghall.com/',                          description: 'Chittagong Hall content server',          icon: '🏛️', tag: 'Regional'     },
      { id: 's2', name: 'Crazy CTG',        url: 'https://crazyctg.com/',                         description: 'Crazy CTG entertainment portal',          icon: '🎪', tag: 'Entertainment'},
      { id: 's3', name: 'CTG Movies',       url: 'https://ctgmovies.com/',                        description: 'Chittagong movies server',                icon: '🎞️', tag: 'Movies'       },
      { id: 's4', name: 'Local WE 1',       url: 'http://172.20.2.5/we/',                         description: 'Local network server WE',                 icon: '🖥️', tag: 'Local'        },
      { id: 's5', name: 'BDIX TV WE',       url: 'http://bdixtv.live/we/',                        description: 'BDIX TV local network access',            icon: '📻', tag: 'Local'        },
      { id: 's6', name: 'Discovery FTP',    url: 'https://discoveryftp.net/',                     description: 'Discovery FTP content server',            icon: '🔭', tag: 'FTP'          },
      { id: 's7', name: 'Local Server 2',   url: 'http://172.16.50.4/',                           description: 'Local network server access',             icon: '🌐', tag: 'Local'        },
      { id: 's8', name: 'Local Server 3',   url: 'http://172.27.27.84/',                          description: 'Local network server 172.27.27.84',       icon: '💻', tag: 'Local'        },
      { id: 's9', name: 'BCN Communication',url: 'https://www.bcncommunication.net/ftp-services', description: 'BCN Communication FTP services',          icon: '📡', tag: 'FTP'          },
    ]
  },
  {
    id: 'universal',
    name: 'Universal FTP',
    icon: '🌍',
    color: '#7B61FF',
    description: 'Universal FTP and streaming resources',
    servers: [
      { id: 'u1',  name: 'New Circle FTP',   url: 'http://new.circleftp.net/',          description: 'New Circle FTP server',                          icon: '🔄', tag: 'FTP'       },
      { id: 'u2',  name: 'FreeDrive Movie',  url: 'https://freedrivemovie.cfd/',        description: 'Free movie drive collection',                    icon: '🎬', tag: 'Movies'    },
      { id: 'u3',  name: 'MLS BD',           url: 'https://mlsbd.co/',                  description: 'MLS BD content server',                          icon: '📁', tag: 'FTP'       },
      { id: 'u4',  name: 'Fojik',            url: 'https://fojik.com/',                 description: 'Fojik media platform',                           icon: '🎭', tag: 'Media'     },
      { id: 'u5',  name: 'FlixMet',          url: 'https://flixmet.net/',               description: 'FlixMet streaming service',                      icon: '🍿', tag: 'Streaming' },
      { id: 'u6',  name: '11Plus Live',      url: 'https://11plus.live/',               description: 'Live streaming portal',                          icon: '📡', tag: 'Live'      },
      { id: 'u7',  name: 'Internet Archive', url: 'https://archive.org/',               description: 'The Internet Archive - wayback machine & media', icon: '📚', tag: 'Archive'   },
      { id: 'u8',  name: 'FTP Server BD',    url: 'http://ftpserver.com.bd/live-tv-2/', description: 'Bangladesh FTP server live TV',                  icon: '🖥️', tag: 'FTP'       },
      { id: 'u9',  name: 'HiCine',           url: 'https://hicine.app/',                description: 'HiCine movie streaming app',                     icon: '🎥', tag: 'Streaming' },
      { id: 'u10', name: 'Hurawatch',        url: 'https://hurawatchzz.tv/home',        description: 'Hurawatch anime & movies',                       icon: '👁️', tag: 'Anime'     },
      { id: 'u11', name: '9Anime TV',        url: 'https://9animetv.to/',               description: '9Anime - HD anime streaming',                    icon: '⛩️', tag: 'Anime'     },
      { id: 'u12', name: 'MyDex TV',         url: 'https://watch.mydex.tv/',            description: 'MyDex TV streaming platform',                    icon: '📺', tag: 'TV'        },
    ]
  },
  
]

export const getAllServers = () =>
  categories.flatMap(c =>
    c.servers.map(s => ({ ...s, category: c.name, categoryId: c.id, categoryColor: c.color, categoryIcon: c.icon }))
  )

export const searchServers = (query) => {
  if (!query.trim()) return []
  const q = query.toLowerCase()
  return getAllServers().filter(s =>
    s.name.toLowerCase().includes(q) ||
    s.description.toLowerCase().includes(q) ||
    s.tag.toLowerCase().includes(q) ||
    s.category.toLowerCase().includes(q) ||
    s.url.toLowerCase().includes(q)
  )
}