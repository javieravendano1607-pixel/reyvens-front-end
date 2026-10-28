import { FC } from "react";
import { Outlet } from "react-router-dom";
import { AppBar } from "../components/common/AppBar";
import { BottomBar } from "../components/common/BottomBar";
import { Link } from "react-router-dom";
import { isDemoMode } from "../data/demo/demoMode";
import { Icon } from "../components/ui/Icon";
import { ConnectivityNotice } from "../components/common/ConnectivityNotice";

export const MainLayout: FC = () => (
  <div className="flex min-h-screen flex-col bg-surface-50">
    <AppBar />
    <ConnectivityNotice />
    {isDemoMode && <div className="demo-shell-banner" role="note"><span className="demo-notice__dot" /> Experiencia de catálogo demo <span className="hidden sm:inline">— los datos y valoraciones son ficticios; las compras están desactivadas.</span><span className="sm:hidden">· compras desactivadas</span></div>}
    <main className="min-w-0 flex-1 pb-[calc(76px+env(safe-area-inset-bottom))] lg:pb-10">
      <Outlet />
    </main>
    {isDemoMode && <footer className="demo-footer"><div className="page-container flex flex-col gap-5 py-8 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-lg font-bold tracking-tight text-white">REYVENS<span className="text-primary-500">.</span></p><p className="mt-2 max-w-md text-xs leading-5 text-white/60">Prototipo navegable con contenido ficticio para evaluar la experiencia visual. No representa disponibilidad comercial.</p></div><nav aria-label="Enlaces de demostración" className="flex flex-wrap gap-x-5 gap-y-2 text-sm font-medium text-white/75"><Link to="/categories" className="transition-colors hover:text-white">Categorías</Link><Link to="/search" className="transition-colors hover:text-white">Buscar</Link><Link to="/rewards" className="transition-colors hover:text-white">Recompensas</Link><Link to="/login" className="transition-colors hover:text-white">Cuenta</Link></nav><Link to="/" aria-label="Volver al inicio" className="hidden h-10 w-10 items-center justify-center rounded-full border border-white/20 text-white transition-colors hover:bg-white/10 sm:flex"><Icon name="ArrowUp" size={18} /></Link></div></footer>}
    <BottomBar />
  </div>
);
