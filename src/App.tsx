import { useEffect, useState } from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import type { Session } from "@supabase/supabase-js"
import { supabase } from "@/lib/supabase"
import Login from "@/pages/Login"
import NavInferior from "@/components/NavInferior"
import Hoy from "@/pages/Hoy"
import Reactivar from "@/pages/Reactivar"
import Recordatorios from "@/pages/Recordatorios"
import Clientes from "@/pages/Clientes"
import Cabecera from "./components/Cabecera"

// ⚠️ MODO PRUEBA: entra sin Supabase. Poner en false cuando conectes la auth real.
const MODO_PRUEBA = true

export default function App() {
  const [session, setSession] = useState<Session | null>(null)
  const [listo, setListo] = useState(false)

  useEffect(() => {
    if (MODO_PRUEBA) {
      setListo(true)
      return
    }
    supabase.auth.getSession().then(({ data }: { data: { session: Session | null } }) => {
      setSession(data.session)
      setListo(true)
    })
    const { data: sub } = supabase.auth.onAuthStateChange(
      (_e: string, s: Session | null) => {
        setSession(s)
      }
    )
    return () => sub.subscription.unsubscribe()
  }, [])

  if (!listo) return null

  // En modo prueba entra directo; si no, exige sesión
  if (!MODO_PRUEBA && !session) return <Login />

  return (
    <BrowserRouter>
      
        <div className="pb-28 max-w-md mx-auto">
           <Cabecera />
        <Routes>
          <Route path="/" element={<Hoy />} />
          <Route path="/reactivar" element={<Reactivar />} />
          <Route path="/recordatorios" element={<Recordatorios />} />
          <Route path="/clientes" element={<Clientes />} />
        </Routes>
      </div>
      <NavInferior />
    </BrowserRouter>
  )
}