import { FC } from "react";
import { Icon } from "../../components/ui/Icon";

export const Wallet: FC = () => <div className="page-container page-section"><div className="surface-card mx-auto max-w-xl px-6 py-10 text-center sm:px-10 sm:py-14"><div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-surface-100 text-surface-900"><Icon name="Wallet" size={28} /></div><p className="mt-5 text-sm font-semibold uppercase tracking-[0.12em] text-primary-800">REYVENS</p><h1 className="mt-1 text-2xl font-bold text-surface-900">Billetera</h1><p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-surface-600">La billetera interna y sus movimientos no tienen una API disponible. Los pagos se procesan por checkout externo; no hay saldo consultable aquí.</p><span className="mt-5 inline-flex items-center gap-2 rounded-full border border-surface-200 bg-surface-50 px-3 py-2 text-xs font-medium text-surface-700"><Icon name="Info" size={14} />No disponible todavía</span></div></div>;

export default Wallet;
