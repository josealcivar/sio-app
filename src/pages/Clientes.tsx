import { useState } from "react"
import { clientes as clientesIniciales, semanasDesde, type Cliente } from "@/lib/datos"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import DetalleCliente from "@/components/DetalleCliente"

export default function Clientes() {
  const [lista, setLista] = useState<Cliente[]>(clientesIniciales)
  const [busqueda, setBusqueda] = useState("")
  const [nombre, setNombre] = useState("")
  const [telefono, setTelefono] = useState("")
  const [mostrarForm, setMostrarForm] = useState(false)
  const [seleccionado, setSeleccionado] = useState<Cliente | null>(null)

  const filtrados = lista.filter((c) =>
    c.nombre.toLowerCase().includes(busqueda.toLowerCase())
  )

  function agregar() {
    if (!nombre.trim() || !telefono.trim()) return
    setLista([
      ...lista,
      {
        id: crypto.randomUUID(),
        nombre: nombre.trim(),
        telefono: telefono.trim(),
        cadenciaSemanas: 5,
        ultimaVisita: null,
        observaciones: "",
      },
    ])
    setNombre("")
    setTelefono("")
    setMostrarForm(false)
  }

  function guardarObs(id: string, observaciones: string) {
    setLista(lista.map((c) => (c.id === id ? { ...c, observaciones } : c)))
  }

  return (
    <div className="p-5">
      <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
        Tu cartera
      </p>
      <h1 className="font-serif text-3xl font-semibold">Clientes</h1>
      <p className="text-muted-foreground mb-4">{lista.length} clientes</p>

      <Input
        placeholder="Buscar por nombre…"
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        className="mb-3"
      />

      {!mostrarForm && (
        <Button className="w-full mb-4" onClick={() => setMostrarForm(true)}>
          + Nuevo cliente
        </Button>
      )}

      {mostrarForm && (
        <Card className="p-4 mb-4 space-y-3">
          <p className="font-semibold">Nuevo cliente</p>
          <Input placeholder="Nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} />
          <Input placeholder="Teléfono (593987654321)" value={telefono} onChange={(e) => setTelefono(e.target.value)} />
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1" onClick={() => setMostrarForm(false)}>
              Cancelar
            </Button>
            <Button className="flex-1" onClick={agregar}>
              Guardar
            </Button>
          </div>
        </Card>
      )}

      <div className="space-y-2">
        {filtrados.map((c) => {
          const semanas = semanasDesde(c.ultimaVisita)
          const dormido = c.ultimaVisita && semanas > c.cadenciaSemanas
          const inicial = c.nombre.charAt(0).toUpperCase()
          return (
            <div
              key={c.id}
              onClick={() => setSeleccionado(c)}
              className="bg-card border rounded-2xl p-3.5 flex items-center gap-3 cursor-pointer hover:border-primary transition-colors"
            >
              {/* avatar con inicial */}
              <div className="w-10 h-10 rounded-full bg-secondary text-primary grid place-items-center font-serif font-semibold shrink-0">
                {inicial}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-semibold truncate">{c.nombre}</p>
                  {c.observaciones && (
                    <span className="text-xs text-muted-foreground shrink-0">📝</span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  {c.ultimaVisita ? `Hace ${semanas} sem · ciclo ${c.cadenciaSemanas}` : "Sin visitas aún"}
                </p>
              </div>
              {/* indicador de estado: punto de color */}
              <span
                className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                  dormido ? "bg-honey" : c.ultimaVisita ? "bg-primary" : "bg-border"
                }`}
              />
            </div>
          )
        })}
        {filtrados.length === 0 && (
          <p className="text-center text-muted-foreground py-8">Sin resultados</p>
        )}
      </div>

      <DetalleCliente
        cliente={seleccionado}
        onClose={() => setSeleccionado(null)}
        onGuardar={guardarObs}
      />
    </div>
  )
}