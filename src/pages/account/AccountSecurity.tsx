import { FC, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "../../components/ui/Button";
import { Icon } from "../../components/ui/Icon";
import { useAuth } from "../../contexts/AuthContext";
import { authApi, type GoogleLinkStatus } from "../../services/auth";
import { userMessageFor } from "../../services/api";

export const AccountSecurity: FC = () => {
  const { user } = useAuth();
  const [status, setStatus] = useState<GoogleLinkStatus | null>(null);
  const [checking, setChecking] = useState(true);
  const [linking, setLinking] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    const controller = new AbortController();
    void authApi.googleLinkStatus(controller.signal)
      .then(result => { if (active) setStatus(result); })
      .catch(requestError => { if (active) setError(userMessageFor(requestError)); })
      .finally(() => { if (active) setChecking(false); });
    return () => { active = false; controller.abort(); };
  }, []);

  const startLinking = async () => {
    if (!status?.enabled || status.linked || linking) return;
    setError("");
    setLinking(true);
    try {
      const authorizationUrl = await authApi.startGoogleLink("/account/security");
      window.location.assign(authorizationUrl);
    } catch (requestError) {
      setError(userMessageFor(requestError));
      setLinking(false);
    }
  };

  return <div className="mx-auto w-full max-w-xl px-4 py-8">
    <section className="card-surface">
      <p className="text-xs font-semibold uppercase tracking-wider text-primary-700">Tu cuenta REYVENS</p>
      <h1 className="mt-2 text-2xl font-bold text-surface-900">Seguridad e inicio de sesión</h1>
      <p className="mt-2 text-sm leading-6 text-surface-600">Administra las formas de acceder a tu cuenta.</p>

      <div className="mt-6 rounded-xl border border-surface-200 p-4">
        <div className="flex items-start gap-3">
          <Icon name="Mail" size={20} className="mt-0.5 shrink-0 text-primary-700" />
          <div className="min-w-0">
            <h2 className="font-semibold text-surface-900">Correo de la cuenta</h2>
            <p className="mt-1 break-all text-sm text-surface-600">{user?.email}</p>
          </div>
        </div>
      </div>

      <div className="mt-4 rounded-xl border border-surface-200 p-4">
        <div className="flex items-start gap-3">
          <Icon name="ShieldCheck" size={21} className="mt-0.5 shrink-0 text-primary-700" />
          <div className="min-w-0 flex-1">
            <h2 className="font-semibold text-surface-900">Google</h2>
            <p className="mt-1 text-sm leading-6 text-surface-600">
              {status?.linked
                ? "Tu cuenta de Google está vinculada. Puedes usarla para iniciar sesión."
                : "Vincula Google después de iniciar sesión con tu método habitual. No cambiaremos tu correo ni tu contraseña."}
            </p>
            {error && <p role="alert" className="mt-3 rounded-lg border border-primary-200 bg-primary-50 p-3 text-sm text-primary-800">{error}</p>}
            <div className="mt-4">
              {status?.linked
                ? <span className="inline-flex items-center gap-2 text-sm font-semibold text-surface-900"><Icon name="CheckCircle2" size={17} className="text-primary-700" /> Vinculado</span>
                : <Button variant="outline" leftIcon="ShieldCheck" onClick={() => void startLinking()} disabled={checking || linking || !status?.enabled}>
                  {checking ? "Comprobando…" : linking ? "Conectando con Google…" : status?.enabled ? "Vincular Google" : "Google no está disponible"}
                </Button>}
            </div>
            {!checking && status && !status.enabled && <p className="mt-2 text-xs text-surface-500">La vinculación de Google no está disponible en este momento.</p>}
          </div>
        </div>
      </div>

      <Link to="/" className="mt-6 inline-flex min-h-10 items-center gap-2 rounded-lg text-sm font-medium text-surface-600 hover:text-surface-900">
        <Icon name="ArrowLeft" size={16} /> Volver a REYVENS
      </Link>
    </section>
  </div>;
};

export default AccountSecurity;
