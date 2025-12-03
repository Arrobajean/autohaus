import { useContactForm } from "../hooks/useContactForm";
import { Checkbox } from "@/components/animate-ui/components/radix/checkbox";

const ContactForm = () => {
  const {
    formData,
    privacyAccepted,
    loading,
    handleChange,
    handleSubmit,
    setPrivacyAccepted,
    isFormValid,
  } = useContactForm();

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="nombre"
            className="block text-sm font-bold text-gray-700 mb-2 text-center md:text-left"
          >
            Tu nombre
          </label>
          <input
            type="text"
            id="nombre"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
            autoComplete="name"
            className="w-full px-4 py-3 border-0 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-all"
            style={{ backgroundColor: '#E0E0E0' }}
            placeholder="Juan Pérez"
          />
        </div>

        <div>
          <label
            htmlFor="telefono"
            className="block text-sm font-bold text-gray-700 mb-2 text-center md:text-left"
          >
            Tu teléfono
          </label>
          <input
            type="tel"
            id="telefono"
            name="telefono"
            value={formData.telefono}
            onChange={handleChange}
            required
            autoComplete="tel"
            className="w-full px-4 py-3 border-0 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-all"
            style={{ backgroundColor: '#E0E0E0' }}
            placeholder="+34 600 123 456"
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-bold text-gray-700 mb-2 text-center md:text-left"
          >
            Correo electrónico
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            autoComplete="email"
            className="w-full px-4 py-3 border-0 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-all"
            style={{ backgroundColor: '#E0E0E0' }}
            placeholder="juan@ejemplo.com"
          />
        </div>

        <div>
          <label
            htmlFor="mensaje"
            className="block text-sm font-bold text-gray-700 mb-2 text-center md:text-left"
          >
            Mensaje
          </label>
          <textarea
            id="mensaje"
            name="mensaje"
            value={formData.mensaje}
            onChange={handleChange}
            required
            rows={4}
            autoComplete="off"
            className="w-full px-4 py-3 border-0 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 resize-none transition-all text-wrap-safe"
            style={{ backgroundColor: '#E0E0E0' }}
            placeholder="Cuéntanos en qué podemos ayudarte..."
          />
        </div>

        <div className="flex items-start gap-3">
          <Checkbox
            id="privacy"
            checked={privacyAccepted}
            onCheckedChange={(checked) => setPrivacyAccepted(checked === true)}
            required
            className="mt-0.5"
          />
          <label
            htmlFor="privacy"
            className="text-sm text-gray-600 cursor-pointer flex-1 leading-relaxed"
          >
            Al enviar este mensaje, aceptas nuestra{" "}
            <a
              href="/privacy"
              className="text-gray-900 underline hover:text-gray-700"
            >
              Política de Privacidad
            </a>
            .
          </label>
        </div>

        <button
          type="submit"
          disabled={loading || !isFormValid()}
          className="relative inline-flex items-center justify-center w-full rounded-full bg-black text-white text-sm font-medium px-6 py-3 shadow-md hover:shadow-lg transition-all duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:hover:bg-gray-400 disabled:shadow-none"
        >
          {loading ? "Enviando..." : "Enviar"}
        </button>
      </form>
    </div>
  );
};

export default ContactForm;

