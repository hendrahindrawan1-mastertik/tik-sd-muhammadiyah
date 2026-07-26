import { supabase, type Materi } from "./client"

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
