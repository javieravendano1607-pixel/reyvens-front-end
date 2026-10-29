import { useState, type FC } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useFavorites } from "../../contexts/FavoritesContext";
import { userMessageFor } from "../../services/api";
import { Icon } from "../ui/Icon";

interface FavoriteButtonProps {
  productId: string;
  productName: string;
  disabled?: boolean;
  className?: string;
}

export const FavoriteButton: FC<FavoriteButtonProps> = ({ productId, productName, disabled = false, className = "" }) => {
  const { isAuthenticated } = useAuth();
  const { favoriteIds, pendingIds, setFavorite } = useFavorites();
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState("");
  const normalizedProductId = String(productId);
  const isFavorite = favoriteIds.has(normalizedProductId);
  const isPending = pendingIds.has(normalizedProductId);

  const toggle = async () => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: `${location.pathname}${location.search}` } });
      return;
    }
    setError("");
    try { await setFavorite(normalizedProductId, !isFavorite); }
    catch (requestError) { setError(userMessageFor(requestError)); }
  };

  return <>
    <button type="button" disabled={disabled || isPending} aria-pressed={isFavorite} aria-label={isFavorite ? `Quitar ${productName} de favoritos` : `Guardar ${productName} en favoritos`} title={!isAuthenticated ? "Inicia sesión para guardar este producto" : isFavorite ? "Quitar de favoritos" : "Guardar en favoritos"} onClick={event => { event.preventDefault(); event.stopPropagation(); void toggle(); }} className={className || "flex h-10 w-10 items-center justify-center rounded-full border border-surface-200 bg-white/95 text-surface-700 shadow-sm transition-colors hover:border-primary-200 hover:text-primary-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-700 disabled:cursor-wait disabled:opacity-60"}>
      <Icon name="Heart" size={19} className={isFavorite ? "fill-primary-700 text-primary-700" : ""} />
    </button>
    {error && <span role="alert" className="absolute right-0 top-12 z-20 w-48 rounded-lg border border-red-200 bg-white p-2 text-left text-xs font-medium text-red-800 shadow-lg">{error}</span>}
  </>;
};

export default FavoriteButton;
