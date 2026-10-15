import { FC } from "react";
import { useNavigate } from "react-router-dom";
import { Icon } from "../../components/ui/Icon";
import { Button } from "../../components/ui/Button";

export const Welcome: FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-4 py-8">
      <div className="mb-2">
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary-100">
          <div className="relative">
            <div className="h-12 w-12 animate-bounce rounded-full bg-primary-600" />
            <Icon name="PartyPopper" size={24} className="absolute -top-2 -right-2 text-gold-400" />
          </div>
        </div>
      </div>

      <div className="text-center">
        <h1 className="text-3xl font-black text-surface-900">¡Felicidades!</h1>
        <p className="mt-2 text-lg font-semibold text-primary-600">
          Ya eres parte de Reyvens
        </p>
      </div>

      <p className="text-center text-sm text-surface-600">
        Tu cuenta está lista. Ya puedes explorar los productos publicados en REYVENS.
      </p>

      <div className="flex items-center gap-2 text-center text-xs text-surface-500">
        <div className="h-px flex-1 bg-surface-300" />
        <span>EXPLORA EL CATÁLOGO</span>
        <div className="h-px flex-1 bg-surface-300" />
      </div>

      <Button
        variant="primary"
        fullWidth
        size="lg"
        rightIcon="MapPin"
        onClick={() => navigate("/")}
      >
        Explorar catálogo
      </Button>
    </div>
  );
};
