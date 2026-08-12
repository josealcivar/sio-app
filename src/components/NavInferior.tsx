import { NavLink } from "react-router-dom"
import { Calendar, Moon, Bell, Users } from "lucide-react"

const tabs = [
  { to: "/", label: "Hoy", Icon: Calendar, end: true },
  { to: "/reactivar", label: "Reactivar", Icon: Moon },
  { to: "/agenda", label: "Agendar", Icon: Calendar },
  { to: "/recordatorios", label: "Recordatorios", Icon: Bell },
  { to: "/clientes", label: "Clientes", Icon: Users },
]

export default function NavInferior() {
  return (


    <nav className="fixed bottom-0 inset-x-0 bg-card border-t flex" style={{ paddingBottom: "env(safe-area-inset-bottom)" }}>
      {tabs.map(({ to, label, Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className={({ isActive }) =>
            `flex-1 flex flex-col items-center gap-1 py-2 text-xs font-semibold ${
              isActive ? "text-primary" : "text-muted-foreground"
            }`
          }
        >
         {({ isActive }) => (
            <>
              <div
                className={`px-4 py-2 rounded-full transition-colors ${
                  isActive ? "bg-secondary" : ""
                }`}
              >
                <Icon size={25} />
              </div>
              {label}
            </>
          )}
        </NavLink>
      ))}
    </nav>
  )
}