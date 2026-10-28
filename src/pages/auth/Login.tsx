import { FC, FormEvent, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Logo } from "../../components/common/Logo";
import { Button } from "../../components/ui/Button";
import { Icon } from "../../components/ui/Icon";
import { useAuth } from "../../contexts/AuthContext";
import { authApi } from "../../services/auth";
import { userMessageFor } from "../../services/api";

type Mode = "login" | "register" | "forgot";

export const Login: FC = () => {
  const { login, register, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mode, setMode] = useState<Mode>("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [googleEnabled, setGoogleEnabled] = useState(false);
  const [googleChecking, setGoogleChecking] = useState(true);

  useEffect(() => {
    let active = true;
    void authApi.googleLoginEnabled()
      .then(enabled => { if (active) setGoogleEnabled(enabled); })
      .catch(() => { if (active) setGoogleEnabled(false); })
      .finally(() => { if (active) setGoogleChecking(false); });
    return () => { active = false; };
  }, []);

  const startGoogleLogin = () => {
    if (!googleEnabled || submitting) return;
    const from = (location.state as { from?: string } | null)?.from;
    window.location.assign(authApi.googleLoginUrl(from));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setMessage("");
    try {
      if (mode === "forgot") {
        setSubmitting(true);
        await authApi.forgotPassword(email);
        setMessage("Si la cuenta existe, recibirás instrucciones para recuperar tu contraseña.");
        return;
      }
      if (mode === "register") await register({ name, email, password, ...(phone ? { phone } : {}) });
      else await login(email, password);
      const from = (location.state as { from?: string } | null)?.from;
      navigate(from || "/", { replace: true });
    } catch (requestError) {
      setError(userMessageFor(requestError));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto grid min-h-[calc(100dvh-8rem)] w-full max-w-6xl content-center gap-8 px-4 py-8 sm:px-6 md:grid-cols-2 md:items-center md:gap-12 lg:gap-20">
      <section className="hidden md:block">
        <Logo size="lg" />
        <p className="mt-8 text-sm font-semibold uppercase tracking-[0.16em] text-primary-800">Marketplace local</p>
        <h1 className="mt-2 max-w-md text-4xl font-bold leading-tight tracking-tight text-surface-900">Lo que buscas, en REYVENS.</h1>
        <p className="mt-4 max-w-md text-base leading-7 text-surface-600">Explora productos publicados por tiendas locales y gestiona tus compras desde un solo lugar.</p>
        <div className="mt-8 h-1 w-16 rounded-full bg-primary-700" />
      </section>

      <section className="surface-card mx-auto w-full max-w-lg p-5 sm:p-8">
        <div className="mb-6 md:hidden"><Logo size="md" /></div>
        <p className="text-sm font-semibold uppercase tracking-[0.12em] text-primary-800">Tu cuenta REYVENS</p>
        <h2 className="mt-1 text-2xl font-bold tracking-tight text-surface-900">
          {mode === "login" ? "Inicia sesión" : mode === "register" ? "Crear cuenta" : "Recuperar contraseña"}
        </h2>
        <p className="mt-2 text-sm text-surface-600">{mode === "login" ? "Accede para continuar con tus compras." : mode === "register" ? "Completa tus datos para registrarte." : "Te enviaremos instrucciones si la cuenta existe."}</p>

        {mode === "login" && <div className="mt-6">
          <Button variant="outline" size="lg" fullWidth leftIcon={<GoogleMark />} onClick={startGoogleLogin} disabled={googleChecking || !googleEnabled || submitting}>
            {googleChecking ? "Comprobando Google…" : googleEnabled ? "Continuar con Google" : "Google no está disponible"}
          </Button>
          {!googleChecking && !googleEnabled && <p className="mt-2 text-center text-xs text-surface-500">El inicio con Google no está configurado.</p>}
          <div className="my-5 flex items-center gap-3 text-xs text-surface-500"><span className="h-px flex-1 bg-surface-200" />o continúa con tu correo<span className="h-px flex-1 bg-surface-200" /></div>
        </div>}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {mode === "register" && <div><label htmlFor="auth-name" className="mb-1.5 block text-sm font-medium text-surface-800">Nombre completo</label><input id="auth-name" required minLength={2} maxLength={150} autoComplete="name" value={name} onChange={event => setName(event.target.value)} placeholder="Nombre completo" className="form-field" /></div>}
          <div><label htmlFor="auth-email" className="mb-1.5 block text-sm font-medium text-surface-800">Correo electrónico</label><input id="auth-email" required type="email" autoComplete="email" value={email} onChange={event => setEmail(event.target.value)} placeholder="nombre@correo.com" className="form-field" /></div>
          {mode === "register" && <div><label htmlFor="auth-phone" className="mb-1.5 block text-sm font-medium text-surface-800">Teléfono <span className="font-normal text-surface-500">(opcional)</span></label><input id="auth-phone" type="tel" autoComplete="tel" value={phone} onChange={event => setPhone(event.target.value)} placeholder="Teléfono" className="form-field" /></div>}
          {mode !== "forgot" && <div><label htmlFor="auth-password" className="mb-1.5 block text-sm font-medium text-surface-800">Contraseña</label><input id="auth-password" required type="password" minLength={mode === "register" ? 8 : 1} maxLength={128} autoComplete={mode === "register" ? "new-password" : "current-password"} value={password} onChange={event => setPassword(event.target.value)} placeholder="Contraseña" className="form-field" /></div>}
          {error && <p role="alert" className="rounded-xl border border-primary-200 bg-primary-50 p-3 text-sm text-primary-900">{error}</p>}
          {message && <p role="status" className="rounded-xl border border-surface-300 bg-surface-50 p-3 text-sm text-surface-800">{message}</p>}
          <Button type="submit" variant="primary" fullWidth size="lg" disabled={isLoading || submitting}>{isLoading || submitting ? "Procesando…" : mode === "login" ? "Iniciar sesión" : mode === "register" ? "Crear cuenta" : "Enviar instrucciones"}</Button>
        </form>

        <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2 text-sm">
          {mode === "login" && <button type="button" onClick={() => setMode("forgot")} className="min-h-10 rounded-lg px-1 font-medium text-primary-800 underline underline-offset-2">Olvidé mi contraseña</button>}
          {mode !== "register" && <button type="button" onClick={() => { setMode("register"); setError(""); setMessage(""); }} className="min-h-10 rounded-lg px-1 font-medium text-primary-800 underline underline-offset-2">Crear cuenta</button>}
          {mode !== "login" && <button type="button" onClick={() => { setMode("login"); setError(""); setMessage(""); }} className="min-h-10 rounded-lg px-1 font-medium text-primary-800 underline underline-offset-2">Volver a iniciar sesión</button>}
        </div>
        <Link to="/" className="mt-5 inline-flex min-h-10 items-center gap-2 rounded-lg text-sm font-medium text-surface-600 hover:text-surface-900"><Icon name="ArrowLeft" size={16} />Continuar explorando</Link>
      </section>
    </div>
  );
};

const GoogleMark: FC = () => <svg aria-hidden="true" viewBox="0 0 48 48" className="h-5 w-5">
  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5Z" />
  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.89c-.58 2.96-2.25 5.48-4.73 7.18l7.29 5.66c4.25-3.92 6.7-9.7 6.7-17.31Z" />
  <path fill="#FBBC05" d="M10.53 28.59A14.4 14.4 0 0 1 9.75 24c0-1.59.27-3.13.75-4.59l-7.98-6.19A23.92 23.92 0 0 0 0 24c0 3.87.93 7.53 2.56 10.78l7.97-6.19Z" />
  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.91-5.79l-7.29-5.66c-2.02 1.35-4.6 2.15-8.62 2.15-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 43.62 14.62 48 24 48Z" />
</svg>;

export default Login;
