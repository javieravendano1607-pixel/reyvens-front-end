import type { FC } from "react";
import { useConnectivity } from "../../hooks/useConnectivity";
import { Icon } from "../ui/Icon";

export const ConnectivityNotice: FC = () => {
  const { isOnline, showRestoredNotice } = useConnectivity();
  if (isOnline && !showRestoredNotice) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className={`flex items-center justify-center gap-2 px-4 py-2 text-center text-xs font-medium ${isOnline ? "bg-surface-900 text-white" : "bg-surface-100 text-surface-800"}`}
    >
      <span aria-hidden="true"><Icon name={isOnline ? "Wifi" : "WifiOff"} size={15} /></span>
      {isOnline
        ? "Conexión recuperada. Puedes reintentar las secciones con error."
        : "Parece que no hay conexión. Algunas secciones podrían no estar disponibles."}
    </div>
  );
};
