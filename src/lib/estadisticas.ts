// ============================================================
//  src/lib/estadisticas.ts
//  Agrega este archivo nuevo a tu carpeta src/lib/
// ============================================================

import { supabase } from "./supabase"

// ⚠️ Precio promedio por servicio, en dólares.
// Es una suposición temporal: cuando exista la tabla `servicios`
// con precios reales, este número sale de ahí.
export const PRECIO_PROMEDIO = 30

export type MesStats = {
  anio: number
  mes: number
  citas: number
  recup: number
  nuevas: number
  canc: number
  programadas: number   // ← nuevo
}

// Convierte "2026-09-21" a {anio, mes, dia} sin que la zona horaria lo corra
function partes(fechaISO: string) {
  const [y, m, d] = fechaISO.split("-").map(Number)
  return { anio: y, mes: m - 1, dia: d }
}

function clave(anio: number, mes: number) {
  return `${anio}-${mes}`
}

function diasEntre(a: string, b: string) {
  const pa = partes(a),
    pb = partes(b)
  const da = Date.UTC(pa.anio, pa.mes, pa.dia)
  const db = Date.UTC(pb.anio, pb.mes, pb.dia)
  return Math.round((db - da) / 86400000)
}

/**
 * Devuelve una fila por mes, ordenada del más antiguo al más reciente.
 * Trae todo y calcula en el navegador: para un salón con unos miles de
 * citas va perfecto. Si algún día crece mucho, esto se mueve a una vista
 * o función en Postgres.
 */
export async function obtenerEstadisticas(): Promise<MesStats[]> {
  const [resCitas, resClientes] = await Promise.all([
    supabase.from("citas").select("fecha, estado, cliente_id"),
    supabase.from("clientes").select("id, cadencia_semanas, created_at").eq("activo", true),
    
  ])

  if (resCitas.error) throw resCitas.error
  if (resClientes.error) throw resClientes.error

  const citas = resCitas.data ?? []
  const clientes = resClientes.data ?? []

  // ciclo de cada clienta, para saber cuándo una visita es "recuperación"
  const ciclo = new Map<string, number>()
  clientes.forEach((c: any) => ciclo.set(c.id, c.cadencia_semanas ?? 5))

  const mapa = new Map<string, MesStats>()
  const fila = (anio: number, mes: number) => {
    const k = clave(anio, mes)
    if (!mapa.has(k))
      mapa.set(k, { anio, mes, citas: 0, recup: 0, nuevas: 0, canc: 0, programadas: 0 })
    return mapa.get(k)!
  }

  // --- atendidas y canceladas ---
  citas.forEach((c: any) => {
    if (!c.fecha) return
    const p = partes(c.fecha)
    fila(p.anio, p.mes).programadas++  
    if (c.estado === "vino") fila(p.anio, p.mes).citas++
    if (c.estado === "cancelada") fila(p.anio, p.mes).canc++
  })

  // --- recuperadas: visita que llega después de pasarse del ciclo ---
  const porCliente = new Map<string, string[]>()
  citas
    .filter((c: any) => c.estado === "vino" && c.fecha && c.cliente_id)
    .forEach((c: any) => {
      const arr = porCliente.get(c.cliente_id) ?? []
      arr.push(c.fecha)
      porCliente.set(c.cliente_id, arr)
    })

  porCliente.forEach((fechas, clienteId) => {
    fechas.sort() // formato ISO ordena bien como texto
    const semanas = ciclo.get(clienteId) ?? 5
    for (let i = 1; i < fechas.length; i++) {
      const brecha = diasEntre(fechas[i - 1], fechas[i]) / 7
      if (brecha > semanas) {
        const p = partes(fechas[i])
        fila(p.anio, p.mes).recup++
      }
    }
  })

  // --- clientas nuevas ---
  clientes.forEach((c: any) => {
    if (!c.created_at) return
    const d = new Date(c.created_at)
    fila(d.getFullYear(), d.getMonth()).nuevas++
  })

  // ordenar cronológicamente
  return [...mapa.values()].sort((a, b) =>
    a.anio !== b.anio ? a.anio - b.anio : a.mes - b.mes
  )
}

/** Cuántas clientas están dormidas AHORA (para la alerta del final) */
export async function contarPorReactivar(): Promise<number> {
  const { data, error } = await supabase
    .from("clientes")
    .select("id, cadencia_semanas, citas(fecha, estado)")
    .eq("activo", true)

  if (error) throw error

  const hoy = new Date()
  let n = 0

  ;(data ?? []).forEach((c: any) => {
    const visitas = (c.citas ?? [])
      .filter((x: any) => x.estado === "vino")
      .map((x: any) => x.fecha)
      .sort()
    if (!visitas.length) return
    const ultima = visitas[visitas.length - 1]
    const p = partes(ultima)
    const dias = Math.round(
      (Date.UTC(hoy.getFullYear(), hoy.getMonth(), hoy.getDate()) -
        Date.UTC(p.anio, p.mes, p.dia)) /
        86400000
    )
    if (dias / 7 > (c.cadencia_semanas ?? 5)) n++
  })

  return n
}