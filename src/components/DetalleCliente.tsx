import { useState, useEffect } from "react"
import type { Cliente } from "@/lib/datos"
import { semanasDesde } from "@/lib/datos"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

type Props = {
  cliente: Cliente | null
  onClose: () => void
  onGuardar: (id: string, observaciones: string) => void
}

export default function DetalleCliente({ cliente, onClose, onGuardar }: Props) {
  const [obs, setObs] = useState("")

  // sincroniza el texto cuando se abre otro cliente
  useEffect(() => {
    setObs(cliente?.observaciones ?? "")
  }, [cliente])

  if (!cliente) return null

  const semanas = semanasDesde(cliente.ultimaVisita)

  return (
    <Dialog open={!!cliente} onOpenChange={(abierto) => !abierto && onClose()}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl">{cliente.nombre}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <Dato label="Teléfono" valor={cliente.telefono} />
            <Dato label="Ciclo" valor={`${cliente.cadenciaSemanas} semanas`} />
            <Dato
              label="Última visita"
              valor={cliente.ultimaVisita ? `Hace ${semanas} sem` : "Sin visitas"}
            />
            <Dato
              label="Estado"
              valor={
                cliente.ultimaVisita && semanas > cliente.cadenciaSemanas
                  ? "Por reactivar"
                  : "Al día"
              }
            />
          </div>

          <div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-1.5">
              Observaciones
            </p>
            <textarea
              value={obs}
              onChange={(e) => setObs(e.target.value)}
              placeholder="Tipo de atención, piel, preferencias…"
              rows={4}
              className="w-full rounded-lg border bg-background p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <Button
            className="w-full"
            onClick={() => {
              onGuardar(cliente.id, obs)
              onClose()
            }}
          >
            Guardar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function Dato({ label, valor }: { label: string; valor: string }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
        {label}
      </p>
      <p className="mt-0.5">{valor}</p>
    </div>
  )
}