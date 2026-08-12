import { useState } from "react"
import { supabase } from "@/lib/supabase"

export default function Cabecera() {
  const [menuAbierto, setMenuAbierto] = useState(false)

  async function cerrarSesion() {
    await supabase.auth.signOut()
    // el listener de sesión en App.tsx detecta el cambio y muestra el Login
  }

  return (
    <header className="sticky top-0 z-30 bg-background px-5 py-3 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className="w-2.5 h-2.5 rounded-full bg-honey" />
        <span className="font-serif text-2xl font-semibold text-primary">Sio</span>
      </div>

      <div className="relative">
        <button
          onClick={() => setMenuAbierto(!menuAbierto)}
          className="w-9 h-9 rounded-full bg-primary text-primary-foreground grid place-items-center text-xs font-semibold"
        >
          RS
        </button>

        {menuAbierto && (
          <>
            {/* fondo invisible para cerrar al tocar afuera */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setMenuAbierto(false)}
            />
            <div className="absolute right-0 mt-2 w-44 bg-card border rounded-xl shadow-lg z-50 overflow-hidden">
              <button
                onClick={cerrarSesion}
                className="w-full text-left px-4 py-3 text-sm hover:bg-secondary text-destructive font-medium"
              >
                Cerrar sesión
              </button>
            </div>
          </>
        )}
      </div>
    </header>
  )
}