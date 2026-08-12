import { useState, useEffect } from "react"
import { fechaMananaTexto } from "@/lib/datos"
import { obtenerCitasManana } from "@/lib/api"
import { mensajeRecordatorio } from "@/lib/mensajes"
import HojaWhatsApp, { type DatosHoja } from "@/components/HojaWhatsApp"

type CitaManana = {
  id: string
  nombre: string
  telefono: string
  hora: string
  servicio: string
}

export default function Recordatorios() {
  const [hoja, setHoja] = useState<DatosHoja | null>(null)
  const [citas, setCitas] = useState<CitaManana[]>([])
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    obtenerCitasManana()
      .then((data) =>
        setCitas(
          data.map((c:any) => ({
            id: c.id,
            nombre: c.nombre,
            telefono: c.telefono,
            hora: c.hora,
            servicio: c.servicio,
          }))
        )
      )
      .catch(console.error)
      .finally(() => setCargando(false))
  }, [])

  return (
    <div className="p-5">
      <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
        {fechaMananaTexto()}
      </p>
      <h1 className="font-serif text-3xl font-semibold">Recordar</h1>
      <p className="text-muted-foreground mb-5">Citas de mañana · avisa un día antes</p>

      {cargando ? (
        <p className="text-center text-muted-foreground py-8">Cargando…</p>
      ) : citas.length === 0 ? (
        <p className="text-center text-muted-foreground py-8">
          No hay citas para mañana
        </p>
      ) : (
        <div className="space-y-2">
          {citas.map((cita) => (
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
                    telefono: cita.telefono,
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
      )}

      <HojaWhatsApp datos={hoja} onClose={() => setHoja(null)} />
    </div>
  )
}