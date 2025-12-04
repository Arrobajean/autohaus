import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { SEOSettings, HomepageSettings, SiteSettings } from '@/types';
import { toast } from 'sonner';

const DEFAULT_SEO: SEOSettings = {
  siteTitle: 'AutoHaus - Concesionario de Vehículos',
  siteDescription: 'AutoHaus: Concesionario especializado en vehículos. Amplia selección de coches nuevos y de ocasión. Más de 15 años de experiencia.',
  keywords: 'concesionario, coches, vehículos, autos, madrid, ocasión, nuevos',
  ogImageUrl: 'https://autohaus.es/images/logo/autohaus.png',
  ogSiteName: 'AutoHaus',
  twitterCard: 'summary_large_image',
  canonicalUrl: 'https://autohaus.es/',
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

export const useSiteSettings = () => {
  const [seoSettings, setSeoSettings] = useState<SEOSettings>(DEFAULT_SEO);
  const [homepageSettings, setHomepageSettings] = useState<HomepageSettings>(DEFAULT_HOMEPAGE);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      if (!db) {
        setLoading(false);
        return;
      }

      try {
        const settingsRef = doc(db, 'settings', 'site');
        const settingsDoc = await getDoc(settingsRef);

        if (settingsDoc.exists()) {
          const data = settingsDoc.data() as SiteSettings;
          setSeoSettings(data.seo || DEFAULT_SEO);
          setHomepageSettings(data.homepage || DEFAULT_HOMEPAGE);
        } else {
          // Crear documento con valores por defecto si no existe
          await setDoc(settingsRef, {
            seo: DEFAULT_SEO,
            homepage: DEFAULT_HOMEPAGE,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          });
        }
      } catch (error) {
        console.error('Error fetching site settings:', error);
        toast.error('Error al cargar la configuración');
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
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

  return {
    seoSettings,
    homepageSettings,
    loading,
    saving,
    updateSEOSettings,
    updateHomepageSettings,
  };
};

