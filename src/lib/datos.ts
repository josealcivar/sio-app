export type Cliente = {
  id: string
  nombre: string
  telefono: string // formato wa.me: 5215512345678
  cadenciaSemanas: number
  ultimaVisita: string | null // ISO: "2026-06-15"
  observaciones: string
}

export type Cita = {
  id: string
  nombre: string
  hora: string
  servicio: string
}

// Devuelve la fecha de hace N semanas, en formato ISO (YYYY-MM-DD)
function haceSemanas(n: number): string {
  const d = new Date()
  d.setDate(d.getDate() - n * 7)
  return d.toISOString().slice(0, 10)
}

// --- Datos de ejemplo (se reemplazan por Supabase después) ---
export const citasHoy: Cita[] = [
  { id: "1", nombre: "Daniela Cruz", hora: "10:00", servicio: "Limpieza facial profunda" },
  { id: "2", nombre: "Paula Herrera", hora: "11:30", servicio: "Limpieza + hidratación" },
  { id: "3", nombre: "Mónica Vega", hora: "15:00", servicio: "Primera cita · valoración" },
  { id: "4", nombre: "Andrea Solís", hora: "16:30", servicio: "Limpieza facial profunda" },
]

export const clientes: Cliente[] = [
  { id: "a", nombre: "Sofía Ramírez", telefono: "593987000001", cadenciaSemanas: 5, ultimaVisita: haceSemanas(9), observaciones: "Piel sensible. Prefiere productos sin fragancia." },
  { id: "b", nombre: "Mariana Ortega", telefono: "593987000002", cadenciaSemanas: 5, ultimaVisita: haceSemanas(7), observaciones: "Vino por manchas. Sesiones de despigmentación." },
  { id: "c", nombre: "Valeria Ríos", telefono: "593987000003", cadenciaSemanas: 6, ultimaVisita: haceSemanas(8), observaciones: "" },
]

export const citasManana: Cita[] = [
  { id: "m1", nombre: "Lucía Fernández", hora: "10:00", servicio: "Limpieza facial profunda" },
  { id: "m2", nombre: "Carla Mendoza", hora: "12:00", servicio: "Limpieza + hidratación" },
  { id: "m3", nombre: "Renata Díaz", hora: "17:00", servicio: "Limpieza facial profunda" },
]

// --- Cálculos ---
export function semanasDesde(fechaISO: string | null): number {
  if (!fechaISO) return 0
  const ms = Date.now() - new Date(fechaISO).getTime()
  return Math.floor(ms / (1000 * 60 * 60 * 24 * 7))
}

export function semanasAtraso(c: Cliente): number {
  return semanasDesde(c.ultimaVisita) - c.cadenciaSemanas
}