import React, { useState, useEffect } from "react";
import { toast } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";
import { Cookie, Settings, Check, X } from "lucide-react";
import { useCookieConsent } from "@/hooks/useCookieConsent";

const CookieDialog = ({ toastId }: { toastId: string | number }) => {
  const [showConfig, setShowConfig] = useState(false);
  const {
    acceptAllCookies,
    rejectNonEssentialCookies,
    updateCookiePreferences,
    cookieConsent,
  } = useCookieConsent();

  const isAnalyticsEnabled = cookieConsent.preferences?.analytics ?? false;
  const isMarketingEnabled = cookieConsent.preferences?.marketing ?? false;

  const handleAccept = () => {
    acceptAllCookies();
    toast.dismiss(toastId);
    toast.success("Cookies aceptadas correctamente", {
      duration: 3000,
      position: "bottom-center",
    });
  };

  const handleReject = () => {
    rejectNonEssentialCookies();
    toast.dismiss(toastId);
    toast.success("Cookies rechazadas. Solo se usarán las necesarias.", {
      duration: 3000,
      position: "bottom-center",
    });
  };

  const handleSaveConfig = () => {
    toast.dismiss(toastId);
    toast.success("Preferencias guardadas.", {
      duration: 3000,
      position: "bottom-center",
    });
  };

  const handleToggleAnalytics = () => {
    updateCookiePreferences({ analytics: !isAnalyticsEnabled });
  };

  const handleToggleMarketing = () => {
    updateCookiePreferences({ marketing: !isMarketingEnabled });
  };

  if (showConfig) {
    return (
      <div className="flex flex-col space-y-4 p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Settings
              className="w-5 h-5 md:w-6 md:h-6 text-blue-600"
              aria-hidden="true"
            />
            <h4 className="font-semibold text-black text-base md:text-lg">
              Configurar Cookies
            </h4>
          </div>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setShowConfig(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            ← Volver
          </Button>
        </div>

        <div className="space-y-3 text-sm">
          <div className="flex items-center justify-between p-2 rounded-lg bg-white" style={{ backgroundColor: "#F5F4F2" }}>
            <div>
              <p className="font-medium text-black">Cookies Necesarias</p>
              <p className="text-xs text-gray-500">
                Para el funcionamiento del sitio.
              </p>
            </div>
            <div className="flex items-center gap-1 text-xs text-green-600 font-semibold">
              <Check size={14} aria-hidden="true" /> Activadas
            </div>
          </div>
          <div className="flex items-center justify-between p-2 rounded-lg">
            <div>
              <p className="font-medium text-black">Cookies de Analytics</p>
              <p className="text-xs text-gray-500">
                Nos ayudan a mejorar la web.
              </p>
            </div>
            <Button
              size="sm"
              variant={isAnalyticsEnabled ? "secondary" : "outline"}
              onClick={handleToggleAnalytics}
              className="text-xs h-8"
              aria-label={`${
                isAnalyticsEnabled ? "Desactivar" : "Activar"
              } cookies de analytics`}
            >
              {isAnalyticsEnabled ? (
                <X className="mr-2 h-4 w-4" aria-hidden="true" />
              ) : (
                <Check className="mr-2 h-4 w-4" aria-hidden="true" />
              )}
              {isAnalyticsEnabled ? "Desactivar" : "Activar"}
            </Button>
          </div>
          <div className="flex items-center justify-between p-2 rounded-lg">
            <div>
              <p className="font-medium text-black">Cookies de Marketing</p>
              <p className="text-xs text-gray-500">
                Para contenido y anuncios.
              </p>
            </div>
            <Button
              size="sm"
              variant={isMarketingEnabled ? "secondary" : "outline"}
              onClick={handleToggleMarketing}
              className="text-xs h-8"
              aria-label={`${
                isMarketingEnabled ? "Desactivar" : "Activar"
              } cookies de marketing`}
            >
              {isMarketingEnabled ? (
                <X className="mr-2 h-4 w-4" aria-hidden="true" />
              ) : (
                <Check className="mr-2 h-4 w-4" aria-hidden="true" />
              )}
              {isMarketingEnabled ? "Desactivar" : "Activar"}
            </Button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={handleReject}
            className="w-full text-sm"
          >
            Rechazar todas
          </Button>
          <Button
            onClick={handleSaveConfig}
            className="w-full bg-black text-white hover:bg-gray-800 text-sm"
          >
            Guardar y cerrar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-4 p-3">
      <div className="flex items-center space-x-3">
        <Cookie
          className="w-5 h-5 md:w-6 md:h-6 text-amber-600"
          aria-hidden="true"
        />
        <h4 className="font-semibold text-black text-base md:text-lg">
          Uso de Cookies
        </h4>
      </div>
      <p className="text-xs md:text-sm text-gray-600 leading-relaxed">
        Utilizamos cookies para mejorar su experiencia en nuestro sitio web.
        Algunas cookies de análisis son proporcionadas por Google Analytics y
        Firebase (Google LLC), lo que puede implicar la transferencia
        internacional de datos. Más información en la{" "}
        <a
          href="https://policies.google.com/privacy?hl=es"
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
          aria-label="Leer política de privacidad de Google (se abre en ventana nueva)"
        >
          política de privacidad de Google
        </a>
        .
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <Button
          size="sm"
          onClick={handleAccept}
          className="bg-black text-white hover:bg-gray-800 text-sm sm:col-span-2"
        >
          Aceptar todas
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={handleReject}
          className="text-sm"
        >
          Rechazar
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => setShowConfig(true)}
          className="text-sm"
        >
          Configurar
        </Button>
      </div>
    </div>
  );
};

const CookieConsent = () => {
  const { hasConsent, isLoaded } = useCookieConsent();

  useEffect(() => {
    if (isLoaded && !hasConsent()) {
      setTimeout(() => {
        toast.custom((t) => <CookieDialog toastId={t} />, {
          duration: Infinity,
          position: "bottom-center",
          className:
            "w-full max-w-sm md:max-w-md p-4 sm:p-0 rounded-lg shadow-lg",
          style: {
            background: "white",
            border: "1px solid #e5e7eb",
            borderRadius: "12px",
            boxShadow:
              "0 20px 25px -5px rgba(33, 33, 33, 0.1), 0 10px 10px -5px rgba(33, 33, 33, 0.04)",
          },
        });
      }, 2000);
    }
  }, [hasConsent, isLoaded]);

  return null;
};

export default CookieConsent;
