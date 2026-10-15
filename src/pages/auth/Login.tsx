import { FC, FormEvent, useState } from "react";
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
        {mode !== "forgot" && <p className="mt-4 text-center text-xs text-surface-500">El ingreso con Google o Apple todavía no está conectado.</p>}
      </div>
      <Link to="/" className="text-sm text-surface-600">Continuar explorando</Link>
    </div>
  );
};

export default Login;
