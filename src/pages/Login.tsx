import { useState } from "react"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Eye, EyeOff } from "lucide-react"

export default function Login() {
  const [email, setEmail] = useState("prueba@sio.app")
  const [password, setPassword] = useState("")
  const [verPassword, setVerPassword] = useState(false)
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
          <div className="relative">
            <Input
              type={verPassword ? "text" : "password"}
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && entrar()}
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setVerPassword(!verPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label={verPassword ? "Ocultar contraseña" : "Ver contraseña"}
            >
              {verPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {error && <p className="text-destructive text-sm">{error}</p>}
          <Button className="w-full" onClick={entrar} disabled={cargando}>
            {cargando ? "Entrando…" : "Entrar"}
          </Button>
        </div>
      </Card>
    </div>
  )
}