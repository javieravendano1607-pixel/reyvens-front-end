import { FC } from "react";
import { useNavigate } from "react-router-dom";
import { Logo } from "../../components/common/Logo";
import { Icon } from "../../components/ui/Icon";
import { Button } from "../../components/ui/Button";

export const Location: FC = () => {
  const navigate = useNavigate();
  return <div className="mx-auto flex min-h-screen max-w-2xl flex-col items-center justify-center gap-6 px-4 py-8 sm:px-8"><Logo size="md" /><div className="text-center"><p className="text-sm font-semibold uppercase tracking-[0.12em] text-primary-800">REYVENS</p><h1 className="mt-1 text-2xl font-bold text-surface-900">Ubicación</h1><p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-surface-600">La ubicación por ciudad todavía no está conectada al backend. Puedes agregar una dirección de entrega desde tu carrito.</p></div><div className="flex items-center gap-2 rounded-full border border-surface-200 bg-white px-4 py-2 text-sm text-surface-700"><Icon name="MapPin" size={16} className="text-primary-800" /><span>Sin ubicación configurada</span></div><Button variant="primary" fullWidth size="lg" className="max-w-sm" onClick={() => navigate("/")}>Continuar al catálogo</Button></div>;
};

export default Location;
