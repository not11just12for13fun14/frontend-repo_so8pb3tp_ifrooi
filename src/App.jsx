import { useEffect, useMemo, useState } from 'react'
import { Film, Search, Filter, Plus, Trash2, Star, Link2, User, Users, Database } from 'lucide-react'
import { motion } from 'framer-motion'

function Badge({ children, color = 'indigo' }) {
  const colors = {
    indigo: 'bg-indigo-50 text-indigo-700 ring-indigo-200',
    slate: 'bg-slate-50 text-slate-700 ring-slate-200',
    yellow: 'bg-yellow-50 text-yellow-800 ring-yellow-200',
    red: 'bg-rose-50 text-rose-700 ring-rose-200',
    green: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  }
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${colors[color]}`}>
      {children}
    </span>
  )
}

function SkeletonCard() {
  return (
    <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden animate-pulse">
      <div className="h-56 w-full bg-slate-100" />
      <div className="p-4 space-y-3">
        <div className="h-4 w-2/3 bg-slate-100 rounded" />
        <div className="h-3 w-1/3 bg-slate-100 rounded" />
        <div className="h-3 w-full bg-slate-100 rounded" />
        <div className="h-3 w-11/12 bg-slate-100 rounded" />
      </div>
    </div>
  )
}

function CinemaIllustration() {
  return (
    <div className="relative h-60 sm:h-64 md:h-72">
      {/* floating stars */}
      {Array.from({ length: 8 }).map((_, i) => (
        <motion.span
          key={i}
          className="absolute size-1.5 rounded-full bg-white/80"
          style={{ left: `${10 + i * 10}%`, top: `${30 + (i % 3) * 10}%` }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: [0, 1, 0], y: [-6, 0, -6] }}
          transition={{ duration: 3 + (i % 4), repeat: Infinity, ease: 'easeInOut', delay: i * 0.2 }}
        />
      ))}

      {/* cinema screen */}
      <motion.div
        className="absolute inset-x-0 top-2 mx-auto w-11/12 sm:w-4/5 h-28 sm:h-32 rounded-xl"
        initial={{ boxShadow: '0 0 0px rgba(255,255,255,0)' }}
        animate={{ boxShadow: ['0 0 0px rgba(255,255,255,0)', '0 0 36px rgba(255,255,255,0.25)', '0 0 0px rgba(255,255,255,0)'] }}
        transition={{ duration: 3, repeat: Infinity }}
        style={{ background: 'radial-gradient(circle at 30% 40%, rgba(255,255,255,0.85), rgba(255,255,255,0.1) 60%)' }}
      >
        <div className="h-full w-full rounded-xl ring-1 ring-white/40 backdrop-blur-[1px]" />
      </motion.div>

      {/* audience seats */}
      <div className="absolute left-1/2 -translate-x-1/2 bottom-6 w-10/12">
        <div className="grid grid-cols-7 gap-2 justify-items-center">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="h-3 w-10 bg-white/20 rounded-full" />
          ))}
        </div>
      </div>

      {/* person watching */}
      <motion.div
        className="absolute left-1/2 -translate-x-1/2 bottom-10 flex flex-col items-center"
        animate={{ y: [0, -2, 0] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <div className="size-9 rounded-full bg-white/90 shadow-sm" />
        <div className="h-10 w-12 -mt-1 rounded-b-xl rounded-t-md bg-white/80" />
        <div className="flex gap-1 mt-1">
          <div className="h-2 w-6 rounded-full bg-white/50" />
          <div className="h-2 w-6 rounded-full bg-white/50" />
        </div>
      </motion.div>

      {/* popcorn bucket */}
      <motion.div
        className="absolute right-[18%] bottom-8"
        initial={{ rotate: -6 }}
        animate={{ y: [0, -6, 0], rotate: [-6, -2, -6] }}
        transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
      >
        <div className="relative h-10 w-8">
          <div className="absolute bottom-0 h-8 w-8 bg-white/90 rounded-b-md" />
          <div className="absolute bottom-0 h-8 w-8 grid grid-cols-3">
            <div className="bg-rose-400/80" />
            <div className="bg-white/0" />
            <div className="bg-rose-400/80" />
          </div>
          {Array.from({ length: 5 }).map((_, i) => (
            <motion.span
              key={i}
              className="absolute top-0 size-1.5 rounded-full bg-white"
              style={{ left: `${10 + i * 15}%` }}
              animate={{ y: [-2, -6, -2] }}
              transition={{ duration: 1.8 + i * 0.2, repeat: Infinity, ease: 'easeInOut' }}
            />
          ))}
        </div>
      </motion.div>
    </div>
  )
}

function App() {
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [query, setQuery] = useState('')
  const [genre, setGenre] = useState('')
  const [form, setForm] = useState({ title: '', year: '', genres: '', rating: '', poster_url: '', description: '', director: '', cast: '' })
  const baseUrl = useMemo(() => import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000', [])

  const fetchMovies = async () => {
    try {
      setLoading(true)
      const url = new URL(`${baseUrl}/api/movies`)
      if (query) url.searchParams.set('q', query)
      if (genre) url.searchParams.set('genre', genre)
      const res = await fetch(url)
      if (!res.ok) throw new Error(`Gagal memuat data (${res.status})`)
      const data = await res.json()
      setMovies(data)
      setError('')
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMovies()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleAdd = async (e) => {
    e.preventDefault()
    try {
      const payload = {
        title: form.title.trim(),
        year: form.year ? Number(form.year) : undefined,
        genres: form.genres ? form.genres.split(',').map(g => g.trim()).filter(Boolean) : undefined,
        rating: form.rating ? Number(form.rating) : undefined,
        poster_url: form.poster_url || undefined,
        description: form.description || undefined,
        director: form.director || undefined,
        cast: form.cast ? form.cast.split(',').map(c => c.trim()).filter(Boolean) : undefined,
      }

      const res = await fetch(`${baseUrl}/api/movies`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      if (!res.ok) throw new Error('Gagal menambahkan film')
      await fetchMovies()
      setForm({ title: '', year: '', genres: '', rating: '', poster_url: '', description: '', director: '', cast: '' })
    } catch (e) {
      setError(e.message)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Hapus film ini?')) return
    const res = await fetch(`${baseUrl}/api/movies/${id}`, { method: 'DELETE' })
    if (res.ok) fetchMovies()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50">
      {/* Top Navbar */}
      <div className="sticky top-0 z-30 backdrop-blur supports-[backdrop-filter]:bg-white/70 bg-white/80 border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4">
          <div className="h-14 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="size-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 text-white grid place-items-center shadow">
                <Film size={18} />
              </div>
              <div>
                <p className="text-sm text-slate-500">Katalog</p>
                <h1 className="text-base font-semibold text-slate-800">Database Film</h1>
              </div>
            </div>
            <a href="/test" className="inline-flex items-center gap-1.5 text-sm text-indigo-600 hover:text-indigo-700">
              <Database size={16} />
              Cek Koneksi
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Hero */}
        <div className="mb-8">
          <div className="rounded-2xl bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-600 text-white p-6 sm:p-8 shadow-lg relative overflow-hidden">
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(500px_circle_at_0%_0%,white,transparent_60%),radial-gradient(400px_circle_at_100%_100%,white,transparent_60%)]" />
            <div className="relative grid md:grid-cols-2 gap-6 items-center">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Kelola koleksi film Anda dengan elegan</h2>
                <p className="mt-2 text-white/90 max-w-2xl">Tambah, cari, filter, dan kurasi daftar film favorit. Semua tersimpan rapi dengan dukungan database.</p>
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <Badge color="yellow"><Star size={14} /> Cepat & responsif</Badge>
                  <Badge color="slate"><Users size={14} /> Multi-kolaborasi</Badge>
                  <Badge color="green"><Link2 size={14} /> Terintegrasi API</Badge>
                </div>
              </div>
              <div className="pointer-events-none">
                <CinemaIllustration />
              </div>
            </div>
          </div>
        </div>

        {/* Form Tambah */}
        <section className="bg-white/90 backdrop-blur rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-6 mb-6">
          <form onSubmit={handleAdd} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="col-span-1 lg:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Judul</label>
              <input value={form.title} onChange={e=>setForm(f=>({...f, title:e.target.value}))} placeholder="Contoh: Inception" className="w-full border-slate-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-lg px-3 py-2" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Tahun</label>
              <input value={form.year} onChange={e=>setForm(f=>({...f, year:e.target.value}))} placeholder="2010" type="number" className="w-full border-slate-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-lg px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Rating (0-10)</label>
              <input value={form.rating} onChange={e=>setForm(f=>({...f, rating:e.target.value}))} placeholder="8.8" type="number" step="0.1" className="w-full border-slate-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-lg px-3 py-2" />
            </div>
            <div className="col-span-1 lg:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Genre</label>
              <input value={form.genres} onChange={e=>setForm(f=>({...f, genres:e.target.value}))} placeholder="Action, Sci-Fi" className="w-full border-slate-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-lg px-3 py-2" />
            </div>
            <div className="col-span-1 lg:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">URL Poster</label>
              <input value={form.poster_url} onChange={e=>setForm(f=>({...f, poster_url:e.target.value}))} placeholder="https://..." className="w-full border-slate-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-lg px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Sutradara</label>
              <div className="relative">
                <input value={form.director} onChange={e=>setForm(f=>({...f, director:e.target.value}))} placeholder="Nama sutradara" className="w-full border-slate-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-lg pl-9 pr-3 py-2" />
                <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Pemeran</label>
              <input value={form.cast} onChange={e=>setForm(f=>({...f, cast:e.target.value}))} placeholder="Pisahkan dengan koma" className="w-full border-slate-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-lg px-3 py-2" />
            </div>
            <div className="sm:col-span-2 lg:col-span-3">
              <label className="block text-sm font-medium text-slate-700 mb-1">Deskripsi</label>
              <input value={form.description} onChange={e=>setForm(f=>({...f, description:e.target.value}))} placeholder="Sinopsis singkat" className="w-full border-slate-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-lg px-3 py-2" />
            </div>
            <div className="flex items-end">
              <button type="submit" className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg px-4 py-2 shadow-sm transition">
                <Plus size={16} /> Tambah
              </button>
            </div>
          </form>
        </section>

        {/* Pencarian & Filter */}
        <section className="bg-white/90 backdrop-blur rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-2 items-center">
              <div className="relative">
                <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Cari judul..." className="border-slate-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-lg pl-9 pr-3 py-2 w-64" />
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              </div>
              <div className="relative">
                <input value={genre} onChange={e=>setGenre(e.target.value)} placeholder="Filter genre" className="border-slate-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-lg pl-9 pr-3 py-2 w-40" />
                <Filter size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              </div>
              <button onClick={fetchMovies} className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg px-4 py-2 shadow-sm">
                <Search size={16} /> Cari
              </button>
            </div>
            {error && <p className="flex items-center gap-2 text-rose-600 text-sm"><span className="size-1.5 rounded-full bg-rose-400" />{error}</p>}
          </div>
        </section>

        {/* Daftar Film */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <>
              {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
            </>
          ) : movies.length === 0 ? (
            <div className="col-span-full">
              <div className="text-center bg-white/90 backdrop-blur rounded-2xl border border-slate-200 shadow-sm p-10">
                <div className="mx-auto size-12 rounded-full bg-indigo-50 text-indigo-600 grid place-items-center mb-3">
                  <Film size={20} />
                </div>
                <h3 className="text-lg font-semibold text-slate-800">Belum ada data</h3>
                <p className="text-slate-600">Tambahkan film pertama Anda menggunakan formulir di atas.</p>
              </div>
            </div>
          ) : (
            movies.map(m => (
              <div key={m.id} className="group bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden transition hover:shadow-md hover:-translate-y-0.5">
                <div className="relative">
                  {m.poster_url ? (
                    <img src={m.poster_url} alt={m.title} className="h-56 w-full object-cover" onError={(e)=>{e.currentTarget.style.display='none'}} />
                  ) : (
                    <div className="h-56 w-full bg-slate-100 flex items-center justify-center text-slate-400">Tidak ada poster</div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition" />
                  <div className="absolute top-3 right-3">
                    <Badge color="yellow"><Star size={14} /> {m.rating ?? '-'}</Badge>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-800 leading-tight">{m.title}</h3>
                      <p className="text-sm text-slate-500">{m.year || '-'} • {(m.genres||[]).join(', ')}</p>
                    </div>
                    <button onClick={()=>handleDelete(m.id)} className="inline-flex items-center gap-1 text-rose-600 hover:text-rose-700 text-sm">
                      <Trash2 size={16} /> Hapus
                    </button>
                  </div>
                  {m.description && <p className="mt-2 text-sm text-slate-600 line-clamp-3">{m.description}</p>}
                  {(m.director || (m.cast && m.cast.length>0)) && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {m.director && <Badge><User size={12} /> {m.director}</Badge>}
                      {(m.cast||[]).slice(0,3).map((c,idx)=>(
                        <Badge key={idx} color="slate"><Users size={12} /> {c}</Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </section>

        {/* Footer */}
        <footer className="mt-10 py-6 text-center text-sm text-slate-500">
          Dibuat dengan FastAPI + React • Desain minimal modern
        </footer>
      </div>
    </div>
  )
}

export default App
