import { FC } from "react";
import { useNavigate } from "react-router-dom";
import { Logo } from "../../components/common/Logo";
import { Icon } from "../../components/ui/Icon";
import { Button } from "../../components/ui/Button";

export const Location: FC = () => {
  const navigate = useNavigate();
  return <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-4 py-8"><Logo size="md" /><div className="text-center"><h1 className="text-2xl font-black text-surface-900">Ubicación</h1><p className="mt-2 max-w-sm text-sm text-surface-600">La ubicación por ciudad todavía no está conectada al backend. Puedes agregar una dirección de entrega desde tu carrito.</p></div><div className="flex items-center gap-2 text-xs text-surface-500"><Icon name="MapPin" size={14} /><span>No se ha guardado ninguna ciudad ficticia.</span></div><Button variant="primary" fullWidth size="lg" onClick={() => navigate("/")}>Continuar al catálogo</Button></div>;
};

export default Location;
