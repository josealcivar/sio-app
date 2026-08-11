import { useState } from "react"
import { clientes, semanasDesde, semanasAtraso } from "@/lib/datos"
import { mensajeReactivar } from "@/lib/mensajes"
import { Card } from "@/components/ui/card"
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

      <div className="space-y-3">
        {dormidos.map((c) => {
          const semanas = semanasDesde(c.ultimaVisita)
          const atraso = semanasAtraso(c)
          const pct = Math.min((semanas / c.cadenciaSemanas) * 100, 100)
          const dueLine = Math.min((c.cadenciaSemanas / semanas) * 100, 100)
          const fondo = `linear-gradient(90deg, var(--primary) 0 ${dueLine}%, var(--honey) ${dueLine}% 100%)`

          return (
            <Card key={c.id} className="p-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-semibold">{c.nombre}</p>
                  <p className="text-sm text-muted-foreground">
                    Hace {semanas} sem · ciclo de {c.cadenciaSemanas}
                  </p>
                </div>
                <span className="text-xs font-semibold px-2 py-1 rounded-full bg-honey-soft text-honey">
                  +{atraso} sem
                </span>
              </div>

              <div className="mt-3">
                <div className="h-2 rounded-full bg-muted relative overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${pct}%`, background: fondo }}
                  />
                </div>
                <div className="flex justify-between mt-1.5 text-xs text-muted-foreground">
                  <span>Su ciclo: {c.cadenciaSemanas} semanas</span>
                  <span className="text-honey font-semibold">Atrasada {atraso} sem</span>
                </div>
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
                className="mt-3 w-full rounded-xl bg-[#25623f] text-white font-semibold py-3 text-sm"
              >
                Escribir por WhatsApp
              </button>
            </Card>
          )
        })}
      </div>

      <HojaWhatsApp datos={hoja} onClose={() => setHoja(null)} />
    </div>
  )
}