import { useEffect, useMemo, useState } from 'react'

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 py-10">
      <div className="max-w-6xl mx-auto px-4">
        <header className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Database Film</h1>
            <p className="text-slate-600">Simpan dan cari daftar film favorit Anda</p>
          </div>
          <a href="/test" className="text-sm text-indigo-600 hover:underline">Cek Koneksi</a>
        </header>

        <section className="bg-white rounded-xl shadow p-4 sm:p-6 mb-6">
          <form onSubmit={handleAdd} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <input value={form.title} onChange={e=>setForm(f=>({...f, title:e.target.value}))} placeholder="Judul" className="border rounded px-3 py-2" required />
            <input value={form.year} onChange={e=>setForm(f=>({...f, year:e.target.value}))} placeholder="Tahun" type="number" className="border rounded px-3 py-2" />
            <input value={form.genres} onChange={e=>setForm(f=>({...f, genres:e.target.value}))} placeholder="Genre (pisahkan dengan koma)" className="border rounded px-3 py-2 col-span-1 lg:col-span-2" />
            <input value={form.rating} onChange={e=>setForm(f=>({...f, rating:e.target.value}))} placeholder="Rating (0-10)" type="number" step="0.1" className="border rounded px-3 py-2" />
            <input value={form.poster_url} onChange={e=>setForm(f=>({...f, poster_url:e.target.value}))} placeholder="URL Poster" className="border rounded px-3 py-2 col-span-1 lg:col-span-2" />
            <input value={form.director} onChange={e=>setForm(f=>({...f, director:e.target.value}))} placeholder="Sutradara" className="border rounded px-3 py-2" />
            <input value={form.cast} onChange={e=>setForm(f=>({...f, cast:e.target.value}))} placeholder="Pemeran (pisahkan dengan koma)" className="border rounded px-3 py-2" />
            <input value={form.description} onChange={e=>setForm(f=>({...f, description:e.target.value}))} placeholder="Deskripsi singkat" className="border rounded px-3 py-2 col-span-1 lg:col-span-3" />
            <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white rounded px-4 py-2">Tambah</button>
          </form>
        </section>

        <section className="bg-white rounded-xl shadow p-4 sm:p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
            <div className="flex gap-2">
              <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Cari judul..." className="border rounded px-3 py-2 w-64" />
              <input value={genre} onChange={e=>setGenre(e.target.value)} placeholder="Filter genre" className="border rounded px-3 py-2 w-40" />
              <button onClick={fetchMovies} className="bg-slate-800 hover:bg-slate-900 text-white rounded px-4 py-2">Cari</button>
            </div>
            {error && <p className="text-red-600 text-sm">{error}</p>}
          </div>
        </section>

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full text-center text-slate-600">Memuat...</div>
          ) : movies.length === 0 ? (
            <div className="col-span-full text-center text-slate-600">Belum ada data. Tambahkan film pertama Anda.</div>
          ) : (
            movies.map(m => (
              <div key={m.id} className="bg-white rounded-xl shadow overflow-hidden">
                {m.poster_url ? (
                  <img src={m.poster_url} alt={m.title} className="h-56 w-full object-cover" onError={(e)=>{e.currentTarget.style.display='none'}} />
                ) : (
                  <div className="h-56 w-full bg-slate-100 flex items-center justify-center text-slate-400">Tidak ada poster</div>
                )}
                <div className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-800">{m.title}</h3>
                      <p className="text-sm text-slate-500">{m.year || '-'} • {(m.genres||[]).join(', ')}</p>
                    </div>
                    <span className="text-sm bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded">{m.rating ?? '-'}</span>
                  </div>
                  {m.description && <p className="mt-2 text-sm text-slate-600 line-clamp-3">{m.description}</p>}
                  <div className="mt-3 flex justify-end">
                    <button onClick={()=>handleDelete(m.id)} className="text-red-600 hover:text-red-700 text-sm">Hapus</button>
                  </div>
                </div>
              </div>
            ))
          )}
        </section>
      </div>
    </div>
  )
}

export default App
