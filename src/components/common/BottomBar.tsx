import { FC } from "react";
import { NavLink } from "react-router-dom";
import { Icon } from "../ui/Icon";
import { useCart } from "../../contexts/CartContext";

const items = [
  { label: "Inicio", path: "/", icon: "Home" },
  { label: "Catálogo", path: "/categories", icon: "LayoutGrid" },
  { label: "Recompensas", path: "/rewards", icon: "Award" },
  { label: "Carrito", path: "/cart", icon: "ShoppingCart" },
];

export const BottomBar: FC = () => {
  const { getItemCount } = useCart();
  const count = getItemCount();
  return (
    <nav aria-label="Navegación móvil" className="fixed inset-x-0 bottom-0 z-30 border-t border-surface-200 bg-white/95 pb-[env(safe-area-inset-bottom)] shadow-bottom-bar backdrop-blur lg:hidden">
      <div className="mx-auto grid h-16 max-w-xl grid-cols-4 items-center px-2">
        {items.map(item => <NavLink key={item.path} to={item.path} end={item.path === "/"} className={({ isActive }) => `flex min-h-12 flex-col items-center justify-center gap-1 rounded-xl text-[11px] font-medium transition-colors ${isActive ? "text-primary-800" : "text-surface-500 hover:bg-surface-50 hover:text-surface-900"}`}>
          {() => <>
            <span className="relative"><Icon name={item.icon} size={20} />{item.path === "/cart" && count > 0 && <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary-700 px-1 text-[9px] font-bold text-white">{count > 9 ? "9+" : count}</span>}</span>
            <span>{item.label}</span>
          </>}
        </NavLink>)}
      </div>
    </nav>
  );
};
