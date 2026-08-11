export function mensajeReactivar(nombre: string, semanas: number): string {
  return `Hola ${nombre} 💆 Ya pasaron ${semanas} semanas de tu última ` +
    `limpieza facial. Tu piel pide su cita — ¿te agendo esta semana?`
}


export function mensajeRecordatorio(nombre: string, hora: string): string {
  return `Hola ${nombre} 😊 Te recuerdo tu cita de mañana a las ${hora} ` +
    `para tu limpieza facial. ¿Me confirmas?`
}

export function linkWhatsApp(telefono: string, texto: string): string {
  return `https://wa.me/${telefono}?text=${encodeURIComponent(texto)}`
}