import { useState, useEffect } from "react"
import { fechaHoyTexto } from "@/lib/datos"
import { obtenerCitasHoy, marcarVino } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"

type CitaHoy = {
  id: string
  nombre: string
  hora: string
  servicio: string
  estado: string
}

export default function Hoy() {
  const [citas, setCitas] = useState<CitaHoy[]>([])
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    obtenerCitasHoy()
      .then((data) =>
        setCitas(
          data.map((c:any) => ({
            id: c.id,
            nombre: c.nombre,
            hora: c.hora,
            servicio: c.servicio,
            estado: c.estado,
          }))
        )
      )
      .catch(console.error)
      .finally(() => setCargando(false))
  }, [])

  const total = citas.length
  const atendidas = citas.filter((c) => c.estado === "vino").length
  const progreso = total > 0 ? (atendidas / total) * 100 : 0
  const proxima = citas.find((c) => c.estado !== "vino") ?? null

  async function handleVino(id: string) {
    try {
      await marcarVino(id)
      setCitas(citas.map((c) => (c.id === id ? { ...c, estado: "vino" } : c)))
    } catch (e) {
      console.error("Error marcando vino:", e)
      alert("No se pudo marcar")
    }
  }

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
        ) : total > 0 ? (
          <p className="text-sm text-muted-foreground mt-2">
            ✓ Todas las citas de hoy atendidas
          </p>
        ) : (
          <p className="text-sm text-muted-foreground mt-2">Sin citas hoy</p>
        )}
      </div>

      {/* citas de hoy */}
      <div className="flex items-center justify-between mb-3">
        <p className="text-muted-foreground">{total} citas hoy</p>
        <Link to="/agenda">
          <Button size="sm">+ Agendar cita</Button>
        </Link>
      </div>

      {cargando ? (
        <p className="text-center text-muted-foreground py-8">Cargando…</p>
      ) : citas.length === 0 ? (
        <p className="text-center text-muted-foreground py-8">
          No tienes citas para hoy
        </p>
      ) : (
        <div className="space-y-2">
          {citas.map((cita) => {
            const vino = cita.estado === "vino"
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
                  onClick={() => handleVino(cita.id)}
                  className="shrink-0"
                >
                  {vino ? "✓ Vino" : "Vino"}
                </Button>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}