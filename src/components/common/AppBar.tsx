import { FC } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Icon } from "../ui/Icon";
import { useCart } from "../../contexts/CartContext";
import { useAuth } from "../../contexts/AuthContext";

interface AppBarProps { title?: string; showSearch?: boolean; showWallet?: boolean; showBack?: boolean; }

export const AppBar: FC<AppBarProps> = ({ title, showSearch = true, showWallet = true, showBack = false }) => {
  const navigate = useNavigate();
  const { getItemCount } = useCart();
  const { user, logout, isLoading } = useAuth();
  const initials = user?.name.split(/\s+/).slice(0, 2).map(part => part[0]).join("").toUpperCase() || "?";
  return <header className="sticky top-0 z-40 flex h-16 items-center justify-between gap-2 bg-white px-4 shadow-xs backdrop-blur-sm">
    <div className="flex items-center gap-2">
      {showBack && <button onClick={() => navigate(-1)} className="flex h-8 w-8 items-center justify-center rounded-xl text-surface-600 hover:bg-surface-100"><Icon name="ChevronLeft" size={20} /></button>}
      <span className="flex items-center gap-1 text-sm text-surface-600"><Icon name="MapPin" size={16} />Ubicación</span>
    </div>
    {title ? <h1 className="text-lg font-bold text-surface-900">{title}</h1> : showSearch ? <button onClick={() => navigate("/search")} className="min-w-0 flex-1"><div className="flex items-center gap-2 rounded-full bg-surface-100 px-3 py-2 text-sm text-surface-500"><Icon name="Search" size={16} /><span>Buscar en REYVENS…</span></div></button> : null}
    <div className="flex items-center gap-1">
      {showWallet && <button onClick={() => navigate("/wallet")} className="flex h-10 items-center gap-1 rounded-xl bg-gold-50 px-2 text-sm font-semibold text-gold-700" aria-label="Billetera"><Icon name="Wallet" size={16} /></button>}
      <Link to="/cart" className="relative flex h-10 w-10 items-center justify-center rounded-xl text-surface-600 hover:bg-surface-100" aria-label="Carrito"><Icon name="ShoppingCart" size={20} />{getItemCount() > 0 && <span className="absolute -top-1 -right-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-primary-600 px-1 text-[10px] font-bold text-white">{getItemCount() > 99 ? "99+" : getItemCount()}</span>}</Link>
      {user ? <><Link to="/history" title={user.name} className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-100 text-xs font-bold text-primary-700">{initials}</Link><button onClick={() => void logout().catch(() => undefined)} disabled={isLoading} className="flex h-9 w-9 items-center justify-center rounded-lg text-surface-500" aria-label="Cerrar sesión"><Icon name="LogOut" size={18} /></button></> : <Link to="/login" className="text-sm font-medium text-primary-700">Ingresar</Link>}
    </div>
  </header>;
};
