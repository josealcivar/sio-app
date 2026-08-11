import { useState } from "react"
import {  citasManana } from "@/lib/datos"
import { mensajeRecordatorio } from "@/lib/mensajes"

import HojaWhatsApp, { type DatosHoja } from "@/components/HojaWhatsapp"

export default function Recordatorios() {
  const [hoja, setHoja] = useState<DatosHoja | null>(null)

  return (
    <div className="p-5">
      <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
        Jueves 13 de agosto
      </p>
      <h1 className="font-serif text-3xl font-semibold">Recordar</h1>
      <p className="text-muted-foreground mb-5">Citas de mañana · avisa un día antes</p>

<div className="space-y-2">
        {citasManana.map((cita) => (
          <div
            key={cita.id}
            className="bg-card border rounded-2xl p-4 flex flex-row items-center gap-4"
          >
            <span className="font-serif text-lg font-semibold text-primary w-14 shrink-0">
              {cita.hora}
            </span>
            <div className="flex-1 min-w-0">
              <p className="font-semibold">{cita.nombre}</p>
              <p className="text-sm text-muted-foreground truncate">{cita.servicio}</p>
            </div>
            <button
              onClick={() =>
                setHoja({
                  titulo: "Recordatorio de cita",
                  nombre: cita.nombre,
                  telefono: "593982338227",
                  mensaje: mensajeRecordatorio(cita.nombre, cita.hora),
                })
              }
              className="rounded-lg bg-[#25623f] text-white text-sm font-semibold px-3 py-2 shrink-0"
            >
              Recordar
            </button>
          </div>
        ))}
      </div>



      <HojaWhatsApp datos={hoja} onClose={() => setHoja(null)} />
    </div>
  )
}