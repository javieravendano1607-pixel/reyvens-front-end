import { FC, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/Button";
import { Icon } from "../../components/ui/Icon";
import { useAuth } from "../../contexts/AuthContext";

function safeReturnTo(value: string | null): string {
  if (!value || !value.startsWith("/") || value.startsWith("//") || value.includes("\\")) return "/";
  try {
    const target = new URL(value, window.location.origin);
    return target.origin === window.location.origin ? `${target.pathname}${target.search}${target.hash}` : "/";
  } catch {
    return "/";
  }
}

export const GoogleLoginCallback: FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuth();
  const [message, setMessage] = useState("Comprobando tu sesión segura…");
  const params = new URLSearchParams(location.search);
  const status = params.get("status");
  const returnTo = safeReturnTo(params.get("returnTo"));

  useEffect(() => {
    if (status === "cancelled") {
      setMessage("Cancelaste el acceso con Google. Puedes iniciar sesión con tu correo cuando quieras.");
      return;
    }
    if (status === "account_exists") {
      setMessage("Ya existe una cuenta REYVENS con ese correo. Inicia sesión con tu método habitual y luego abre Cuenta → Seguridad para vincular Google. No cambiaremos tu correo ni tu contraseña.");
      return;
    }
    if (status === "link_cancelled") {
      setMessage("Cancelaste la vinculación con Google. No se hicieron cambios en tu cuenta.");
      return;
    }
    if (status === "link_conflict") {
      setMessage("Esta cuenta de Google ya está vinculada a otra cuenta REYVENS, o tu cuenta ya tiene otro Google vinculado. No movimos ni combinamos cuentas.");
      return;
    }
    if (status === "link_session_expired") {
      setMessage("Tu sesión venció antes de completar la vinculación. Inicia sesión con tu método habitual y vuelve a Cuenta → Seguridad para intentarlo otra vez.");
      return;
    }
    if (status === "linked") {
      if (isLoading) return;
      setMessage(isAuthenticated
        ? "Google quedó vinculado a tu cuenta REYVENS. Ya puedes usarlo para iniciar sesión."
        : "Google se vinculó, pero no pudimos restaurar tu sesión. Inicia sesión con tu método habitual para continuar.");
      return;
    }
    if (status !== "success") {
      setMessage("No fue posible iniciar sesión con Google. Si ya tienes una cuenta, intenta con tu correo y contraseña.");
      return;
    }
    if (isLoading) return;
    if (isAuthenticated) {
      navigate(returnTo, { replace: true });
      return;
    }
    setMessage("No pudimos restaurar tu sesión. Comprueba la conexión e inténtalo de nuevo.");
  }, [status, isLoading, isAuthenticated, navigate, returnTo]);

  const pending = isLoading && (
    status === "success" ||
    status === "linked" ||
    status === "link_cancelled" ||
    status === "link_conflict"
  );
  const actionHref = status === "linked" || status === "link_cancelled" || status === "link_conflict"
    ? isAuthenticated ? "/account/security" : "/login"
    : "/login";
  const actionLabel = status === "account_exists"
    ? "Iniciar sesión con mi método habitual"
    : status === "linked" && isAuthenticated
      ? "Volver a seguridad de la cuenta"
      : status === "link_cancelled" || status === "link_conflict"
        ? isAuthenticated ? "Volver a mi cuenta" : "Iniciar sesión"
        : "Volver al inicio de sesión";
  const heading = pending
    ? "Un momento"
    : status === "account_exists"
      ? "Ya tienes una cuenta REYVENS"
      : status === "linked"
        ? "Google quedó vinculado"
        : status === "link_cancelled"
          ? "Vinculación cancelada"
          : status === "link_conflict"
            ? "No se pudo vincular Google"
            : status === "link_session_expired"
              ? "Tu sesión venció"
              : status === "cancelled"
                ? "Acceso cancelado"
                : status === "success" && isAuthenticated
                  ? "Sesión iniciada"
                  : "No se pudo completar el acceso";

  return <main className="flex min-h-[60vh] w-full items-center px-4 py-10">
    <section className="card-surface w-full text-center" aria-live="polite">
      {pending
        ? <div className="mx-auto mb-5 h-8 w-8 animate-spin rounded-full border-2 border-surface-200 border-t-primary-700 motion-reduce:animate-none" aria-hidden="true" />
        : <Icon name={status === "cancelled" || status === "link_cancelled" ? "XCircle" : status === "success" && isAuthenticated || status === "linked" ? "CheckCircle2" : "AlertCircle"} size={34} className="mx-auto mb-4 text-primary-700" />}
      <h1 className="text-xl font-bold text-surface-900">{heading}</h1>
      <p className="mt-2 text-sm leading-6 text-surface-600">{message}</p>
      {!pending && <div className="mt-6 flex flex-col justify-center gap-3">
        <Button variant="primary" fullWidth onClick={() => navigate(actionHref, { replace: true })}>{actionLabel}</Button>
        <Link to="/" className="inline-flex min-h-10 items-center justify-center rounded-lg text-sm font-medium text-surface-600 hover:text-surface-900">Continuar explorando</Link>
      </div>}
    </section>
  </main>;
};

export default GoogleLoginCallback;
