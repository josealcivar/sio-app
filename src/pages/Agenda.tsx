import { useState } from "react"
import { citasHoy as citasIniciales, clientes, generarFranjas, hoyISO, type Cita } from "@/lib/datos"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function Agenda() {
  const [citas, setCitas] = useState<Cita[]>(citasIniciales)
  const [fecha, setFecha] = useState(hoyISO())
  const [franjaElegida, setFranjaElegida] = useState<string | null>(null)
  const [clienteId, setClienteId] = useState("")

  const franjas = generarFranjas(9, 18, 30)

  // solo las citas de la fecha elegida
  const citasDelDia = citas.filter((c) => c.fecha === fecha)
  const ocupadas = new Map(citasDelDia.map((c) => [c.hora, c]))

  function agendar() {
    if (!franjaElegida || !clienteId) return
    const cliente = clientes.find((c) => c.id === clienteId)
    if (!cliente) return
    setCitas([
      ...citas,
      { id: crypto.randomUUID(), nombre: cliente.nombre, fecha, hora: franjaElegida, servicio: "Limpieza facial" },
    ])
    setFranjaElegida(null)
    setClienteId("")
  }

  return (
    <div className="p-5">
      <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
        Agenda
      </p>
      <h1 className="font-serif text-3xl font-semibold mb-4">Agendar cita</h1>

      {/* selector de fecha */}
      <label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
        Fecha
      </label>
      <input
        type="date"
        value={fecha}
        min={hoyISO()}
        onChange={(e) => setFecha(e.target.value)}
        className="w-full rounded-lg border bg-background p-3 text-lg mt-1 mb-5"
      />

      <p className="text-sm text-muted-foreground mb-3">Toca un horario libre</p>

 <div className="space-y-1.5">
        {franjas.map((hora) => {
          const cita = ocupadas.get(hora)
          const libre = !cita
          return (
            <button
              key={hora}
              disabled={!libre}
              onClick={() => setFranjaElegida(hora)}
              className={`w-full flex items-center gap-3 rounded-xl px-4 py-3 text-left transition-colors ${
                libre
                  ? "bg-card border border-dashed hover:border-primary hover:border-solid active:bg-secondary"
                  : "bg-secondary"
              }`}
            >
              <span
                className={`font-serif text-base font-semibold w-14 shrink-0 ${
                  libre ? "text-muted-foreground" : "text-primary"
                }`}
              >
                {hora}
              </span>
              {libre ? (
                <span className="text-sm text-muted-foreground">Libre</span>
              ) : (
                <span className="text-base font-semibold">{cita!.nombre}</span>
              )}
            </button>
          )
        })}
      </div>

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
              {fecha} · {franjaElegida}
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