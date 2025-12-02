import { useState, useEffect } from "react";

interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  timestamp: string;
}

interface CookieConsent {
  consent: "accepted" | "rejected" | "configured" | null;
  preferences: CookiePreferences | null;
}

export const useCookieConsent = () => {
  const [cookieConsent, setCookieConsent] = useState<CookieConsent>({
    consent: null,
    preferences: null,
  });
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Cargar preferencias existentes
    const consent = localStorage.getItem("cookie-consent");
    const preferences = localStorage.getItem("cookie-preferences");

    console.log("Cookie consent loaded:", consent);
    console.log("Cookie preferences loaded:", preferences);

    setCookieConsent({
      consent: consent as "accepted" | "rejected" | "configured" | null,
      preferences: preferences ? JSON.parse(preferences) : null,
    });

    setIsLoaded(true);
  }, []);

  const acceptAllCookies = () => {
    const preferences: CookiePreferences = {
      necessary: true,
      analytics: true,
      marketing: true,
      timestamp: new Date().toISOString(),
    };

    localStorage.setItem("cookie-consent", "accepted");
    localStorage.setItem("cookie-preferences", JSON.stringify(preferences));

    setCookieConsent({
      consent: "accepted",
      preferences,
    });

    // Aplicar cookies según preferencias
    applyCookiePreferences(preferences);
  };

  const rejectNonEssentialCookies = () => {
    const preferences: CookiePreferences = {
      necessary: true,
      analytics: false,
      marketing: false,
      timestamp: new Date().toISOString(),
    };

    localStorage.setItem("cookie-consent", "rejected");
    localStorage.setItem("cookie-preferences", JSON.stringify(preferences));

    setCookieConsent({
      consent: "rejected",
      preferences,
    });

    // Aplicar cookies según preferencias
    applyCookiePreferences(preferences);
  };

  const updateCookiePreferences = (
    newPreferences: Partial<CookiePreferences>
  ) => {
    const currentPreferences = cookieConsent.preferences || {
      necessary: true,
      analytics: false,
      marketing: false,
      timestamp: new Date().toISOString(),
    };

    const updatedPreferences: CookiePreferences = {
      ...currentPreferences,
      ...newPreferences,
      timestamp: new Date().toISOString(),
    };

    localStorage.setItem("cookie-consent", "configured");
    localStorage.setItem(
      "cookie-preferences",
      JSON.stringify(updatedPreferences)
    );

    setCookieConsent({
      consent: "configured",
      preferences: updatedPreferences,
    });

    // Aplicar cookies según preferencias
    applyCookiePreferences(updatedPreferences);
  };

  const applyCookiePreferences = (preferences: CookiePreferences) => {
    // Aquí puedes implementar la lógica para aplicar las cookies según las preferencias
    // Por ejemplo, habilitar/deshabilitar Google Analytics, etc.

    if (preferences.analytics) {
      // Habilitar Google Analytics
      console.log("Analytics cookies habilitadas");
    } else {
      // Deshabilitar Google Analytics
      console.log("Analytics cookies deshabilitadas");
    }

    if (preferences.marketing) {
      // Habilitar cookies de marketing
      console.log("Marketing cookies habilitadas");
    } else {
      // Deshabilitar cookies de marketing
      console.log("Marketing cookies deshabilitadas");
    }
  };

  const hasConsent = () => {
    // Solo retornar true si las cookies están cargadas y hay consentimiento
    const result = isLoaded && cookieConsent.consent !== null;
    console.log("hasConsent check:", {
      isLoaded,
      consent: cookieConsent.consent,
      result,
    });
    return result;
  };

  const canUseAnalytics = () => {
    return cookieConsent.preferences?.analytics || false;
  };

  const canUseMarketing = () => {
    return cookieConsent.preferences?.marketing || false;
  };

  return {
    cookieConsent,
    isLoaded,
    acceptAllCookies,
    rejectNonEssentialCookies,
    updateCookiePreferences,
    hasConsent,
    canUseAnalytics,
    canUseMarketing,
  };
};
