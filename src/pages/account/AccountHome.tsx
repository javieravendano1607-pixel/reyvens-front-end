import type { FC, ReactNode } from "react";
import { Link } from "react-router-dom";
import { Icon } from "../../components/ui/Icon";
import type { IconName } from "../../components/ui/Icon";
import { useAuth } from "../../contexts/AuthContext";

interface AccountOptionProps {
  title: string;
  description: string;
  icon: IconName;
  to?: string;
  status?: string;
}

const AccountOption: FC<AccountOptionProps> = ({ title, description, icon, to, status }) => {
  const isNavigable = Boolean(to);
  const content: ReactNode = <>
    <span aria-hidden="true" className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${isNavigable ? "bg-surface-100 text-surface-900 transition-colors group-hover:bg-primary-50 group-hover:text-primary-800" : "bg-surface-100 text-surface-500"}`}>
      <Icon name={icon} size={20} />
    </span>
    <span className="min-w-0 flex-1">
      <span className="flex flex-wrap items-center gap-2">
        <span className="font-semibold text-surface-900">{title}</span>
        {status && <span className="rounded-full bg-surface-100 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-surface-600">{status}</span>}
      </span>
      <span className="mt-1 block text-sm leading-5 text-surface-600">{description}</span>
    </span>
    {to && <span aria-hidden="true" className="shrink-0 text-surface-400 transition-transform group-hover:translate-x-0.5 group-hover:text-primary-700"><Icon name="ChevronRight" size={19} /></span>}
  </>;

  const baseClass = "flex min-h-[92px] items-center gap-3 rounded-2xl border border-surface-200 p-4 sm:p-5";

  return to
    ? <Link to={to} className={`group ${baseClass} bg-white transition-colors hover:border-surface-300 hover:bg-surface-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-700`} aria-label={`${title}. ${description}`}>{content}</Link>
    : <div className={`${baseClass} bg-surface-50/60`} aria-label={`${title}. ${status ?? "Próximamente"}. ${description}`}>{content}</div>;
};

const ActivityOption: FC<AccountOptionProps> = ({ title, description, icon, to, status }) => {
  const content = <>
    <span aria-hidden="true" className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${to ? "bg-surface-900 text-white transition-colors group-hover:bg-primary-700" : "bg-surface-100 text-surface-500"}`}>
      <Icon name={icon} size={21} />
    </span>
    <span className="min-w-0 flex-1">
      <span className="flex flex-wrap items-center gap-2">
        <span className="font-semibold text-surface-900">{title}</span>
        {status && <span className="rounded-full bg-surface-100 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-surface-600">{status}</span>}
      </span>
      <span className="mt-1 block text-sm leading-5 text-surface-600">{description}</span>
    </span>
    {to
      ? <span aria-hidden="true" className="shrink-0 text-surface-400 transition-transform group-hover:translate-x-0.5 group-hover:text-primary-700"><Icon name="ChevronRight" size={19} /></span>
      : <span aria-hidden="true" className="shrink-0 text-surface-400"><Icon name="Clock3" size={17} /></span>}
  </>;
  const className = "flex min-h-[104px] items-center gap-3 rounded-2xl border p-4 sm:p-5";

  return to
    ? <Link to={to} className={`group ${className} border-surface-200 bg-white transition-colors hover:border-surface-300 hover:bg-surface-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-700`} aria-label={`${title}. ${description}`}>{content}</Link>
    : <div className={`${className} border-dashed border-surface-300 bg-surface-50/70`} aria-label={`${title}. Próximamente. ${description}`}>{content}</div>;
};

