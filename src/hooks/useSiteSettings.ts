import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc, serverTimestamp, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { SEOSettings, HomepageSettings, SiteSettings, EmailSettings } from '@/types';
import { toast } from 'sonner';

const DEFAULT_SEO: SEOSettings = {
  siteTitle: 'AutoHaus - Concesionario de Vehículos',
  siteDescription: 'AutoHaus: Concesionario especializado en vehículos. Amplia selección de coches nuevos y de ocasión. Más de 15 años de experiencia.',
  keywords: 'concesionario, coches, vehículos, autos, madrid, ocasión, nuevos',
  ogImageUrl: 'https://autohaus.es/images/logo/autohaus.png',
  ogSiteName: 'AutoHaus',
  twitterCard: 'summary_large_image',
  canonicalUrl: 'https://autohaus.es/',
  faviconUrl: '/favicon/favicon.ico',
};

const DEFAULT_HOMEPAGE: HomepageSettings = {
  heroTitle: 'Tu concesionario de confianza en Madrid',
  heroSubtitle: 'Descubre una selección exclusiva de vehículos de lujo diseñados para el rendimiento.',
  heroImageUrl: '/images/UI/hero.png',
  featuredCarsCount: 6,
  sectionsEnabled: {
    trustedBrands: true,
    featuredVehicles: true,
    whyChoose: true,
    stats: true,
    reviews: true,
    faq: true,
  },
};

const DEFAULT_EMAILS: EmailSettings = {
  contactEmail: '',
  callbackEmail: '',
};

export const useSiteSettings = () => {
  const [seoSettings, setSeoSettings] = useState<SEOSettings>(DEFAULT_SEO);
  const [homepageSettings, setHomepageSettings] = useState<HomepageSettings>(DEFAULT_HOMEPAGE);
  const [emailSettings, setEmailSettings] = useState<EmailSettings>(DEFAULT_EMAILS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!db) {
      setLoading(false);
      return;
    }

    const settingsRef = doc(db, 'settings', 'site');
    
    // Listener en tiempo real para actualizaciones automáticas
    const unsubscribe = onSnapshot(
      settingsRef,
      async (snapshot) => {
        try {
          if (snapshot.exists()) {
            const data = snapshot.data() as SiteSettings;
            setSeoSettings(data.seo || DEFAULT_SEO);
            setHomepageSettings(data.homepage || DEFAULT_HOMEPAGE);
            setEmailSettings(data.emails || DEFAULT_EMAILS);
          } else {
            // Crear documento con valores por defecto si no existe
            await setDoc(settingsRef, {
              seo: DEFAULT_SEO,
              homepage: DEFAULT_HOMEPAGE,
              emails: DEFAULT_EMAILS,
              createdAt: serverTimestamp(),
              updatedAt: serverTimestamp(),
            });
          }
        } catch (error) {
          console.error('Error processing site settings:', error);
          toast.error('Error al cargar la configuración');
        } finally {
          setLoading(false);
        }
      },
      (error) => {
        console.error('Error listening to site settings:', error);
        toast.error('Error al cargar la configuración');
        setLoading(false);
      }
    );

    // Cleanup: desuscribirse cuando el componente se desmonte
    return () => unsubscribe();
  }, []);

  const updateSEOSettings = async (newSeoSettings: Partial<SEOSettings>) => {
    if (!db) {
      toast.error('Firebase no está configurado');
      return false;
    }

    setSaving(true);
    try {
      const settingsRef = doc(db, 'settings', 'site');
      const updatedSeo = { ...seoSettings, ...newSeoSettings };
      
      await setDoc(
        settingsRef,
        {
          seo: updatedSeo,
          homepage: homepageSettings,
          emails: emailSettings,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );

      setSeoSettings(updatedSeo);
      toast.success('Configuración SEO actualizada correctamente');
      return true;
    } catch (error) {
      console.error('Error updating SEO settings:', error);
      toast.error('Error al actualizar la configuración SEO');
      return false;
    } finally {
      setSaving(false);
    }
  };

  const updateHomepageSettings = async (newHomepageSettings: Partial<HomepageSettings>) => {
    if (!db) {
      toast.error('Firebase no está configurado');
      return false;
    }

    setSaving(true);
    try {
      const settingsRef = doc(db, 'settings', 'site');
      const updatedHomepage = { ...homepageSettings, ...newHomepageSettings };
      
      await setDoc(
        settingsRef,
        {
          seo: seoSettings,
          homepage: updatedHomepage,
          emails: emailSettings,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );

      setHomepageSettings(updatedHomepage);
      toast.success('Configuración de página de inicio actualizada correctamente');
      return true;
    } catch (error) {
      console.error('Error updating homepage settings:', error);
      toast.error('Error al actualizar la configuración de página de inicio');
      return false;
    } finally {
      setSaving(false);
    }
  };

  const updateEmailSettings = async (newEmailSettings: Partial<EmailSettings>) => {
    if (!db) {
      toast.error('Firebase no está configurado');
      return false;
    }

    setSaving(true);
    try {
      const settingsRef = doc(db, 'settings', 'site');
      const updatedEmails = { ...emailSettings, ...newEmailSettings };
      
      await setDoc(
        settingsRef,
        {
          seo: seoSettings,
          homepage: homepageSettings,
          emails: updatedEmails,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );

      setEmailSettings(updatedEmails);
      toast.success('Configuración de emails actualizada correctamente');
      return true;
    } catch (error) {
      console.error('Error updating email settings:', error);
      toast.error('Error al actualizar la configuración de emails');
      return false;
    } finally {
      setSaving(false);
    }
  };

  return {
    seoSettings,
    homepageSettings,
    emailSettings,
    loading,
    saving,
    updateSEOSettings,
    updateHomepageSettings,
    updateEmailSettings,
  };
};

