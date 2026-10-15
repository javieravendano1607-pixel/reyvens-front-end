import { FC } from "react";
import { Icon } from "../../components/ui/Icon";

export const Wallet: FC = () => <div className="min-h-screen bg-surface-50 px-4 py-8"><div className="mx-auto max-w-md rounded-2xl bg-white p-6 text-center shadow-sm"><div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary-50"><Icon name="Wallet" size={26} /></div><h1 className="mt-4 text-xl font-bold text-surface-900">Billetera REYVENS</h1><p className="mt-2 text-sm text-surface-600">La billetera interna y sus movimientos no tienen una API disponible. Los pagos se procesan por checkout externo; no hay saldo consultable aquí.</p><span className="mt-4 inline-block rounded-full bg-surface-100 px-3 py-1 text-xs text-surface-600">No disponible todavía</span></div></div>;

export default Wallet;
