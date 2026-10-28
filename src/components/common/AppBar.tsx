import { FC } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Icon } from "../ui/Icon";
import { Logo } from "./Logo";
import { useCart } from "../../contexts/CartContext";
import { useAuth } from "../../contexts/AuthContext";
import { isDemoMode } from "../../data/demo/demoMode";

interface AppBarProps { title?: string; showSearch?: boolean; showWallet?: boolean; showBack?: boolean; }

const desktopLink = ({ isActive }: { isActive: boolean }) =>
  `rounded-lg px-3 py-2 text-sm font-medium transition-colors ${isActive ? "bg-primary-50 text-primary-800" : "text-surface-700 hover:bg-surface-100"}`;

export const AppBar: FC<AppBarProps> = ({ title, showSearch = true, showWallet = true, showBack = false }) => {
  const navigate = useNavigate();
  const { getItemCount } = useCart();
  const { user, logout, isLoading } = useAuth();
  const initials = user?.name.split(/\s+/).slice(0, 2).map(part => part[0]).join("").toUpperCase() || "?";
  const count = getItemCount();

  return (
    <header className={`app-header sticky top-0 z-40 border-b border-surface-200 bg-white/95 pt-[env(safe-area-inset-top)] backdrop-blur${isDemoMode ? " app-header--demo" : ""}`}>
      <div className="page-container flex min-h-16 items-center gap-2 py-2 max-[359px]:gap-1 lg:min-h-[76px] lg:gap-8">
        {showBack && <button type="button" onClick={() => navigate(-1)} aria-label="Volver" className="icon-control lg:hidden"><Icon name="ChevronLeft" size={21} /></button>}
        <Link to="/" aria-label="REYVENS, inicio" className="shrink-0"><Logo size="sm" /></Link>

        <Link to="/location" aria-label="Seleccionar ubicación" title="Ubicación" className="icon-control xl:hidden"><Icon name="MapPin" size={19} /></Link>
        <Link to="/location" className="hidden shrink-0 items-center gap-2 rounded-xl bg-surface-50 px-3 py-2 text-sm text-surface-700 transition-colors hover:bg-surface-100 xl:flex">
          <Icon name="MapPin" size={17} className="text-primary-700" />
          <span>Ubicación</span>
        </Link>

        {showSearch && <Link to="/search" className="flex min-w-0 flex-1 items-center gap-2 rounded-xl border border-surface-200 bg-surface-50 px-3 py-2.5 text-sm text-surface-500 transition-colors hover:border-surface-300 hover:bg-white" aria-label="Buscar productos">
          <Icon name="Search" size={18} className="shrink-0" />
          <span className="hidden min-w-0 truncate sm:inline">Buscar productos, tiendas…</span>
          <span className="min-w-0 truncate max-[399px]:sr-only sm:hidden">Buscar en REYVENS</span>
        </Link>}

        {title && <h1 className="hidden text-base font-semibold text-surface-900 xl:block">{title}</h1>}

        <nav aria-label="Navegación principal" className="hidden items-center gap-1 lg:flex">
          <NavLink to="/categories" className={desktopLink}>Catálogo</NavLink>
          <NavLink to="/rewards" className={desktopLink}>Recompensas</NavLink>
          {user && <NavLink to="/history" className={desktopLink}>Mis pedidos</NavLink>}
          {user && <NavLink to="/account/security" className={desktopLink}>Cuenta</NavLink>}
        </nav>

        <div className="ml-auto flex shrink-0 items-center gap-1 sm:gap-2">
          {showWallet && <Link to="/wallet" aria-label="Billetera" className="icon-control hidden sm:flex"><Icon name="Wallet" size={19} /></Link>}
          <Link to="/cart" aria-label={`Carrito${count ? `, ${count} productos` : ""}`} className="icon-control relative">
            <Icon name="ShoppingCart" size={20} />
            {count > 0 && <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary-700 px-1 text-[10px] font-bold text-white">{count > 99 ? "99+" : count}</span>}
          </Link>
          {user ? <>
            <Link to="/account/security" title={user.name} aria-label={`Seguridad de la cuenta de ${user.name}`} className="flex h-10 min-w-10 items-center justify-center rounded-full bg-surface-900 px-2 text-xs font-bold text-white">{initials}</Link>
            <button type="button" onClick={() => void logout().catch(() => undefined)} disabled={isLoading} className="icon-control hidden sm:flex" aria-label="Cerrar sesión" title="Cerrar sesión"><Icon name="LogOut" size={18} /></button>
          </> : <Link to="/login" className="hidden min-h-10 items-center rounded-xl bg-primary-700 px-4 text-sm font-semibold text-white transition-colors hover:bg-primary-800 sm:flex">Ingresar</Link>}
        </div>
      </div>
      {user && <div className="page-container flex items-center justify-between gap-3 pb-2 sm:hidden">
        <nav aria-label="Cuenta" className="flex min-w-0 gap-3 overflow-x-auto text-xs font-medium">
          <Link className="whitespace-nowrap text-surface-700" to="/account/security">Cuenta</Link>
          <Link className="whitespace-nowrap text-surface-700" to="/history">Mis pedidos</Link>
        </nav>
        <button type="button" onClick={() => void logout().catch(() => undefined)} disabled={isLoading} className="min-h-9 shrink-0 rounded-lg px-2 py-1 text-xs font-medium text-surface-600 hover:bg-surface-100 disabled:opacity-50">Cerrar sesión</button>
      </div>}
    </header>
  );
};
