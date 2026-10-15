import { FC } from "react";
import { Icon } from "../../components/ui/Icon";

export const Rewards: FC = () => <div className="min-h-screen bg-gradient-to-b from-gold-50 to-white px-4 py-8"><div className="mx-auto max-w-md rounded-2xl bg-white p-6 text-center shadow-sm"><div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gold-50"><Icon name="Award" size={28} color="#D6A52A" /></div><h1 className="mt-4 text-xl font-bold text-surface-900">Recompensas REYVENS</h1><p className="mt-2 text-sm text-surface-600">Los puntos, niveles y canjes todavía no tienen una API conectada. No mostramos saldos simulados.</p><span className="mt-4 inline-block rounded-full bg-surface-100 px-3 py-1 text-xs text-surface-600">No disponible todavía</span></div></div>;

export default Rewards;
