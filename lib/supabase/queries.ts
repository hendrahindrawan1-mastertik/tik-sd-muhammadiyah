import { supabase, type Materi, type Soal, type Tugas } from "./client"
export async function getMateriByKelas(kelas: 4 | 5 | 6): Promise<Materi[]> {
  const { data, error } = await supabase
    .from("materi")
    .select("*")
    .eq("kelas", kelas)
    .order("urutan", { ascending: true })

  if (error) {
    console.error("Gagal mengambil materi:", error.message)
    return []
  }

  return data ?? []
}
export async function getAllVideos(): Promise<Materi[]> {
  const { data, error } = await supabase
    .from("materi")
    .select("*")
    .not("video_url", "is", null)
    .order("kelas", { ascending: true })
    .order("urutan", { ascending: true })

  if (error) {
    console.error("Gagal mengambil video:", error.message)
    return []
  }

  return data ?? []
}
export async function getSoalByKelas(kelas: 4 | 5 | 6): Promise<Soal[]> {
  const { data, error } = await supabase
    .from("soal")
    .select("*")
    .eq("kelas", kelas)
    .order("urutan", { ascending: true })

  if (error) {
    console.error("Gagal mengambil soal:", error.message)
    return []
  }

  return data ?? []
}
export async function getTugasByKelas(kelas: 4 | 5 | 6): Promise<Tugas[]> {
  const { data, error } = await supabase
    .from("tugas")
    .select("*")
    .eq("kelas", kelas)
    .order("urutan", { ascending: true })

  if (error) {
    console.error("Gagal mengambil tugas:", error.message)
    return []
  }

  return data ?? []
}