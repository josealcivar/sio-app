// Normaliza un teléfono ecuatoriano a formato internacional para wa.me
// 0982448557  ->  593982448557
export function normalizarTelefono(input: string): string {
  // deja solo dígitos (quita espacios, guiones, paréntesis, +)
  let n = input.replace(/\D/g, "")

  // si ya viene con código de país (593...), lo dejamos
  if (n.startsWith("593")) return n

  // si empieza con 0 (formato local: 0982...), quitamos el 0 y anteponemos 593
  if (n.startsWith("0")) return "593" + n.slice(1)

  // si son 9 dígitos sin 0 ni código (982448557), anteponemos 593
  if (n.length === 9) return "593" + n

  // cualquier otro caso, lo devolvemos como está (por si ya está bien)
  return n
}

// Valida que el resultado tenga pinta de número ecuatoriano correcto
export function telefonoValido(e164: string): boolean {
  // 593 + 9 dígitos = 12 dígitos
  return /^593\d{9}$/.test(e164)
}