import { useState, useEffect, useCallback } from 'react'
import { categories as initialCategories } from '../data/servers'

const API_BASE = 'http://localhost:3001/api'

// ─────────────────────────────────────────────────────────────────────
// useServerData
//
// Loads categories from the local API (which reads src/data/servers.js)
// on mount, and provides a `save(categories)` function that PUTs the
// full array back — the API server then rewrites servers.js on disk.
//
// Workflow:
//   1. Edit/Add/Delete in the UI → calls save(newCategories)
//   2. Local API writes src/data/servers.js immediately
//   3. Vite hot-reloads automatically (file changed on disk)
//   4. When you're happy with changes:
//        git add src/data/servers.js
//        git commit -m "Update servers"
//        git push
//      ...and it's live on GitHub / your deployed site after deploy.
//
// If the local API isn't running (e.g. on the deployed Netlify site),
// this hook falls back to the bundled `categories` from servers.js and
// `save()` becomes a no-op with a warning — so the deployed site still
// works read-only.
// ─────────────────────────────────────────────────────────────────────
export function useServerData() {
  const [categories, setCategories] = useState(initialCategories)
  const [loading, setLoading] = useState(true)
  const [apiAvailable, setApiAvailable] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  // Load from local API on mount
  useEffect(() => {
    let cancelled = false
    fetch(`${API_BASE}/categories`)
      .then(res => {
        if (!res.ok) throw new Error('API not ok')
        return res.json()
      })
      .then(data => {
        if (cancelled) return
        setCategories(data.categories)
        setApiAvailable(true)
      })
      .catch(() => {
        if (cancelled) return
        // Local API not running — use bundled data, read-only
        setApiAvailable(false)
      })
      .finally(() => !cancelled && setLoading(false))

    return () => { cancelled = true }
  }, [])

  // Save full categories array back to servers.js via local API
  const save = useCallback(async (newCategories) => {
    setCategories(newCategories) // update UI immediately

    if (!apiAvailable) {
      console.warn('Local data API not running — changes are not persisted to servers.js. Run "node server-api.cjs".')
      setError('Local API not running — changes not saved to file.')
      return false
    }

    setSaving(true)
    setError(null)
    try {
      const res = await fetch(`${API_BASE}/categories`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ categories: newCategories }),
      })
      if (!res.ok) throw new Error('Save failed')
      return true
    } catch (err) {
      setError(err.message)
      return false
    } finally {
      setSaving(false)
    }
  }, [apiAvailable])

  return { categories, setCategories, save, loading, saving, apiAvailable, error }
}
