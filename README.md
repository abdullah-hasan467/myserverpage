# MY SERVER PAGE

> Premium Enterprise-Grade Server Portal Platform — FIFA 2026 Inspired

A futuristic, glassmorphism-style React dashboard for discovering, searching, organizing, and launching FTP, media, streaming, and live TV servers from one centralized control center.

---

## Live Preview

```
npm install && npm run dev
```

Opens at → `http://localhost:5173`

**Login credentials:**
| Field | Value |
|-------|-------|
| Username | `Hasan2211` |
| Password | `Hasan2780@` |

---

## Features

| Feature | Description |
|---------|-------------|
| FIFA-inspired login | Stadium lights, flying football, glassmorphism card |
| Animated hero | Football trajectory, aurora orbs, particle field, stadium beams |
| Global search | Ctrl+K command palette — instant fuzzy search across all servers |
| 5 categories | 34 servers: Fiber@Home, Dflix, Live TV, Sherpur, Universal FTP |
| Server cards | Icon, tag, description, URL preview, Launch / Copy / Favorite |
| Favorites | Star any server — persisted to localStorage |
| Recent activity | Tracks last 10 opened servers |
| Stats bar | Animated counters: total servers, categories, favorites, recent |
| 4 themes | Dark AI · Cyber Blue · FIFA Gold · Midnight Purple |
| Keyboard shortcuts | Ctrl+K search · Ctrl+D dashboard · Ctrl+F favorites · Esc close |
| Toast notifications | Slide-in toasts for Copy / Add favorite / Remove favorite |
| Collapsible sidebar | Icon-only or expanded with labels, category shortcuts, theme picker |
| Mouse glow | Radial glow follows cursor |

---

## Directory Structure

```
myserverpage/
│
├── index.html                    # App entry — dark bg pre-load, meta tags
├── vite.config.js                # Vite config (@vitejs/plugin-react)
├── tailwind.config.js            # Custom colors, keyframe animations
├── postcss.config.js             # Tailwind + Autoprefixer pipeline
├── eslint.config.js              # ESLint rules (react-hooks, react-refresh)
├── package.json                  # Dependencies and npm scripts
│
├── public/
│   ├── favicon.svg               # App favicon
│   └── icons.svg                 # SVG icon sprite (unused by app, scaffold)
│
└── src/
    ├── main.jsx                  # ReactDOM.createRoot entry point
    ├── App.jsx                   # Root — AppProvider + Login/Dashboard router
    ├── App.css                   # Minimal overrides (Tailwind handles styles)
    ├── index.css                 # Global CSS: Tailwind directives, custom
    │                             #   utilities (glass, glow, gradient-text,
    │                             #   animated-bg, server-card hover,
    │                             #   particle, mouse-glow, toast, shine)
    │
    ├── assets/
    │   ├── hero.png              # Scaffold asset (not used by app)
    │   ├── react.svg             # Scaffold asset
    │   └── vite.svg              # Scaffold asset
    │
    ├── context/
    │   └── AppContext.jsx        # Global state (Context API)
    │                             #   - favorites (localStorage)
    │                             #   - recentlyOpened (localStorage)
    │                             #   - theme (localStorage)
    │                             #   - toasts queue
    │                             #   - commandPaletteOpen
    │                             #   - sidebarCollapsed
    │                             #   - openServer(), toggleFavorite(),
    │                             #     isFavorite(), copyLink(), addToast()
    │                             #   - Ctrl+K / Esc global key listeners
    │
    ├── data/
    │   └── servers.js            # All server data + helpers
    │                             #   - categories[] — 5 categories, 34 servers
    │                             #   - getAllServers() — flat array
    │                             #   - searchServers(query) — fuzzy filter
    │
    ├── pages/
    │   ├── Login.jsx             # FIFA-inspired animated login page
    │   │                         #   - 4-phase animation sequence
    │   │                         #   - Stadium light beams (SVG-free CSS)
    │   │                         #   - Framer Motion football trajectory
    │   │                         #   - Glassmorphism card with glow border
    │   │                         #   - Password toggle, remember me
    │   │                         #   - Loading spinner + success state
    │   │                         #   - Particle field (30 particles)
    │   │                         #   - Mouse-follow glow
    │   │
    │   └── Dashboard.jsx         # Main dashboard shell
    │                             #   - Sidebar + scrollable main area
    │                             #   - View router: dashboard / search /
    │                             #     favorites / recent / cat_<id>
    │                             #   - Sticky topbar with breadcrumb + ⌘K
    │                             #   - DashboardHome: hero + stats + quick
    │                             #     access + all category sections
    │                             #   - SearchView: live results grid
    │                             #   - FavoritesView / RecentView
    │                             #   - CategorySection per category
    │                             #   - QuickCard for pinned/recent rows
    │                             #   - Footer (Hasan, v1.0.0, copyright)
    │                             #   - Mouse glow overlay
    │                             #   - Ctrl+D / Ctrl+F shortcuts
    │
    └── components/
        ├── Sidebar.jsx           # Collapsible sidebar
        │                         #   - Animate width 260px ↔ 72px
        │                         #   - Toggle chevron button
        │                         #   - Logo + brand name
        │                         #   - Nav items: Dashboard, Search,
        │                         #     Favorites, Recent
        │                         #   - Category shortcuts (5 items)
        │                         #   - Active indicator (left border glow)
        │                         #   - Theme picker (4-swatch grid)
        │                         #   - Logout button
        │
        ├── ServerCard.jsx        # Individual server card
        │                         #   - Hover lift + glow effect
        │                         #   - Icon, name, tag badge, description
        │                         #   - URL preview (monospace)
        │                         #   - Favorite toggle (Star)
        │                         #   - Launch button (opens new tab)
        │                         #   - Copy link button
        │                         #   - Shine sweep animation
        │                         #   - Staggered mount animation
        │
        ├── HeroSection.jsx       # Dashboard hero banner
        │                         #   - Looping football animation (5s)
        │                         #   - Stadium light beam overlays
        │                         #   - Aurora radial orbs
        │                         #   - Floating particle field
        │                         #   - Grid pattern overlay
        │                         #   - Title, subtitle, inline search bar
        │                         #   - ⌘K shortcut hint on search
        │                         #   - Summary stats (servers/categories/TV)
        │
        ├── StatsBar.jsx          # Animated statistics row
        │                         #   - 4 stat cards: Total Servers,
        │                         #     Categories, Favorites, Recent
        │                         #   - IntersectionObserver counter
        │                         #   - Smooth easing count-up on scroll
        │
        ├── Toast.jsx             # Toast notification system
        │                         #   - AnimatePresence slide-in/out
        │                         #   - Types: add / remove / copy / info
        │                         #   - Auto-dismiss after 3.2s
        │                         #   - Fixed bottom-right z-[100]
        │
        └── CommandPalette.jsx    # ⌘K command palette overlay
                                  #   - Modal backdrop with blur
                                  #   - Real-time fuzzy search input
                                  #   - Keyboard nav (↑↓ + Enter)
                                  #   - Results: icon, name, URL, category
                                  #   - Highlighted selected row
                                  #   - Footer: nav hints (↑↓ / ↵ / ESC)
```

