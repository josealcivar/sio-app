import { useState } from "react"
import {
  citasHoy,
  fechaHoyTexto,
  // citasSemana,
  // totalReactivar,
  // totalRecordatorios,
  proximaCita,
} from "@/lib/datos"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"

export default function Hoy() {
  const [vinieron, setVinieron] = useState<string[]>([])

  const atendidas = vinieron.length
  const total = citasHoy.length
  const progreso = total > 0 ? (atendidas / total) * 100 : 0
  const proxima = proximaCita(vinieron)

  return (
    <div className="p-5">
      <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
        {fechaHoyTexto()}
      </p>
      <h1 className="font-serif text-3xl font-semibold mb-4">Hoy</h1>

      {/* card de avance del día */}
      <div className="bg-card border rounded-2xl p-3 mb-2">
        <div className="flex justify-between items-center mb-2">
          <span className="font-medium">Avance del día</span>
          <span className="text-sm text-muted-foreground">
            <span className="font-serif text-xl font-semibold text-foreground">{atendidas}</span> de {total} atendidas
          </span>
        </div>
<div className="h-1.5 rounded-full bg-muted overflow-hidden">
          <div
            className="h-full rounded-full bg-honey transition-all duration-300"
            style={{ width: `${progreso}%` }}
          />
        </div>
        {proxima ? (
          <p className="text-sm text-muted-foreground mt-2">
            Próxima cita · <span className="font-semibold text-foreground">{proxima.hora}</span> {proxima.nombre}
          </p>
        ) : (
          <p className="text-sm text-muted-foreground mt-2">
            ✓ Todas las citas de hoy atendidas
          </p>
        )}
      </div>

      {/* tres tarjetas de resumen */}
      {/* <div className="grid grid-cols-3 gap-2 mb-6">
        <Link to="/agenda" className="bg-card border rounded-2xl p-2">
          <p className="font-serif text-2xl font-semibold">{citasSemana()}</p>
          <p className="text-xs text-muted-foreground mt-0.5">citas esta semana</p>
        </Link>
        <Link to="/reactivar" className="bg-card border rounded-2xl p-2">
          <p className="font-serif text-2xl font-semibold text-honey">{totalReactivar()}</p>
          <p className="text-xs text-muted-foreground mt-0.5">clientes reactivar</p>
        </Link>
        <Link to="/recordatorios" className="bg-card border rounded-2xl p-2">
          <p className="font-serif text-2xl font-semibold">{totalRecordatorios()}</p>
          <p className="text-xs text-muted-foreground mt-0.5">recordatorios</p>
        </Link>
      </div> */}

      {/* citas de hoy */}
      <div className="flex items-center justify-between mb-3">
        <p className="text-muted-foreground">{total} citas hoy</p>
        <Link to="/agenda">
          <Button size="sm">+ Agendar cita</Button>
        </Link>
      </div>

      <div className="space-y-2">
        {citasHoy.map((cita) => {
          const vino = vinieron.includes(cita.id)
          return (
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
              <Button
                variant={vino ? "secondary" : "default"}
                size="sm"
                disabled={vino}
                onClick={() => setVinieron([...vinieron, cita.id])}
                className="shrink-0"
              >
                {vino ? "✓ Vino" : "Vino"}
              </Button>
            </div>
          )
        })}
      </div>
    </div>
  )
}