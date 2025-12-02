import { useState } from "react";
import { toast } from "@/components/ui/sonner";

export interface ContactFormData {
  nombre: string;
  email: string;
  telefono: string;
  mensaje: string;
}

const initialFormData: ContactFormData = {
  nombre: "",
  email: "",
  telefono: "",
  mensaje: "",
};

export const useContactForm = () => {
  const [formData, setFormData] = useState<ContactFormData>(initialFormData);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const isFormValid = () => {
    return (
      formData.nombre.trim() !== "" &&
      formData.email.trim() !== "" &&
      formData.telefono.trim() !== "" &&
      formData.mensaje.trim() !== "" &&
      privacyAccepted
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!privacyAccepted) {
      toast.error("Por favor acepta la política de privacidad");
      return;
    }
    if (!isFormValid()) {
      toast.error("Por favor completa todos los campos");
      return;
    }
    setLoading(true);

    setTimeout(() => {
      toast.success("Mensaje enviado correctamente", {
        description: "Nos pondremos en contacto contigo pronto.",
      });
      setFormData(initialFormData);
      setPrivacyAccepted(false);
      setLoading(false);
    }, 1000);
  };

  return {
    formData,
    privacyAccepted,
    loading,
    handleChange,
    handleSubmit,
    setPrivacyAccepted,
    isFormValid,
  };
};