---

## Server Categories

| Category | Servers | Color |
|----------|---------|-------|
| Fiber@Home | 10 | `#00E5FF` |
| Dflix | 3 | `#7B61FF` |
| Live TV | 5 | `#FFD700` |
| Sherpur | 9 | `#00E5FF` |
| Universal FTP | 12 | `#7B61FF` |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 19 + Vite 8 |
| Styling | Tailwind CSS v3 + custom CSS |
| Animation | Framer Motion 12 + CSS keyframes |
| Icons | Lucide React + React Icons |
| State | Context API + localStorage |
| Routing | In-component view state (no React Router pages) |
| Build | Vite (ESM, tree-shaken) |

---

## Color Palette

| Name | Hex | Usage |
|------|-----|-------|
| Deep Space Blue | `#081120` | Background |
| Electric Cyan | `#00E5FF` | Primary accent, glow |
| Royal Purple | `#7B61FF` | Secondary accent |
| Premium Gold | `#FFD700` | FIFA highlights, favorites |

---

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl + K` | Open command palette |
| `Ctrl + D` | Go to Dashboard |
| `Ctrl + F` | Go to Favorites |
| `Esc` | Close modal / palette |

---

## NPM Scripts

```bash
npm run dev       # Start dev server (HMR) → localhost:5173
npm run build     # Production build → dist/
npm run preview   # Serve dist/ locally
npm run lint      # ESLint check
```

---

## Deployment

No config changes needed. Works out of the box on:

**Netlify** — drag `dist/` folder or connect repo, auto-detects Vite.

**Vercel** — connect repo, framework preset: Vite.

**GitHub Pages** — add `base: '/repo-name/'` to `vite.config.js`, then push `dist/`.

---

## localStorage Keys

| Key | Content |
|-----|---------|
| `msp_favorites` | JSON array of favorited server objects |
| `msp_recent` | JSON array of recently opened servers (max 10) |
| `msp_theme` | Active theme key: `dark` / `cyber` / `gold` / `purple` |
| `msp_remember` | Saved credentials `{ u, p }` when "Remember me" is checked |

---

## Created by Hasan · v1.0.0 · © 2026
