import { useState } from "react"
import { citasHoy as citasIniciales, clientes, generarFranjas, type Cita } from "@/lib/datos"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function Agenda() {
  const [citas, setCitas] = useState<Cita[]>(citasIniciales)
  const [franjaElegida, setFranjaElegida] = useState<string | null>(null)
  const [clienteId, setClienteId] = useState("")

  const franjas = generarFranjas(9, 18, 30)
  const ocupadas = new Map(citas.map((c) => [c.hora, c]))

  function agendar() {
    if (!franjaElegida || !clienteId) return
    const cliente = clientes.find((c) => c.id === clienteId)
    if (!cliente) return
    setCitas([
      ...citas,
      { id: crypto.randomUUID(), nombre: cliente.nombre, hora: franjaElegida, servicio: "Limpieza facial" },
    ])
    setFranjaElegida(null)
    setClienteId("")
  }

  return (
    <div className="p-5">
      <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
        Miércoles 12 de agosto
      </p>
      <h1 className="font-serif text-3xl font-semibold">Agenda</h1>
      <p className="text-muted-foreground mb-5">Toca un horario libre para agendar</p>

      <div className="space-y-2">
        {franjas.map((hora) => {
          const cita = ocupadas.get(hora)
          const libre = !cita
          return (
            <button
              key={hora}
              disabled={!libre}
              onClick={() => setFranjaElegida(hora)}
              className={`w-full flex items-center gap-3 rounded-xl p-3 text-left transition-colors ${
                libre
                  ? "bg-card border hover:border-primary"
                  : "bg-muted"
              }`}
            >
              <span className="font-serif text-base font-semibold text-primary w-14">
                {hora}
              </span>
              {libre ? (
                <span className="text-sm text-muted-foreground">Libre</span>
              ) : (
                <span className="text-sm font-medium">{cita!.nombre}</span>
              )}
            </button>
          )
        })}
      </div>

      {/* Formulario emergente al elegir franja */}
      {franjaElegida && (
        <div
          className="fixed inset-0 bg-black/40 z-40 flex items-end"
          onClick={() => setFranjaElegida(null)}
        >
          <Card
            className="w-full max-w-md mx-auto rounded-t-3xl p-5 z-50"
            onClick={(e) => e.stopPropagation()}
            style={{ paddingBottom: "calc(1.25rem + env(safe-area-inset-bottom))" }}
          >
            <h3 className="font-serif text-2xl font-semibold mb-1">Agendar cita</h3>
            <p className="text-muted-foreground text-sm mb-4">
              {franjaElegida} · Miércoles 12 de agosto
            </p>

            <label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
              Cliente
            </label>
            <select
              value={clienteId}
              onChange={(e) => setClienteId(e.target.value)}
              className="w-full rounded-lg border bg-background p-3 text-sm mt-1 mb-4"
            >
              <option value="">Elige un cliente…</option>
              {clientes.map((c) => (
                <option key={c.id} value={c.id}>{c.nombre}</option>
              ))}
            </select>

            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setFranjaElegida(null)}>
                Cancelar
              </Button>
              <Button className="flex-1" onClick={agendar} disabled={!clienteId}>
                Agendar
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}