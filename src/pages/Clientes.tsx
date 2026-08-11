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

      <Button className="w-full mb-4" onClick={() => setMostrarForm(!mostrarForm)}>
        {mostrarForm ? "Cancelar" : "+ Nuevo cliente"}
      </Button>

      {mostrarForm && (
        <Card className="p-4 mb-4 space-y-3">
          <Input placeholder="Nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} />
          <Input placeholder="Teléfono (593987654321)" value={telefono} onChange={(e) => setTelefono(e.target.value)} />
          <Button className="w-full" onClick={agregar}>Guardar</Button>
        </Card>
      )}

      <div className="space-y-3">
        {filtrados.map((c) => {
          const semanas = semanasDesde(c.ultimaVisita)
          return (
            <Card
              key={c.id}
              className="p-4 flex items-center justify-between gap-2 cursor-pointer hover:border-primary transition-colors"
              onClick={() => setSeleccionado(c)}
            >
              <div>
                <p className="font-semibold">{c.nombre}</p>
                <p className="text-sm text-muted-foreground">
                  {c.ultimaVisita ? `Hace ${semanas} sem · ciclo ${c.cadenciaSemanas}` : "Sin visitas aún"}
                </p>
              </div>
              {c.observaciones && (
                <span className="text-xs text-muted-foreground shrink-0">📝</span>
              )}
            </Card>
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