export const AccountHome: FC = () => {
  const { user } = useAuth();
  const initials = user?.name.trim().split(/\s+/).slice(0, 2).map(part => part[0]).join("").toUpperCase() || "?";

  return <div className="page-container page-section mx-auto max-w-5xl">
    <div className="mb-6 flex items-center gap-2 text-xs font-medium text-surface-500">
      <Link to="/" className="rounded-sm hover:text-surface-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-700">Inicio</Link>
      <Icon name="ChevronRight" size={14} />
      <span aria-current="page" className="text-surface-800">Mi cuenta</span>
    </div>

    <section className="relative isolate overflow-hidden rounded-[1.75rem] bg-surface-900 p-5 text-white sm:p-7 lg:p-8">
      <div aria-hidden="true" className="absolute inset-y-0 right-0 w-1.5 bg-primary-700" />
      <div aria-hidden="true" className="absolute -right-16 -top-24 h-64 w-64 rounded-full border-[34px] border-white/[.035] sm:-right-10 sm:-top-36 sm:h-80 sm:w-80" />
      <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:gap-6">
        <div aria-label={`Avatar de ${user?.name || "la persona usuaria"}`} role="img" className="flex h-24 w-24 shrink-0 items-center justify-center rounded-[1.65rem] border border-white/20 bg-white text-2xl font-bold tracking-wide text-surface-900 shadow-[0_14px_34px_-18px_rgba(0,0,0,.7)] ring-4 ring-white/10 sm:h-28 sm:w-28 sm:rounded-[2rem] sm:text-3xl">
          {initials}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/60">Tu espacio REYVENS</p>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary-400/30 bg-primary-700/20 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-white">
              <Icon name="ShoppingBag" size={12} /> Comprador
            </span>
          </div>
          <h1 className="mt-2 break-words text-2xl font-bold tracking-tight sm:text-3xl">{user?.name || "Mi cuenta"}</h1>
          <p className="mt-1 break-all text-sm text-white/75">{user?.email}</p>
        </div>
      </div>
    </section>

    <section className="mt-8" aria-labelledby="account-activity-title">
      <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-primary-800">Tu recorrido en REYVENS</p>
          <h2 id="account-activity-title" className="mt-1 text-xl font-bold tracking-tight text-surface-900 sm:text-2xl">Mi actividad</h2>
        </div>
        <p className="text-xs text-surface-500">Pedidos, productos y entregas en un solo lugar.</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
        <ActivityOption to="/history" icon="History" title="Mis pedidos" description="Historial y seguimiento de tus compras." />
        <ActivityOption icon="Heart" title="Mis favoritos" description="Guarda productos para volver a encontrarlos." status="Próximamente" />
        <ActivityOption icon="MapPin" title="Mis direcciones" description="Administra tus direcciones de entrega." status="Próximamente" />
      </div>
    </section>

    <section className="mt-9" aria-labelledby="account-options-title">
      <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-primary-800">Configuración personal</p>
          <h2 id="account-options-title" className="mt-1 text-xl font-bold tracking-tight text-surface-900 sm:text-2xl">Tu cuenta REYVENS</h2>
        </div>
        <p className="text-xs text-surface-500">Administra tus datos y preferencias.</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
        <AccountOption icon="UserRound" title="Mi perfil" description="Datos personales y de contacto." status="Próximamente" />
        <AccountOption to="/account/security" icon="ShieldCheck" title="Seguridad e inicio de sesión" description="Contraseña y cuentas vinculadas." />
        <AccountOption to="/wallet" icon="CreditCard" title="Pagos y cobros" description="Consulta qué información de billetera está disponible." status="Información" />
        <AccountOption icon="Bell" title="Privacidad y notificaciones" description="Preferencias de privacidad y comunicaciones." status="Próximamente" />
      </div>
    </section>

    <section aria-labelledby="account-store-title" className="relative mt-8 overflow-hidden rounded-[1.75rem] bg-surface-900 text-white shadow-[0_24px_60px_-42px_rgba(0,0,0,.75)] sm:mt-10">
      <div aria-hidden="true" className="absolute inset-y-0 left-0 w-1.5 bg-primary-600" />
      <div aria-hidden="true" className="absolute -right-16 -top-24 h-72 w-72 rounded-full border-[38px] border-white/[.045] sm:-right-8 sm:-top-40 sm:h-96 sm:w-96" />
      <div className="relative grid gap-7 p-5 sm:p-7 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center lg:gap-10 lg:p-9">
        <div className="flex items-start gap-4 sm:gap-5">
          <span aria-hidden="true" className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white text-primary-800 shadow-lg shadow-black/20 sm:h-16 sm:w-16">
            <Icon name="Store" size={27} />
          </span>
          <div className="max-w-2xl">
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-primary-300">Crece con REYVENS</p>
            <h2 id="account-store-title" className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">Mi tienda</h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-white/75">Vende en REYVENS. Crea tu tienda y administra tus productos desde tu misma cuenta.</p>
          </div>
        </div>
        <div className="flex flex-col gap-2 lg:min-w-56">
          <button type="button" disabled aria-describedby="store-coming-soon" className="inline-flex min-h-12 cursor-not-allowed items-center justify-center gap-2 rounded-xl bg-primary-700 px-5 text-sm font-semibold text-white shadow-sm shadow-black/20 opacity-90">
            Crear mi tienda <Icon name="ArrowRight" size={17} />
          </button>
          <p id="store-coming-soon" className="flex items-center justify-center gap-1.5 text-xs text-white/65"><Icon name="Clock3" size={13} /> Disponible próximamente</p>
        </div>
      </div>
    </section>
  </div>;
};

export default AccountHome;
