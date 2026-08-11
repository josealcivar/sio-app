import { useState } from "react"
import { citasHoy } from "@/lib/datos"

import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"

export default function Hoy() {
  const [vinieron, setVinieron] = useState<string[]>([])

  return (
    <div className="p-5">
      <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
        Miércoles 12 de agosto
      </p>
      <h1 className="font-serif text-3xl font-semibold">Hoy</h1>

      <div className="flex items-center justify-between mb-5">
        <p className="text-muted-foreground">{citasHoy.length} citas</p>
        <Link to="/agenda">
          <Button size="sm">+ Agendar cita</Button>
        </Link>
      </div>

      {/* <div className="space-y-2">
        {citasHoy.map((cita) => {
          const vino = vinieron.includes(cita.id)
          return (
            <Card key={cita.id} className="p-4 flex items-center gap-3">
              <span className="font-serif text-lg font-semibold text-primary w-14">
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
              >
                {vino ? "✓ Vino" : "Vino"}
              </Button>
            </Card>
          )
        })}
      </div> */}

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