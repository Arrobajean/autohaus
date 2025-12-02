import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ArrowRight, Phone as PhoneIcon } from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";

interface CallbackModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  triggerClassName?: string;
  buttonLabel?: string;
}

const CallbackModal: React.FC<CallbackModalProps> = ({
  open,
  setOpen,
  triggerClassName,
  buttonLabel = "¿Te llamamos?",
}) => {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    message: "",
    website: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [privacyAccepted, setPrivacyAccepted] = useState(false);

  function validatePhone(phone: string) {
    return /^[0-9\s\-\+]{7,16}$/.test(phone);
  }

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormErrors({});
    setError("");
    setSuccess(false);
    if (!privacyAccepted) {
      setError("Debes aceptar la política de privacidad.");
      return;
    }
    // Honeypot anti-spam
    if (form.website) return;
    // Validación avanzada
    const errors: { [key: string]: string } = {};
    if (!form.name.trim() || form.name.trim().length < 2)
      errors.name = "El nombre es obligatorio (mínimo 2 caracteres).";
    if (!form.phone.trim() || !validatePhone(form.phone.trim()))
      errors.phone = "Teléfono inválido.";
    if (
      form.message &&
      form.message.trim().length > 0 &&
      form.message.trim().length < 5
    )
      errors.message = "El comentario debe tener al menos 5 caracteres.";
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    setLoading(true);
    try {
      const lead = {
        name: form.name.trim(),
        phone: form.phone.trim(),
        message: form.message.trim(),
        fecha: Timestamp.now(),
        status: "nuevo",
        userAgent: navigator.userAgent,
      };
      await addDoc(collection(db, "callbacks"), lead);
      setSuccess(true);
      setForm({ name: "", phone: "", message: "", website: "" });
    } catch (err) {
      setError(
        "Hubo un error al enviar el mensaje. Inténtalo de nuevo más tarde."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (success) {
      setTimeout(() => setOpen(false), 1200);
    }
    // eslint-disable-next-line
  }, [success]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="lg"
          className={
            triggerClassName ||
            "group flex items-center glass-button-dark bg-black text-white hover:bg-gray-800 font-medium px-8 fast-transitions touch-optimized optimize-interactions shadow-glass hover:shadow-glass-lg border-0 transition-all duration-300 ease-out"
          }
        >
          <span>{buttonLabel}</span>
          <PhoneIcon
            size={20}
            className="ml-2 sm:opacity-0 sm:translate-x-4 sm:group-hover:opacity-100 sm:group-hover:translate-x-0 opacity-100 translate-x-0 transition-all duration-300 ease-out"
          />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>¿Quieres que te llamemos?</DialogTitle>
          <DialogDescription>
            Déjanos tus datos y te contactaremos lo antes posible.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleFormSubmit} className="space-y-4 mt-2">
          {/* Honeypot anti-spam */}
          <input
            type="text"
            name="website"
            value={form.website}
            onChange={handleFormChange}
            style={{ display: "none" }}
            tabIndex={-1}
            autoComplete="off"
          />
          {/* Checkbox de privacidad */}
          <div className="flex items-center mb-2">
            <input
              type="checkbox"
              id="callback-privacidad"
              checked={privacyAccepted}
              onChange={(e) => setPrivacyAccepted(e.target.checked)}
              required
              className="mr-2"
            />
            <label
              htmlFor="callback-privacidad"
              className="text-sm text-gray-700"
            >
              He leído y acepto la{" "}
              <a
                href="/politica-privacidad"
                target="_blank"
                className="underline"
              >
                Política de Privacidad
              </a>
              .
            </label>
          </div>
          <div>
            <label
              htmlFor="callback-name"
              className="block text-sm font-medium mb-1"
            >
              Nombre completo
            </label>
            <input
              type="text"
              id="callback-name"
              name="name"
              required
              value={form.name}
              onChange={handleFormChange}
              className="w-full px-3 py-2 rounded border border-gray-300 text-black"
              placeholder="Tu nombre"
              aria-invalid={!!formErrors.name}
              aria-describedby="error-callback-name"
            />
            {formErrors.name && (
              <p id="error-callback-name" className="text-red-500 text-xs mt-1">
                {formErrors.name}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="callback-phone"
              className="block text-sm font-medium mb-1"
            >
              Teléfono
            </label>
            <input
              type="tel"
              id="callback-phone"
              name="phone"
              required
              value={form.phone}
              onChange={handleFormChange}
              className="w-full px-3 py-2 rounded border border-gray-300 text-black"
              placeholder="Tu teléfono"
              aria-invalid={!!formErrors.phone}
              aria-describedby="error-callback-phone"
            />
            {formErrors.phone && (
              <p
                id="error-callback-phone"
                className="text-red-500 text-xs mt-1"
              >
                {formErrors.phone}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="callback-message"
              className="block text-sm font-medium mb-1"
            >
              Comentario (opcional)
            </label>
            <textarea
              id="callback-message"
              name="message"
              value={form.message}
              onChange={handleFormChange}
              className="w-full px-3 py-2 rounded border border-gray-300 text-black resize-none"
              placeholder="¿En qué podemos ayudarte?"
              rows={3}
              maxLength={140}
              aria-invalid={!!formErrors.message}
              aria-describedby="error-callback-message"
            />
            {formErrors.message && (
              <p
                id="error-callback-message"
                className="text-red-500 text-xs mt-1"
              >
                {formErrors.message}
              </p>
            )}
          </div>
          {error && <div className="text-red-500 text-sm">{error}</div>}
          {success && (
            <div className="text-green-600 text-sm">
              ¡Mensaje enviado correctamente! Te llamaremos pronto.
            </div>
          )}
          <DialogFooter>
            <Button
              type="submit"
              disabled={loading}
              className="group flex items-center justify-center"
            >
              <span>{loading ? "Enviando..." : "Solicitar llamada"}</span>
              <ArrowRight
                size={22}
                className="ml-2 sm:opacity-0 sm:translate-x-4 sm:group-hover:opacity-100 sm:group-hover:translate-x-0 opacity-100 translate-x-0 transition-all duration-300 ease-out"
              />
            </Button>
            <DialogClose asChild>
              <Button
                type="button"
                variant="ghost"
                className="group flex items-center justify-center"
              >
                <span>Cancelar</span>
                <ArrowRight
                  size={22}
                  className="ml-2 sm:opacity-0 sm:translate-x-4 sm:group-hover:opacity-100 sm:group-hover:translate-x-0 opacity-100 translate-x-0 transition-all duration-300 ease-out"
                />
              </Button>
            </DialogClose>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CallbackModal;
