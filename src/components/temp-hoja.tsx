import { useState, useEffect } from "react"
import { linkWhatsApp } from "@/lib/mensajes"

export type DatosHoja = {
  titulo: string
  nombre: string
  telefono: string
  mensaje: string
}

type Props = {
  datos: DatosHoja | null
  onClose: () => void
}

export default function HojaWhatsApp({ datos, onClose }: Props) {
  const [texto, setTexto] = useState("")

  useEffect(() => {
    setTexto(datos?.mensaje ?? "")
  }, [datos])

  const abierto = !!datos

  return (
    <>
      {/* fondo oscuro */}
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-black/40 transition-opacity z-40 ${
          abierto ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      />
      {/* hoja */}
      <div
        className={`fixed bottom-0 inset-x-0 mx-auto max-w-md bg-card rounded-t-3xl p-5 z-50 transition-transform ${
          abierto ? "translate-y-0" : "translate-y-full"
        }`}
        style={{ paddingBottom: "calc(1.25rem + env(safe-area-inset-bottom))" }}
      >
        <div className="w-10 h-1 rounded-full bg-border mx-auto mb-4" />

        {datos && (
          <>
            <h3 className="font-serif text-2xl font-semibold">{datos.titulo}</h3>
            <p className="text-muted-foreground text-sm mb-4">Para {datos.nombre}</p>

            <textarea
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
              rows={4}
              className="w-full rounded-xl border bg-background p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <p className="text-xs text-muted-foreground mt-2 mb-4">
              ✎ Puedes editar el texto antes de enviarlo.
            </p>

            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 rounded-xl border py-3 font-semibold text-sm"
              >
                Cancelar
              </button>
              <a
                href={linkWhatsApp(datos.telefono, texto)}
                target="_blank"
                rel="noopener"
                onClick={onClose}
                className="flex-1 rounded-xl bg-[#25623f] text-white py-3 font-semibold text-sm text-center"
              >
                Abrir WhatsApp
              </a>
            </div>
          </>
        )}
      </div>
    </>
  )
}