// server-api.cjs
// A tiny local dev server that writes your category/server data
// directly into src/data/servers.js as a real JS file.
//
// Run with:  node server-api.cjs
// (keep this running alongside `npm run dev`)

const express = require('express')
const fs = require('fs')
const path = require('path')
const cors = require('cors')

const app = express()
app.use(cors())
app.use(express.json({ limit: '5mb' }))

const FILE_PATH = path.join(__dirname, 'src', 'data', 'servers.js')

// ─── Helpers ────────────────────────────────────────────────────────
function categoriesToFileContent(categories) {
  const json = JSON.stringify(categories, null, 2)

  return `export const categories = ${json}

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
`
}

function readCategoriesFromFile() {
  const content = fs.readFileSync(FILE_PATH, 'utf-8')
  // Extract the array between "export const categories = [" and the
  // matching closing bracket before "export const getAllServers"
  const match = content.match(/export const categories = (\[[\s\S]*?\n\])\s*\n\s*export const getAllServers/)
  if (!match) throw new Error('Could not parse servers.js — unexpected format')
  // Use Function to safely evaluate the array literal (it's plain JS/JSON-ish)
  // eslint-disable-next-line no-new-func
  const arr = new Function(`return ${match[1]}`)()
  return arr
}

// ─── Routes ─────────────────────────────────────────────────────────

// GET current categories (reads live from servers.js)
app.get('/api/categories', (req, res) => {
  try {
    const categories = readCategoriesFromFile()
    res.json({ categories })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err.message })
  }
})

// PUT full categories array — overwrites servers.js
app.put('/api/categories', (req, res) => {
  try {
    const { categories } = req.body
    if (!Array.isArray(categories)) {
      return res.status(400).json({ error: 'categories must be an array' })
    }
    const fileContent = categoriesToFileContent(categories)
    fs.writeFileSync(FILE_PATH, fileContent, 'utf-8')
    res.json({ ok: true })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err.message })
  }
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`✅ Local data API running at http://localhost:${PORT}`)
  console.log(`   Writing to: ${FILE_PATH}`)
  console.log(`   Keep this running alongside "npm run dev"`)
})
