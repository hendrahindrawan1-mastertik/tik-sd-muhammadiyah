import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    "NEXT_PUBLIC_SUPABASE_URL atau NEXT_PUBLIC_SUPABASE_ANON_KEY belum diatur. " +
      "Lihat .env.example untuk cara mengaturnya."
  )
}

// Client ini pakai "anon key" yang aman dipakai di sisi publik,
// karena tabel "materi" hanya bisa dibaca (select), tidak bisa diubah,
// berkat Row Level Security yang sudah diatur di supabase/schema.sql
export const supabase = createClient(
  supabaseUrl || "https://mxwovkiurrtatxgmxhgz.supabase.co",
  supabaseAnonKey || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im14d292a2l1cnJ0YXR4Z214aGd6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUwMDI2ODIsImV4cCI6MjEwMDU3ODY4Mn0.HBeP2UMgAmT7ZEMWKIAmY9p35WoVV0O8QFJbulklJSY"
)

export type Materi = {
  id: string
  kelas: 4 | 5 | 6
  judul: string
  deskripsi: string | null
  video_url: string | null
  urutan: number
  created_at: string
}
export type Soal = {
  id: string
  kelas: 4 | 5 | 6
  pertanyaan: string
  pilihan_a: string
  pilihan_b: string
  pilihan_c: string
  pilihan_d: string
  jawaban_benar: "a" | "b" | "c" | "d"
  urutan: number
}