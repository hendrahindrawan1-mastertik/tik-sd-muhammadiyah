"use client"

import { useEffect, useState } from "react"
import { LogIn, Trash2, Upload } from "lucide-react"
import { supabase, type Tugas } from "@/lib/supabase/client"

export function GuruTugasClient() {
  const [masuk, setMasuk] = useState(false)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [errorLogin, setErrorLogin] = useState<string | null>(null)
  const [loadingLogin, setLoadingLogin] = useState(false)

  const [kelas, setKelas] = useState<"4" | "5" | "6">("4")
  const [judul, setJudul] = useState("")
  const [deskripsi, setDeskripsi] = useState("")
  const [linkUrl, setLinkUrl] = useState("")
  const [tenggat, setTenggat] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [menyimpan, setMenyimpan] = useState(false)
  const [pesan, setPesan] = useState<string | null>(null)
  const [errorForm, setErrorForm] = useState<string | null>(null)

  const [daftar, setDaftar] = useState<Tugas[]>([])

  const muatDaftar = async () => {
    const { data } = await supabase
      .from("tugas")
      .select("*")
      .order("kelas", { ascending: true })
      .order("created_at", { ascending: false })
    setDaftar(data ?? [])
  }

  useEffect(() => {
    if (masuk) muatDaftar()
  }, [masuk])

  const handleLogin = async () => {
    setErrorLogin(null)
    setLoadingLogin(true)
    const { data, error } = await supabase.rpc("verify_guru_login", {
      u: username.trim(),
      pw: password,
    })
    setLoadingLogin(false)
    if (error || !data) {
      setErrorLogin("Username atau password salah")
      return
    }
    setMasuk(true)
  }

  const handleTambah = async () => {
    setErrorForm(null)
    setPesan(null)

    if (judul.trim().length === 0) {
      setErrorForm("Judul tugas wajib diisi")
      return
    }
    if (!file && linkUrl.trim().length === 0) {
      setErrorForm("Isi minimal salah satu: upload PDF atau isi link tugas")
      return
    }

    setMenyimpan(true)

    let pdfUrl: string | null = null
    if (file) {
      const namaFile = `${Date.now()}-${file.name}`
      const { error: uploadError } = await supabase.storage.from("tugas").upload(namaFile, file)
      if (uploadError) {
        setMenyimpan(false)
        setErrorForm("Gagal upload PDF: " + uploadError.message)
        return
      }
      const { data: publicUrlData } = supabase.storage.from("tugas").getPublicUrl(namaFile)
      pdfUrl = publicUrlData.publicUrl
    }

    const { error: insertError } = await supabase.from("tugas").insert({
      kelas: Number(kelas),
      judul: judul.trim(),
      deskripsi: deskripsi.trim() || null,
      pdf_url: pdfUrl,
      link_url: linkUrl.trim() || null,
      tenggat: tenggat || null,
    })

    setMenyimpan(false)

    if (insertError) {
      setErrorForm("Gagal simpan tugas: " + insertError.message)
      return
    }

    setPesan("Tugas berhasil ditambahkan!")
    setJudul("")
    setDeskripsi("")
    setLinkUrl("")
    setTenggat("")
    setFile(null)
    muatDaftar()
  }

  const handleHapus = async (id: string) => {
    if (!confirm("Hapus tugas ini?")) return
    await supabase.from("tugas").delete().eq("id", id)
    muatDaftar()
  }

  if (!masuk) {
    return (
      <div className="mx-auto max-w-sm rounded-3xl border border-border bg-card p-6">
        <h2 className="mb-1 text-xl font-bold">Login Guru</h2>
        <p className="mb-5 text-sm text-brand-muted">Khusus untuk guru pengampu</p>

        <label className="mb-1.5 block text-sm font-semibold">Username</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="mb-4 w-full rounded-xl border border-border px-4 py-2.5 text-base outline-none focus:border-brand-blue"
        />

        <label className="mb-1.5 block text-sm font-semibold">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-4 w-full rounded-xl border border-border px-4 py-2.5 text-base outline-none focus:border-brand-blue"
        />

        {errorLogin && <p className="mb-4 text-sm text-red-500">{errorLogin}</p>}

        <button
          disabled={loadingLogin}
          onClick={handleLogin}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand-blue px-5 py-3 text-sm font-semibold text-white disabled:opacity-40"
        >
          <LogIn className="h-4 w-4" />
          {loadingLogin ? "Memeriksa..." : "Masuk"}
        </button>
      </div>
    )
  }

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <div className="rounded-3xl border border-border bg-card p-6">
        <h3 className="mb-4 text-lg font-bold">Tambah Tugas Baru</h3>

        <label className="mb-1.5 block text-sm font-semibold">Kelas</label>
        <select
          value={kelas}
          onChange={(e) => setKelas(e.target.value as "4" | "5" | "6")}
          className="mb-4 w-full rounded-xl border border-border px-4 py-2.5 text-base outline-none focus:border-brand-blue"
        >
          <option value="4">Kelas 4</option>
          <option value="5">Kelas 5</option>
          <option value="6">Kelas 6</option>
        </select>

        <label className="mb-1.5 block text-sm font-semibold">Judul Tugas</label>
        <input
          type="text"
          value={judul}
          onChange={(e) => setJudul(e.target.value)}
          placeholder="Contoh: Tugas Mengenal Komputer"
          className="mb-4 w-full rounded-xl border border-border px-4 py-2.5 text-base outline-none focus:border-brand-blue"
        />

        <label className="mb-1.5 block text-sm font-semibold">Deskripsi (opsional)</label>
        <textarea
          value={deskripsi}
          onChange={(e) => setDeskripsi(e.target.value)}
          rows={3}
          className="mb-4 w-full rounded-xl border border-border px-4 py-2.5 text-base outline-none focus:border-brand-blue"
        />

        <label className="mb-1.5 block text-sm font-semibold">Upload File PDF (opsional)</label>
        <input
          type="file"
          accept="application/pdf"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          className="mb-4 w-full text-sm"
        />

        <label className="mb-1.5 block text-sm font-semibold">Atau Link Tugas (opsional, misal Google Form)</label>
        <input
          type="text"
          value={linkUrl}
          onChange={(e) => setLinkUrl(e.target.value)}
          placeholder="https://forms.gle/..."
          className="mb-4 w-full rounded-xl border border-border px-4 py-2.5 text-base outline-none focus:border-brand-blue"
        />

        <label className="mb-1.5 block text-sm font-semibold">Batas Waktu (opsional)</label>
        <input
          type="date"
          value={tenggat}
          onChange={(e) => setTenggat(e.target.value)}
          className="mb-4 w-full rounded-xl border border-border px-4 py-2.5 text-base outline-none focus:border-brand-blue"
        />

        {errorForm && <p className="mb-4 text-sm text-red-500">{errorForm}</p>}
        {pesan && <p className="mb-4 text-sm text-brand-green">{pesan}</p>}

        <button
          disabled={menyimpan}
          onClick={handleTambah}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand-blue px-5 py-3 text-sm font-semibold text-white disabled:opacity-40"
        >
          <Upload className="h-4 w-4" />
          {menyimpan ? "Menyimpan..." : "Tambah Tugas"}
        </button>
      </div>

      <div>
        <h3 className="mb-4 text-lg font-bold">Daftar Tugas</h3>
        {daftar.length === 0 ? (
          <p className="text-brand-muted">Belum ada tugas.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {daftar.map((t) => (
              <div key={t.id} className="rounded-2xl border border-border bg-card p-4">
                <div className="mb-1 flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-brand-blue">Kelas {t.kelas}</span>
                  <button
                    onClick={() => handleHapus(t.id)}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-red-500"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Hapus
                  </button>
                </div>
                <p className="text-sm font-bold">{t.judul}</p>
                {t.tenggat && (
                  <p className="text-xs text-brand-muted">Batas: {t.tenggat}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}