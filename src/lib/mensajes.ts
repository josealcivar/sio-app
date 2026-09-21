export function mensajeReactivar(nombre: string, semanas: number): string {
  return `Hola ${nombre} 💆 Ya pasaron ${semanas} semanas de tu última ` +
    `limpieza facial. Tu piel pide su cita — ¿te agendo esta semana?`
}


// export function mensajeRecordatorio(nombre: string, hora: string): string {
//   return `Hola ${nombre} 😊 Te recuerdo tu cita de mañana a las ${hora} ` +
//     `para tu limpieza facial. ¿Me confirmas?`
// }

// export function mensajeRecordatorio(nombre: string, hora: string, fecha: string): string {
//   const dia = new Date(fecha + "T00:00:00").toLocaleDateString("es-EC", {
//     weekday: "long",
//     day: "numeric",
//     month: "long",
//   })
//   return `Hola ${nombre} 😊 Te recuerdo tu cita el ${dia} a las ${hora} ` +
//     `para tu limpieza facial. ¿Me confirmas?`
// }

export function mensajeRecordatorio(nombre: string, hora: string, fecha: string): string {
  const dia = new Date(fecha + "T00:00:00").toLocaleDateString("es-EC", {
    weekday: "long",
    day: "numeric",
    month: "long",
  })

  // ¿la fecha de la cita es mañana?
  const manana = new Date()
  manana.setDate(manana.getDate() + 1)
  const mananaISO = `${manana.getFullYear()}-${String(manana.getMonth() + 1).padStart(2, "0")}-${String(manana.getDate()).padStart(2, "0")}`
  const esManana = fecha === mananaISO

  const cuando = esManana ? `mañana ${dia}` : `el ${dia}`

  return `Hola ${nombre} 😊 Te recuerdo tu cita ${cuando} a las ${hora} ` +
    `para tu limpieza facial. ¿Me confirmas?`
}



export function linkWhatsApp(telefono: string, texto: string): string {
  return `https://wa.me/${telefono}?text=${encodeURIComponent(texto)}`
}


export function mensajeConfirmacion(nombre: string, hora: string, fecha: string): string {
  const dia = new Date(fecha + "T00:00:00").toLocaleDateString("es-EC", {
    weekday: "long",
    day: "numeric",
    month: "long",
  })
  return `¡Listo ${nombre}! 💆 Acabo de agendarte para tu limpieza facial el ${dia} a las ${hora}. ¡Te espero!`
}