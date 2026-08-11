import { useState } from "react"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"

export default function Login() {
  const [email, setEmail] = useState("mail@mail.com")
  const [password, setPassword] = useState("mail1234")
  const [error, setError] = useState("")
  const [cargando, setCargando] = useState(false)

  async function entrar() {
    setError("")
    setCargando(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setError("Correo o contraseña incorrectos")
    setCargando(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <Card className="w-full max-w-sm p-8">
        <div className="text-center mb-6">
          <h1 className="font-serif text-3xl font-semibold text-primary">Sio</h1>
          <p className="text-muted-foreground text-sm mt-1">Entra a tu cuenta</p>
        </div>
        <div className="space-y-3">
          <Input
            type="email"
            placeholder="Correo"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && entrar()}
          />
          {error && <p className="text-destructive text-sm">{error}</p>}
          <Button className="w-full" onClick={entrar} disabled={cargando}>
            {cargando ? "Entrando…" : "Entrar"}
          </Button>
        </div>
      </Card>
    </div>
  )
}