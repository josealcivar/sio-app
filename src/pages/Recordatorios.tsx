import { useState, useEffect } from "react"
import { fechaLocalISO } from "@/lib/datos"
import { obtenerCitasPorFecha } from "@/lib/api"
import { mensajeRecordatorio } from "@/lib/mensajes"
import HojaWhatsApp, { type DatosHoja } from "@/components/HojaWhatsApp"

type CitaRec = {
  id: string
  nombre: string
  telefono: string
  hora: string
  servicio: string
}

export default function Recordatorios() {
  const [hoja, setHoja] = useState<DatosHoja | null>(null)
  const [fecha, setFecha] = useState(fechaLocalISO(1))
  const [citas, setCitas] = useState<CitaRec[]>([])
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    setCargando(true)
    obtenerCitasPorFecha(fecha)
      .then((data) =>
        setCitas(
          data.map((c: any) => ({
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
  }, [fecha])

  return (
    <div className="p-5">
      <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
        Recordatorios
      </p>
      <h1 className="font-serif text-3xl font-semibold mb-1">Recordar</h1>
      <p className="text-muted-foreground mb-4">Elige el día y avisa a tus clientas</p>

      <label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
        Fecha
      </label>
      <input
        type="date"
        value={fecha}
        min={fechaLocalISO(0)}
        onChange={(e) => setFecha(e.target.value)}
        className="w-full rounded-lg border bg-background p-3 text-base mt-1 mb-5"
      />

      {cargando ? (
        <p className="text-center text-muted-foreground py-8">Cargando…</p>
      ) : citas.length === 0 ? (
        <p className="text-center text-muted-foreground py-8">
          No hay citas para este día
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