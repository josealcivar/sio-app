import { useState } from "react"
import { citasHoy } from "@/lib/datos"
import { Card } from "@/components/ui/card"
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
      <p className="text-muted-foreground mb-5">{citasHoy.length} citas</p>
      <Link to="/agenda">
        <Button className="w-full mb-5">+ Agendar cita</Button>
      </Link>
      <div className="space-y-3">
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
      </div>
    </div>
  )
}