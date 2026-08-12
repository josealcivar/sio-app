import { supabase } from "./supabase"
import type { Cliente, } from "./datos"

// Trae todos los clientes del usuario logueado
export async function obtenerClientes(): Promise<Cliente[]> {
  const { data, error } = await supabase
    .from("clientes")
    .select("*, citas(fecha, estado)")
    .eq("activo", true)
    .order("nombre")

  if (error) throw error

  return (data ?? []).map((row: any) => {
    // última visita = la cita "vino" más reciente
    const visitas = (row.citas ?? [])
      .filter((c: any) => c.estado === "vino")
      .map((c: any) => c.fecha)
      .sort()
    const ultimaVisita = visitas.length ? visitas[visitas.length - 1] : null

    return {
      id: row.id,
      nombre: row.nombre,
      telefono: row.telefono,
      cadenciaSemanas: row.cadencia_semanas,
      ultimaVisita,
      observaciones: row.observaciones ?? "",
    }
  })
}

// Crea un cliente nuevo y devuelve el registro guardado
export async function crearCliente(datos: {
  nombre: string
  telefono: string
}): Promise<Cliente> {
  const { data, error } = await supabase
    .from("clientes")
    .insert({
      nombre: datos.nombre,
      telefono: datos.telefono,
      cadencia_semanas: 5,
    })
    .select()
    .single()

  if (error) throw error

  return {
    id: data.id,
    nombre: data.nombre,
    telefono: data.telefono,
    cadenciaSemanas: data.cadencia_semanas,
    ultimaVisita: null,
    observaciones: data.observaciones ?? "",
  }
}


// Actualiza teléfono y observaciones de un cliente
export async function actualizarCliente(
  id: string,
  cambios: { telefono: string; observaciones: string }
): Promise<void> {
  const { error } = await supabase
    .from("clientes")
    .update({
      telefono: cambios.telefono,
      observaciones: cambios.observaciones,
    })
    .eq("id", id)

  if (error) throw error
}


/**
 * se crea las citas
 */

 

// Crea una cita
export async function crearCita(datos: {
  clienteId: string
  fecha: string
  hora: string
  servicio: string
}): Promise<void> {
  const { error } = await supabase.from("citas").insert({
    cliente_id: datos.clienteId,
    fecha: datos.fecha,
    hora: datos.hora,
    servicio: datos.servicio,
    estado: "agendada",
  })
  if (error) throw error
}

// Trae las citas de una fecha, con el nombre del cliente
export async function obtenerCitasPorFecha(fecha: string) {
  const { data, error } = await supabase
    .from("citas")
    .select("id, fecha, hora, servicio, estado, cliente_id, clientes(nombre, telefono)")
    .eq("fecha", fecha)
    .order("hora")

  if (error) throw error

  return (data ?? []).map((row: any) => ({
    id: row.id,
    clienteId: row.cliente_id,
    nombre: row.clientes?.nombre ?? "—",
    telefono: row.clientes?.telefono ?? "",
    fecha: row.fecha,
    hora: row.hora,
    servicio: row.servicio,
    estado: row.estado,
  }))
}
// ahora viene la parte de marcar las citas como vino o no llegó 

// Trae las citas de hoy con nombre del cliente
export async function obtenerCitasHoy() {
  const hoy = new Date().toISOString().slice(0, 10)
  return obtenerCitasPorFecha(hoy)
}

// Marca una cita como "vino"
export async function marcarVino(citaId: string): Promise<void> {
  const { error } = await supabase
    .from("citas")
    .update({ estado: "vino" })
    .eq("id", citaId)
  if (error) throw error
}

// recordatorios
// Trae las citas de mañana con nombre del cliente
export async function obtenerCitasManana() {
  const d = new Date()
  d.setDate(d.getDate() + 1)
  const manana = d.toISOString().slice(0, 10)
  return obtenerCitasPorFecha(manana)
}


 