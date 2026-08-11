import { citasManana } from "@/lib/datos"
import { mensajeRecordatorio, linkWhatsApp } from "@/lib/mensajes"
import { Card } from "@/components/ui/card"

export default function Recordatorios() {
  return (
    <div className="p-5">
      <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
        Jueves 13 de agosto
      </p>
      <h1 className="font-serif text-3xl font-semibold">Recordar</h1>
      <p className="text-muted-foreground mb-5">Citas de mañana · avisa un día antes</p>

      <div className="space-y-3">
        {citasManana.map((cita) => (
          <Card key={cita.id} className="p-4 flex items-center gap-3">
            <span className="font-serif text-lg font-semibold text-primary w-14">
              {cita.hora}
            </span>
            <div className="flex-1 min-w-0">
              <p className="font-semibold">{cita.nombre}</p>
              <p className="text-sm text-muted-foreground truncate">{cita.servicio}</p>
            </div>
            <a
              href={linkWhatsApp("593987000009", mensajeRecordatorio(cita.nombre, cita.hora))}
              target="_blank"
              rel="noopener"
              className="inline-flex items-center rounded-lg bg-[#25623f] text-white text-sm font-semibold px-3 py-2"
            >
              Recordar
            </a>
          </Card>
        ))}
      </div>
    </div>
  )
}