import { useState } from "react"
import { clientes, semanasDesde, semanasAtraso } from "@/lib/datos"
import { mensajeReactivar } from "@/lib/mensajes"
import HojaWhatsApp, { type DatosHoja } from "@/components/HojaWhatsapp"

export default function Reactivar() {
  const [hoja, setHoja] = useState<DatosHoja | null>(null)
  const dormidos = clientes.filter((c) => semanasAtraso(c) > 0)

  return (
    <div className="p-5">
      <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
        Recuperar clientes
      </p>
      <h1 className="font-serif text-3xl font-semibold">Reactivar</h1>
      <p className="text-muted-foreground mb-5">
        Pasaron su ciclo y no tienen cita agendada
      </p>

      <div className="space-y-2">
        {dormidos.map((c) => {
          const semanas = semanasDesde(c.ultimaVisita)
          const inicial = c.nombre.charAt(0).toUpperCase()

          return (
            <div key={c.id} className="bg-card border rounded-2xl p-4">
              <div className="flex items-center gap-3">
                {/* avatar */}
                <div className="w-10 h-10 rounded-full bg-honey-soft text-honey grid place-items-center font-serif font-semibold shrink-0">
                  {inicial}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold truncate">{c.nombre}</p>
                  <p className="text-sm text-muted-foreground">
                    Sin venir hace {semanas} semanas
                  </p>
                </div>
                <button
                  onClick={() =>
                    setHoja({
                      titulo: "Invitar a volver",
                      nombre: c.nombre,
                      telefono: c.telefono,
                      mensaje: mensajeReactivar(c.nombre, semanas),
                    })
                  }
                  className="rounded-lg bg-[#25623f] text-white text-sm font-semibold px-4 py-2 shrink-0"
                >
                  Escribir
                </button>
              </div>
            </div>
          )
        })}
      </div>

      <HojaWhatsApp datos={hoja} onClose={() => setHoja(null)} />
    </div>
  )
}