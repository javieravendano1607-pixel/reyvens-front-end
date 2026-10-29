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

export const AccountHome: FC = () => {
  const { user } = useAuth();
  const initials = user?.name.trim().split(/\s+/).slice(0, 2).map(part => part[0]).join("").toUpperCase() || "?";
  const firstName = user?.name.trim().split(/\s+/)[0] || "";

  return <div className="page-container page-section mx-auto max-w-5xl">
    <div className="mb-6 flex items-center gap-2 text-xs font-medium text-surface-500">
      <Link to="/" className="rounded-sm hover:text-surface-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-700">Inicio</Link>
      <Icon name="ChevronRight" size={14} />
      <span aria-current="page" className="text-surface-800">Mi cuenta</span>
    </div>

    <section className="relative overflow-hidden rounded-[1.75rem] bg-surface-900 p-5 text-white sm:p-7 lg:p-8">
      <div aria-hidden="true" className="absolute inset-y-0 right-0 w-1.5 bg-primary-700" />
      <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:gap-6">
        <div aria-hidden="true" className="flex h-[4.5rem] w-[4.5rem] shrink-0 items-center justify-center rounded-2xl border border-white/15 bg-white/10 text-xl font-bold tracking-wide text-white sm:h-20 sm:w-20 sm:text-2xl">
          {initials}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/60">Tu espacio personal</p>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-2.5 py-1 text-[10px] font-medium text-white/75">
              <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-primary-500" /> Cuenta personal
            </span>
          </div>
          <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">{firstName ? `Hola, ${firstName}` : "Mi cuenta"}</h1>
          <p className="mt-1 break-all text-sm text-white/75">{user?.email}</p>
        </div>
        <div className="border-t border-white/15 pt-4 text-sm sm:border-l sm:border-t-0 sm:pl-6 sm:pt-0">
          <p className="text-xs font-medium uppercase tracking-wide text-white/55">Teléfono</p>
          <p className="mt-1 font-medium text-white">{user?.phone || "Sin número registrado"}</p>
        </div>
      </div>
    </section>

    <section className="mt-9" aria-labelledby="account-options-title">
      <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-primary-800">Configuración personal</p>
          <h2 id="account-options-title" className="mt-1 text-xl font-bold tracking-tight text-surface-900 sm:text-2xl">Tu cuenta REYVENS</h2>
        </div>
        <p className="text-xs text-surface-500">Administra tus datos, acceso y compras.</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
        <AccountOption icon="UserRound" title="Mi perfil" description="Datos personales y de contacto." status="Próximamente" />
        <AccountOption to="/account/security" icon="ShieldCheck" title="Seguridad e inicio de sesión" description="Contraseña y cuentas vinculadas." />
        <AccountOption to="/history" icon="History" title="Compras y pedidos" description="Historial y seguimiento de tus pedidos." />
        <AccountOption to="/wallet" icon="CreditCard" title="Pagos y cobros" description="Consulta qué información de billetera está disponible." status="Información" />
        <AccountOption icon="Bell" title="Privacidad y notificaciones" description="Preferencias de privacidad y comunicaciones." status="Próximamente" />
      </div>
    </section>

    <section aria-labelledby="account-store-title" className="relative mt-6 overflow-hidden rounded-[1.75rem] border border-primary-200 bg-primary-50 p-5 sm:p-7 lg:flex lg:items-center lg:justify-between lg:gap-8 lg:p-8">
      <div aria-hidden="true" className="absolute inset-y-0 left-0 w-1.5 bg-primary-700" />
      <div className="relative flex items-start gap-4">
        <span aria-hidden="true" className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-primary-800 shadow-sm">
          <Icon name="Store" size={22} />
        </span>
        <div className="max-w-2xl">
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-primary-800">Crece con REYVENS</p>
          <h2 id="account-store-title" className="mt-1 text-xl font-bold tracking-tight text-surface-900 sm:text-2xl">Mi tienda</h2>
          <p className="mt-2 text-sm leading-6 text-surface-700">Vende en REYVENS. Crea tu tienda y administra tus productos desde tu misma cuenta.</p>
        </div>
      </div>
      <div className="relative mt-5 flex flex-col items-start gap-2 sm:flex-row sm:items-center lg:mt-0 lg:shrink-0 lg:flex-col lg:items-stretch">
        <button type="button" disabled aria-describedby="store-coming-soon" className="inline-flex min-h-11 cursor-not-allowed items-center justify-center gap-2 rounded-xl bg-primary-700 px-5 text-sm font-semibold text-white opacity-70">
          Crear mi tienda <Icon name="ArrowRight" size={17} />
        </button>
        <p id="store-coming-soon" className="text-xs text-surface-600">Creación de tiendas disponible próximamente.</p>
      </div>
    </section>
  </div>;
};

export default AccountHome;
