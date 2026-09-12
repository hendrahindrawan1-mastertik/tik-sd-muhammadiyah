"use client"

import { useEffect, useState } from "react"
import { LogIn, Trash2, Plus } from "lucide-react"
import { supabase, type SoalUTS } from "@/lib/supabase/client"

type Opsi = "a" | "b" | "c" | "d"

export function GuruSoalUTSClient() {
  const [masuk, setMasuk] = useState(false)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [errorLogin, setErrorLogin] = useState<string | null>(null)
  const [loadingLogin, setLoadingLogin] = useState(false)

  const [kelas, setKelas] = useState<4 | 5 | 6>(4)
  const [daftar, setDaftar] = useState<SoalUTS[]>([])
  const [memuat, setMemuat] = useState(false)

  const [pertanyaan, setPertanyaan] = useState("")
  const [pilihanA, setPilihanA] = useState("")
  const [pilihanB, setPilihanB] = useState("")
  const [pilihanC, setPilihanC] = useState("")
  const [pilihanD, setPilihanD] = useState("")
  const [jawabanBenar, setJawabanBenar] = useState<Opsi>("a")
  const [menyimpan, setMenyimpan] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const muatDaftar = async (k: 4 | 5 | 6) => {
    setMemuat(true)
    const { data } = await supabase
      .from("soal_uts")
      .select("*")
      .eq("kelas", k)
      .order("nomor", { ascending: true })
    setDaftar(data ?? [])
    setMemuat(false)
  }

  useEffect(() => {
    if (masuk) muatDaftar(kelas)
  }, [masuk, kelas])

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

  const resetForm = () => {
    setPertanyaan("")
    setPilihanA("")
    setPilihanB("")
    setPilihanC("")
    setPilihanD("")
    setJawabanBenar("a")
  }

  const tambahSoal = async () => {
    setError(null)
    if (!pertanyaan.trim() || !pilihanA.trim() || !pilihanB.trim() || !pilihanC.trim() || !pilihanD.trim()) {
      setError("Semua kolom wajib diisi")
      return
    }

    setMenyimpan(true)
    const nomorBaru = daftar.length > 0 ? Math.max(...daftar.map((s) => s.nomor)) + 1 : 1

    const { error: insertError } = await supabase.from("soal_uts").insert({
      kelas,
      nomor: nomorBaru,
      pertanyaan: pertanyaan.trim(),
      pilihan_a: pilihanA.trim(),
      pilihan_b: pilihanB.trim(),
      pilihan_c: pilihanC.trim(),
      pilihan_d: pilihanD.trim(),
      jawaban_benar: jawabanBenar,
    })
    setMenyimpan(false)

    if (insertError) {
      setError("Gagal menyimpan: " + insertError.message)
      return
    }

    resetForm()
    muatDaftar(kelas)
  }

  const hapusSoal = async (id: string) => {
    if (!confirm("Hapus soal ini?")) return
    await supabase.from("soal_uts").delete().eq("id", id)
    muatDaftar(kelas)
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
    <div>
      <div className="mb-6 flex items-center gap-3">
        <label className="text-sm font-semibold">Kelas:</label>
        <select
          value={kelas}
          onChange={(e) => setKelas(Number(e.target.value) as 4 | 5 | 6)}
          className="rounded-xl border border-border px-4 py-2 text-sm outline-none focus:border-brand-blue"
        >
          <option value={4}>Kelas 4</option>
          <option value={5}>Kelas 5</option>
          <option value={6}>Kelas 6</option>
        </select>
        <span className="text-sm text-brand-muted">{daftar.length} soal tersimpan</span>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <div className="rounded-3xl border border-border bg-card p-6">
          <h3 className="mb-4 text-lg font-bold">Tambah Soal Baru</h3>

          <label className="mb-1.5 block text-sm font-semibold">Pertanyaan</label>
          <textarea
            value={pertanyaan}
            onChange={(e) => setPertanyaan(e.target.value)}
            rows={2}
            className="mb-4 w-full rounded-xl border border-border px-4 py-2.5 text-base outline-none focus:border-brand-blue"
          />

          {(
            [
              ["a", pilihanA, setPilihanA],
              ["b", pilihanB, setPilihanB],
              ["c", pilihanC, setPilihanC],
              ["d", pilihanD, setPilihanD],
            ] as [Opsi, string, (v: string) => void][]
          ).map(([opsi, value, setValue]) => (
            <div key={opsi} className="mb-3 flex items-center gap-2">
              <span className="w-6 text-sm font-bold uppercase text-brand-muted">{opsi}.</span>
              <input
                type="text"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder={`Pilihan ${opsi.toUpperCase()}`}
                className="w-full rounded-xl border border-border px-4 py-2 text-sm outline-none focus:border-brand-blue"
              />
            </div>
          ))}

          <label className="mb-1.5 mt-2 block text-sm font-semibold">Jawaban Benar</label>
          <div className="mb-4 flex gap-2">
            {(["a", "b", "c", "d"] as Opsi[]).map((opsi) => (
              <button
                key={opsi}
                onClick={() => setJawabanBenar(opsi)}
                className={`h-9 w-9 rounded-lg text-sm font-bold uppercase ${
                  jawabanBenar === opsi
                    ? "bg-brand-blue text-white"
                    : "border border-border text-brand-muted hover:bg-slate-50"
                }`}
              >
                {opsi}
              </button>
            ))}
          </div>

          {error && <p className="mb-4 text-sm text-red-500">{error}</p>}

          <button
            disabled={menyimpan}
            onClick={tambahSoal}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand-blue px-5 py-3 text-sm font-semibold text-white disabled:opacity-40"
          >
            <Plus className="h-4 w-4" />
            {menyimpan ? "Menyimpan..." : "Tambah Soal"}
          </button>
        </div>

        <div>
          <h3 className="mb-4 text-lg font-bold">Daftar Soal Kelas {kelas}</h3>
          {memuat ? (
            <p className="text-brand-muted">Memuat...</p>
          ) : daftar.length === 0 ? (
            <p className="text-brand-muted">Belum ada soal UTS untuk kelas ini.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {daftar.map((s) => (
                <div key={s.id} className="rounded-2xl border border-border bg-card p-4">
                  <div className="mb-1 flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-brand-blue">No. {s.nomor}</span>
                    <button
                      onClick={() => hapusSoal(s.id)}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-red-500"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Hapus
                    </button>
                  </div>
                  <p className="mb-1 text-sm font-semibold">{s.pertanyaan}</p>
                  <p className="text-xs text-brand-muted">
                    Jawaban benar: <span className="font-bold uppercase">{s.jawaban_benar}</span>
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
