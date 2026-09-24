// ============================================================
//  src/pages/Resumen.tsx
// ============================================================

import { useState, useEffect } from "react"
import {
  obtenerEstadisticas,
  contarPorReactivar,
  PRECIO_PROMEDIO,
  type MesStats,
} from "@/lib/estadisticas"

const ABBR = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"]
const LARGO = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"]

type Modo = "mes" | "trim" | "anio"

export default function Resumen() {
  const [meses, setMeses] = useState<MesStats[]>([])
  const [dormidos, setDormidos] = useState(0)
  const [cargando, setCargando] = useState(true)

  const [modo, setModo] = useState<Modo>("mes")
  const [iMes, setIMes] = useState(0)
  const [iTrim, setITrim] = useState(0)
  const [iAnio, setIAnio] = useState(0)

  const [verTabla, setVerTabla] = useState(false)
  const [sheetAbierto, setSheetAbierto] = useState(false)
  const [anioSheet, setAnioSheet] = useState(0)

  useEffect(() => {
    Promise.all([obtenerEstadisticas(), contarPorReactivar()])
      .then(([m, d]) => {
        setMeses(m)
        setDormidos(d)
        const ultimo = m.length - 1
        setIMes(Math.max(0, ultimo))
        setITrim(Math.max(0, Math.floor(ultimo / 3)))
        setAnioSheet(m.length ? m[ultimo].anio : new Date().getFullYear())
        const anios = [...new Set(m.map((x) => x.anio))]
        setIAnio(Math.max(0, anios.length - 1))
      })
      .catch((e) => console.error("Error cargando estadísticas:", e))
      .finally(() => setCargando(false))
  }, [])

  if (cargando) {
    return (
      <div className="p-5">
        <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
          Tu evolución
        </p>
        <h1 className="font-serif text-3xl font-semibold mb-4">Resumen</h1>
        <p className="text-center text-muted-foreground py-10">Cargando…</p>
      </div>
    )
  }

  if (meses.length === 0) {
    return (
      <div className="p-5">
        <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
          Tu evolución
        </p>
        <h1 className="font-serif text-3xl font-semibold mb-4">Resumen</h1>
        <div className="bg-card border rounded-2xl p-6 text-center">
          <p className="font-semibold mb-1">Aún no hay datos</p>
          <p className="text-sm text-muted-foreground">
            Cuando marques tus primeras citas como atendidas, aquí verás cómo evoluciona tu mes.
          </p>
        </div>
      </div>
    )
  }

  const HOY = meses.length - 1
  const ANIOS = [...new Set(meses.map((m) => m.anio))]
  const suma = (arr: MesStats[], k: keyof MesStats) =>
    arr.reduce((a, b) => a + (b[k] as number), 0)

  // ---------- qué datos corresponden al estado actual ----------
  let datos: MesStats[] = []
  let prev: MesStats[] | null = null
  let rango = ""
  let cap = ""
  let refTxt = ""
  let desde = 0
  let hasta = 0
  let hl: number[] = []
  let sub = ""
  let esActual = false
  let anioCompleto: number | null = null

  if (modo === "mes") {
    const m = meses[iMes]
    const p = iMes > 0 ? meses[iMes - 1] : null
    datos = [m]
    prev = p ? [p] : null
    rango = `${LARGO[m.mes]} ${m.anio}`
    cap = "Citas atendidas en el mes"
    refTxt = p ? `que en ${LARGO[p.mes].toLowerCase()}` : "sin mes anterior"
    desde = Math.max(0, iMes - 5)
    hasta = iMes
    hl = [iMes]
    sub = "Últimos 6 meses"
    esActual = iMes === HOY
  } else if (modo === "trim") {
    const ini = iTrim * 3
    const fin = Math.min(ini + 2, HOY)
    datos = meses.slice(ini, fin + 1)
    prev = ini - 3 >= 0 ? meses.slice(ini - 3, ini) : null
    rango = `${ABBR[meses[ini].mes]} – ${ABBR[meses[fin].mes]} ${meses[fin].anio}`
    cap = "Citas atendidas en el trimestre"
    refTxt = prev ? "que el trimestre anterior" : "sin trimestre anterior"
    desde = Math.max(0, fin - 5)
    hasta = fin
    hl = datos.map((_, k) => ini + k)
    sub = "Últimos 6 meses · trimestre resaltado"
    esActual = fin === HOY
  } else {
    const y = ANIOS[iAnio]
    datos = meses.filter((m) => m.anio === y)
    const yPrev = ANIOS[iAnio - 1]
    prev =
      yPrev !== undefined
        ? meses.filter((m) => m.anio === yPrev).slice(0, datos.length)
        : null
    rango = `Año ${y}`
    cap = "Citas atendidas en el año"
    refTxt = prev ? `que en ${yPrev} (mismo periodo)` : `sin ${y - 1} para comparar`
    desde = meses.findIndex((m) => m.anio === y)
    hasta = desde + datos.length - 1
    hl = []
    sub = `Cada mes de ${y}`
    anioCompleto = y
    esActual = y === meses[HOY].anio
  }

  const citas = suma(datos, "citas")
  const recup = suma(datos, "recup")
  const nuevas = suma(datos, "nuevas")
  

  const dif = prev ? citas - suma(prev, "citas") : null

  // ---------- columnas de la gráfica ----------
  type Col = { m: MesStats | { mes: number; citas: number | null }; idx: number; vacio: boolean }
  let cols: Col[] = []
  if (modo === "anio" && anioCompleto !== null) {
    for (let k = 0; k < 12; k++) {
      const i = meses.findIndex((m) => m.anio === anioCompleto && m.mes === k)
      cols.push(
        i !== -1
          ? { m: meses[i], idx: i, vacio: false }
          : { m: { mes: k, citas: null }, idx: -1, vacio: true }
      )
    }
  } else {
    for (let i = desde; i <= hasta; i++) cols.push({ m: meses[i], idx: i, vacio: false })
  }

  const reales = cols.filter((c) => !c.vacio).map((c) => c.m.citas as number)
  const max = reales.length ? Math.max(...reales) : 1
  const prom = reales.length
    ? Math.round(reales.reduce((a, b) => a + b, 0) / reales.length)
    : 0

  // ---------- navegación ----------
  const nextOff =
    (modo === "mes" && iMes >= HOY) ||
    (modo === "trim" && (iTrim + 1) * 3 > HOY) ||
    (modo === "anio" && iAnio >= ANIOS.length - 1)
  const prevOff =
    (modo === "mes" && iMes <= 0) ||
    (modo === "trim" && iTrim <= 0) ||
    (modo === "anio" && iAnio <= 0)

  const mover = (d: 1 | -1) => {
    if (modo === "mes") setIMes((v) => v + d)
    else if (modo === "trim") setITrim((v) => v + d)
    else setIAnio((v) => v + d)
  }

  return (
    <div className="p-5">
      <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
        Tu evolución
      </p>
      <h1 className="font-serif text-3xl font-semibold mb-4">Resumen</h1>

      {/* selector de periodo */}
      <div className="flex gap-1 bg-card border rounded-2xl p-1 mb-2">
        {([
          ["mes", "Mes"],
          ["trim", "3 meses"],
          ["anio", "Año"],
        ] as [Modo, string][]).map(([k, label]) => (
          <button
            key={k}
            onClick={() => setModo(k)}
            className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
              modo === k ? "bg-primary text-primary-foreground" : "text-muted-foreground"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* navegador de fecha */}
      <div className="flex items-center gap-1.5 mb-4">
        <button
          onClick={() => mover(-1)}
          disabled={prevOff}
          className="w-10 h-10 shrink-0 border rounded-xl bg-card text-primary text-lg disabled:opacity-35"
        >
          ‹
        </button>
        <button
          onClick={() => modo === "mes" && (setAnioSheet(meses[iMes].anio), setSheetAbierto(true))}
          className="flex-1 h-10 border rounded-xl bg-card text-sm font-semibold flex items-center justify-center gap-2"
        >
          {rango}
          {esActual && (
            <span className="text-[10px] font-bold text-primary bg-secondary px-2 py-0.5 rounded-full">
              HOY
            </span>
          )}
        </button>
        <button
          onClick={() => mover(1)}
          disabled={nextOff}
          className="w-10 h-10 shrink-0 border rounded-xl bg-card text-primary text-lg disabled:opacity-35"
        >
          ›
        </button>
      </div>

      {/* hero */}
      <div className="bg-card border rounded-2xl p-4 mb-2.5">
        <p className="text-sm text-muted-foreground">{cap}</p>
        <p className="text-[54px] font-bold leading-none tracking-tight my-1">{citas}</p>
        {dif === null ? (
          <p className="text-sm text-muted-foreground font-medium">— {refTxt}</p>
        ) : (
          <p
            className={`text-sm font-semibold ${
              dif > 0 ? "text-primary" : dif < 0 ? "text-destructive" : "text-muted-foreground"
            }`}
          >
            {dif > 0 ? "▲" : dif < 0 ? "▼" : "■"}{" "}
            {dif === 0 ? "igual" : `${Math.abs(dif)} ${dif > 0 ? "más" : "menos"}`}{" "}
            <span className="text-muted-foreground font-medium">{refTxt}</span>
          </p>
        )}
      </div>

      {/* valor: lo que la app devolvió */}
      <div className="bg-secondary border rounded-2xl p-4 mb-2.5">
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-primary tracking-tight">{recup}</span>
          <span className="text-sm font-semibold text-primary">
            {recup === 1 ? "clienta volvió" : "clientas volvieron"}
          </span>
        </div>
        <p className="text-sm text-primary/80 mt-1.5 leading-relaxed">
          {recup === 0 ? (
            "Ninguna clienta de reactivación volvió en este periodo."
          ) : (
            <>
              Se habían pasado de su ciclo y regresaron. Equivale a{" "}
              <b className="font-bold">${(recup * PRECIO_PROMEDIO).toLocaleString("es-EC")}</b>{" "}
              que no se fueron a otro lado.
            </>
          )}
        </p>
      </div>

      {/* secundarios */}
      <div className="grid grid-cols-2 gap-2.5 mb-2.5">
        <div className="bg-card border rounded-2xl p-3.5">
          <p className="text-2xl font-bold tracking-tight">{nuevas}</p>
          <p className="text-xs text-muted-foreground mt-0.5">clientas nuevas</p>
        </div>
        {/* <div className="bg-card border rounded-2xl p-3.5">
          <p className="text-2xl font-bold tracking-tight">{canc}</p>
          <p className="text-xs text-muted-foreground mt-0.5">citas canceladas</p>
        </div> */}
        <div className="bg-card border rounded-2xl p-3.5">
            <p className="text-2xl font-bold tracking-tight">{suma(datos, "programadas")}</p>
            <p className="text-xs text-muted-foreground mt-0.5">citas programadas</p>
        </div>
      </div>

      {/* gráfica */}
      <div className="bg-card border rounded-2xl p-4 mb-2.5">
        <div className="flex items-start justify-between gap-2 mb-4">
          <div>
            <p className="font-semibold text-[15px]">Citas atendidas por mes</p>
            <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>
          </div>
          <button
            onClick={() => setVerTabla((v) => !v)}
            className="border rounded-lg px-2.5 py-1.5 text-xs font-semibold shrink-0"
          >
            {verTabla ? "Ver gráfica" : "Ver datos"}
          </button>
        </div>

        {verTabla ? (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[11px] uppercase tracking-wider text-muted-foreground">
                <th className="text-left font-semibold pb-2">Mes</th>
                <th className="text-right font-semibold pb-2">Citas</th>
              </tr>
            </thead>
            <tbody>
              {cols.map((c, k) => (
                <tr key={k} className="border-t">
                  <td className="py-2">{LARGO[c.m.mes]}</td>
                  <td className="py-2 text-right font-semibold tabular-nums">
                    {c.vacio ? "—" : c.m.citas}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <>
            <div className="flex items-end gap-1.5 h-[158px] pt-6">
              {cols.map((c, k) => {
                const dest = !c.vacio && hl.includes(c.idx)
                const h = c.vacio ? 6 : Math.max(((c.m.citas as number) / max) * 100, 6)
                const ultimoReal = !c.vacio && (k === cols.length - 1 || cols[k + 1]?.vacio)
                const marca = dest || (modo === "anio" && ultimoReal)
                return (
                  <div key={k} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                    <div className="w-full flex-1 flex items-end relative">
                      <div
                        className={`w-full rounded-t ${
                          c.vacio ? "bg-muted" : dest ? "bg-primary" : "bg-secondary"
                        }`}
                        style={{ height: `${h}%` }}
                      />
                      {marca && !c.vacio && (
                        <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[11px] font-bold">
                          {c.m.citas}
                        </span>
                      )}
                    </div>
                    <span
                      className={`text-[10px] font-semibold ${
                        dest ? "text-foreground" : "text-muted-foreground"
                      }`}
                    >
                      {ABBR[c.m.mes]}
                    </span>
                  </div>
                )
              })}
            </div>
            <div className="flex justify-between items-center mt-3 pt-3 border-t text-xs">
              <span className="text-muted-foreground">Promedio por mes</span>
              <span className="font-bold">{prom} citas</span>
            </div>
          </>
        )}
      </div>

      {/* acción: solo cuando miras el periodo actual */}
      {esActual && dormidos > 0 && (
        <a
          href="/reactivar"
          className="bg-honey-soft border rounded-2xl p-4 flex items-center gap-3"
          style={{ borderColor: "#EAD9B4" }}
        >
          <span className="w-9 h-9 rounded-full bg-honey text-white grid place-items-center font-bold shrink-0">
            {dormidos}
          </span>
          <span className="flex-1">
            <span className="block text-[15px] font-bold" style={{ color: "#5A3F12" }}>
              {dormidos === 1 ? "clienta por reactivar" : "clientas por reactivar"}
            </span>
            <span className="block text-xs mt-0.5" style={{ color: "#6d4f1c" }}>
              Ahora mismo · pasaron su ciclo
            </span>
          </span>
          <span style={{ color: "#6d4f1c" }}>›</span>
        </a>
      )}

      {/* selector de mes */}
      {sheetAbierto && (
        <>
          <div
            className="fixed inset-0 bg-black/45 z-40"
            onClick={() => setSheetAbierto(false)}
          />
          <div
            className="fixed bottom-0 inset-x-0 mx-auto max-w-md bg-card rounded-t-3xl p-5 z-50"
            style={{ paddingBottom: "calc(1.25rem + env(safe-area-inset-bottom))" }}
          >
            <div className="w-10 h-1 rounded-full bg-border mx-auto mb-4" />
            <h3 className="font-serif text-xl font-semibold text-center mb-4">Elegir mes</h3>

            <div className="flex items-center justify-center gap-4 mb-4">
              <button
                onClick={() => setAnioSheet((a) => a - 1)}
                disabled={anioSheet <= ANIOS[0]}
                className="w-8 h-8 border rounded-lg text-primary disabled:opacity-30"
              >
                ‹
              </button>
              <span className="text-lg font-bold w-16 text-center">{anioSheet}</span>
              <button
                onClick={() => setAnioSheet((a) => a + 1)}
                disabled={anioSheet >= ANIOS[ANIOS.length - 1]}
                className="w-8 h-8 border rounded-lg text-primary disabled:opacity-30"
              >
                ›
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {ABBR.map((ab, k) => {
                const i = meses.findIndex((m) => m.anio === anioSheet && m.mes === k)
                const hay = i !== -1
                return (
                  <button
                    key={k}
                    disabled={!hay}
                    onClick={() => {
                      setIMes(i)
                      setSheetAbierto(false)
                    }}
                    className={`border rounded-xl py-3 text-sm font-semibold disabled:opacity-30 ${
                      i === iMes ? "bg-primary text-primary-foreground border-primary" : ""
                    }`}
                  >
                    {ab}
                  </button>
                )
              })}
            </div>
          </div>
        </>
      )}
    </div>
  )
}