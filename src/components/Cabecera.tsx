export default function Cabecera() {
  return (
    <header className="sticky top-0 z-30 bg-background px-5 py-3 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className="w-2.5 h-2.5 rounded-full bg-honey" />
        <span className="font-serif text-2xl font-semibold text-primary">Sio</span>
             </div>
      <div className="w-9 h-9 rounded-full bg-primary text-primary-foreground grid place-items-center text-xs font-semibold">
        RS
      </div>
    </header>
  )
}