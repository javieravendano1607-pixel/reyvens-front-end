import { FC, FormEvent, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Logo } from "../../components/common/Logo";
import { Button } from "../../components/ui/Button";
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
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-4 py-8">
      <Logo size="lg" />
      <div className="w-full max-w-sm">
        <h1 className="mb-4 text-center text-xl font-bold text-surface-900">
          {mode === "login" ? "Inicia sesión" : mode === "register" ? "Crear cuenta" : "Recuperar contraseña"}
        </h1>
        {mode === "login" && <div className="mb-4 space-y-3">
          <Button
            variant="outline"
            size="lg"
            fullWidth
            leftIcon={<GoogleMark />}
            onClick={startGoogleLogin}
            disabled={googleChecking || !googleEnabled || submitting}
          >
            {googleChecking ? "Comprobando Google…" : googleEnabled ? "Continuar con Google" : "Google no está disponible"}
          </Button>
          {!googleChecking && !googleEnabled && <p className="text-center text-xs text-surface-500">El inicio con Google no está configurado.</p>}
          <div className="flex items-center gap-3 text-xs text-surface-400"><span className="h-px flex-1 bg-surface-200" />o con correo<span className="h-px flex-1 bg-surface-200" /></div>
        </div>}
        <form onSubmit={handleSubmit} className="space-y-3">
          {mode === "register" && (
            <input required minLength={2} maxLength={150} autoComplete="name" value={name} onChange={event => setName(event.target.value)} placeholder="Nombre completo" className="w-full rounded-xl border border-surface-300 px-4 py-3 text-sm" />
          )}
          <input required type="email" autoComplete="email" value={email} onChange={event => setEmail(event.target.value)} placeholder="Correo electrónico" className="w-full rounded-xl border border-surface-300 px-4 py-3 text-sm" />
          {mode === "register" && (
            <input type="tel" autoComplete="tel" value={phone} onChange={event => setPhone(event.target.value)} placeholder="Teléfono (opcional)" className="w-full rounded-xl border border-surface-300 px-4 py-3 text-sm" />
          )}
          {mode !== "forgot" && (
            <input required type="password" minLength={mode === "register" ? 8 : 1} maxLength={128} autoComplete={mode === "register" ? "new-password" : "current-password"} value={password} onChange={event => setPassword(event.target.value)} placeholder="Contraseña" className="w-full rounded-xl border border-surface-300 px-4 py-3 text-sm" />
          )}
          {error && <p role="alert" className="text-sm text-primary-700">{error}</p>}
          {message && <p role="status" className="text-sm text-green-700">{message}</p>}
          <Button type="submit" variant="primary" fullWidth size="lg" disabled={isLoading || submitting}>
            {isLoading || submitting ? "Procesando..." : mode === "login" ? "Iniciar sesión" : mode === "register" ? "Crear cuenta" : "Enviar instrucciones"}
          </Button>
        </form>
        <div className="mt-4 flex flex-wrap justify-center gap-x-4 gap-y-2 text-sm">
          {mode === "login" && <button type="button" onClick={() => setMode("forgot")} className="text-primary-700 underline">Olvidé mi contraseña</button>}
          {mode !== "register" && <button type="button" onClick={() => { setMode("register"); setError(""); setMessage(""); }} className="text-primary-700 underline">Crear cuenta</button>}
          {mode !== "login" && <button type="button" onClick={() => { setMode("login"); setError(""); setMessage(""); }} className="text-primary-700 underline">Volver a iniciar sesión</button>}
        </div>
        {mode === "register" && <p className="mt-4 text-center text-xs text-surface-500">El registro está disponible con tu correo.</p>}
      </div>
      <Link to="/" className="text-sm text-surface-600">Continuar explorando</Link>
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
