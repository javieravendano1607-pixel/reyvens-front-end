import { FC } from "react";
import { Link, useLocation } from "react-router-dom";
import { Icon } from "../ui/Icon";
import { useCart } from "../../contexts/CartContext";

interface NavItem {
  id: string;
  label: string;
  icon: string;
  path: string;
}

const sideNavItems: NavItem[] = [
  { id: "home", label: "Inicio", icon: "Home", path: "/" },
  { id: "cart", label: "Carrito", icon: "ShoppingCart", path: "/cart" },
];

export const BottomBar: FC = () => {
  const location = useLocation();
  const { getItemCount } = useCart();
  const cartCount = getItemCount();

  return (
    <nav className="fixed bottom-0 left-0 z-30 mx-auto mb-2 flex w-full max-w-sm flex-col bg-white pb-[calc(8px+env(safe-area-inset-bottom))] pl-[calc(16px+env(safe-area-inset-left))] pr-[calc(16px+env(safe-area-inset-right))] shadow-bottom-bar">
      <div className="relative flex h-16 items-center justify-around rounded-t-2xl px-2">
        {sideNavItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link key={item.id} to={item.path} className="flex flex-col items-center">
              <div
                className={`relative flex h-11 w-11 items-center justify-center rounded-full transition-all duration-200 ${
                  isActive
                    ? "bg-primary-600 text-white"
                    : "text-surface-500 hover:bg-surface-100"
                }`}
              >
                <Icon name={item.icon} size={20} />
                {item.id === "cart" && cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 min-w-[16px] items-center justify-center rounded-full bg-primary-600 px-0.5 text-[9px] font-bold text-white">
                    {cartCount > 9 ? "9+" : cartCount}
                  </span>
                )}
              </div>
              <span className="mt-0.5 text-[10px] font-medium text-surface-600">
                {item.label}
              </span>
            </Link>
          );
        })}

        <Link to="/rewards" className="absolute left-1/2 -translate-x-1/2">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary-600 text-white shadow-xl hover:bg-primary-700 active:scale-95 transition-all duration-200">
            <Icon name="Scan" size={24} />
          </div>
        </Link>
      </div>
    </nav>
  );
};


