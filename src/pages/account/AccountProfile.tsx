import { useEffect, useRef, useState, type FC, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { Icon } from "../../components/ui/Icon";
import { useAuth } from "../../contexts/AuthContext";
import { userMessageFor } from "../../services/api";
import { authApi } from "../../services/auth";

const phonePattern = /^[\d\s\-+()]{7,20}$/;

export const AccountProfile: FC = () => {
  const { user, updateUserProfile } = useAuth();
  const [name, setName] = useState(user?.name ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const sequence = useRef(0);
  const saveInFlight = useRef(false);

  useEffect(() => {
    setName(user?.name ?? "");
    setPhone(user?.phone ?? "");
  }, [user?.id, user?.name, user?.phone]);

  useEffect(() => () => { sequence.current += 1; }, []);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (saveInFlight.current) return;
    const cleanName = name.trim();
    const cleanPhone = phone.trim();
    setError("");
    setNotice("");
    if (cleanName.length < 2 || cleanName.length > 150) {
      setError("El nombre debe tener entre 2 y 150 caracteres.");
      return;
    }
    if (cleanPhone && !phonePattern.test(cleanPhone)) {
      setError("Escribe un teléfono válido de 7 a 20 caracteres.");
      return;
    }
    if (!user) return;
    saveInFlight.current = true;
    const requestId = ++sequence.current;
    const userId = user.id;
    setIsSaving(true);
    try {
      const updated = await authApi.updateProfile({ name: cleanName, phone: cleanPhone || null });
      if (requestId !== sequence.current || userId !== user.id) return;
      updateUserProfile({ name: updated.name, phone: updated.phone });
      setName(updated.name);
      setPhone(updated.phone ?? "");
      setNotice("Tus datos se actualizaron correctamente.");
    } catch (requestError) {
      if (requestId === sequence.current) setError(userMessageFor(requestError));
    } finally {
      saveInFlight.current = false;
      if (requestId === sequence.current) setIsSaving(false);
    }
  };

  return <div className="page-container page-section mx-auto max-w-3xl">
    <nav aria-label="Ruta de navegación" className="mb-6 flex items-center gap-2 text-xs font-medium text-surface-500">
      <Link to="/account" className="rounded-sm hover:text-surface-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-700">Mi cuenta</Link>
      <Icon name="ChevronRight" size={14} /><span aria-current="page" className="text-surface-800">Mi perfil</span>
    </nav>
    <div className="mb-6">
      <p className="text-[11px] font-semibold uppercase tracking-[.14em] text-primary-800">Configuración personal</p>
      <h1 className="mt-1 text-2xl font-bold tracking-tight text-surface-900 sm:text-3xl">Mi perfil</h1>
      <p className="mt-2 max-w-xl text-sm leading-6 text-surface-600">Mantén actualizados tu nombre y teléfono de contacto.</p>
    </div>
    <form onSubmit={event => void submit(event)} className="surface-card space-y-5 p-5 sm:p-7">
      <div>
        <label htmlFor="profile-name" className="mb-1.5 block text-sm font-semibold text-surface-800">Nombre</label>
        <input id="profile-name" name="name" autoComplete="name" required minLength={2} maxLength={150} value={name} disabled={isSaving} onChange={event => setName(event.target.value)} className="min-h-11 w-full rounded-xl border border-surface-300 bg-white px-3 text-sm text-surface-900 outline-none transition-colors placeholder:text-surface-400 focus-visible:border-primary-700 focus-visible:ring-2 focus-visible:ring-primary-700/20 disabled:bg-surface-50" />
      </div>
      <div>
        <label htmlFor="profile-email" className="mb-1.5 block text-sm font-semibold text-surface-800">Correo electrónico</label>
        <input id="profile-email" type="email" value={user?.email ?? ""} readOnly aria-describedby="profile-email-note" className="min-h-11 w-full rounded-xl border border-surface-200 bg-surface-50 px-3 text-sm text-surface-500 outline-none" />
        <p id="profile-email-note" className="mt-1.5 text-xs text-surface-500">El correo no se puede cambiar desde esta pantalla.</p>
      </div>
      <div>
        <label htmlFor="profile-phone" className="mb-1.5 block text-sm font-semibold text-surface-800">Teléfono <span className="font-normal text-surface-500">(opcional)</span></label>
        <input id="profile-phone" name="tel" type="tel" autoComplete="tel" maxLength={20} value={phone} disabled={isSaving} onChange={event => setPhone(event.target.value)} className="min-h-11 w-full rounded-xl border border-surface-300 bg-white px-3 text-sm text-surface-900 outline-none transition-colors placeholder:text-surface-400 focus-visible:border-primary-700 focus-visible:ring-2 focus-visible:ring-primary-700/20 disabled:bg-surface-50" />
        <p className="mt-1.5 text-xs text-surface-500">Puedes usar números, espacios, +, guiones y paréntesis.</p>
      </div>
      {error && <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-800">{error}</p>}
      {notice && <p role="status" className="rounded-xl bg-green-50 px-4 py-3 text-sm font-medium text-green-800">{notice}</p>}
      <div className="flex flex-col-reverse gap-3 border-t border-surface-100 pt-4 sm:flex-row sm:justify-end">
        <Link to="/account" className="inline-flex min-h-11 items-center justify-center rounded-xl border border-surface-300 px-5 text-sm font-semibold text-surface-700 hover:bg-surface-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-700">Volver</Link>
        <button type="submit" disabled={isSaving} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-primary-700 px-5 text-sm font-semibold text-white transition-colors hover:bg-primary-800 disabled:cursor-wait disabled:opacity-60">
          {isSaving && <span aria-hidden="true" className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white motion-reduce:animate-none" />}
          {isSaving ? "Guardando…" : "Guardar cambios"}
        </button>
      </div>
    </form>
  </div>;
};

export default AccountProfile;
