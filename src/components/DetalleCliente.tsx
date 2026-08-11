import { useState, useEffect } from "react"
import type { Cliente } from "@/lib/datos"
import { semanasDesde } from "@/lib/datos"
import { linkWhatsApp } from "@/lib/mensajes"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Pencil } from "lucide-react"

type Props = {
  cliente: Cliente | null
  onClose: () => void
  onGuardar: (id: string, cambios: { telefono: string; observaciones: string }) => void
}

export default function DetalleCliente({ cliente, onClose, onGuardar }: Props) {
  const [editando, setEditando] = useState(false)
  const [obs, setObs] = useState("")
  const [tel, setTel] = useState("")

  useEffect(() => {
    setObs(cliente?.observaciones ?? "")
    setTel(cliente?.telefono ?? "")
    setEditando(false)
  }, [cliente])

  if (!cliente) return null

  const semanas = semanasDesde(cliente.ultimaVisita)
  const dormido = cliente.ultimaVisita && semanas > cliente.cadenciaSemanas

  function guardar() {
    onGuardar(cliente!.id, { telefono: tel.trim(), observaciones: obs })
    setEditando(false)
    onClose()
  }

  return (
    <Dialog open={!!cliente} onOpenChange={(abierto) => !abierto && onClose()}>
      <DialogContent className="max-w-sm">
        {/* encabezado con avatar */}
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-full bg-secondary text-primary grid place-items-center font-serif text-lg font-semibold shrink-0">
            {cliente.nombre.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <DialogTitle className="font-serif text-xl">{cliente.nombre}</DialogTitle>
            {dormido ? (
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-honey-soft text-honey">
                Por reactivar
              </span>
            ) : (
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-secondary text-primary">
                Al día
              </span>
            )}
          </div>
        </div>

        {/* datos en dos columnas */}
        <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-sm py-2">
          <div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
              Teléfono
            </p>
            {editando ? (
              <input
                value={tel}
                onChange={(e) => setTel(e.target.value)}
                className="w-full rounded-md border bg-background px-2 py-1 text-sm mt-1"
              />
            ) : (
              <p className="mt-0.5">{cliente.telefono}</p>
            )}
          </div>
          <Dato label="Ciclo" valor={`${cliente.cadenciaSemanas} semanas`} />
          <Dato
            label="Última visita"
            valor={cliente.ultimaVisita ? `Hace ${semanas} sem` : "Sin visitas"}
          />
          <Dato label="Próxima" valor={cliente.ultimaVisita ? "Sin agendar" : "—"} />
        </div>

        {/* observaciones */}
        <div>
          <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-1.5">
            Observaciones
          </p>
          {editando ? (
            <textarea
              value={obs}
              onChange={(e) => setObs(e.target.value)}
              placeholder="Tipo de piel, preferencias, tratamiento…"
              rows={3}
              className="w-full rounded-lg border bg-background p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring"
            />
          ) : (
            <p className="text-sm bg-secondary/50 rounded-lg p-3 min-h-[3rem]">
              {cliente.observaciones || <span className="text-muted-foreground">Sin observaciones</span>}
            </p>
          )}
        </div>

        {/* acción: cambia según el modo */}
        {editando ? (
          <div className="flex gap-2 mt-2">
            <button
              onClick={() => setEditando(false)}
              className="flex-1 rounded-xl border py-3 font-semibold text-sm"
            >
              Cancelar
            </button>
            <button
              onClick={guardar}
              className="flex-1 rounded-xl bg-primary text-primary-foreground py-3 font-semibold text-sm"
            >
              Guardar
            </button>
          </div>
        ) : (
          <div className="flex gap-2 mt-2">
            <a
              href={linkWhatsApp(cliente.telefono, `Hola ${cliente.nombre} 💆`)}
              target="_blank"
              rel="noopener"
              className="flex-1 rounded-xl bg-[#25623f] text-white font-semibold py-3 text-sm text-center"
            >
              Escribir por WhatsApp
            </a>
            <button
              onClick={() => setEditando(true)}
              className="rounded-xl border px-4 font-semibold text-sm flex items-center gap-1.5"
              aria-label="Editar"
            >
              <Pencil size={16} />
              Editar
            </button>
          </div>
        )}
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