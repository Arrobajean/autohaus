import RollingTextButton from "@/components/common/RollingTextButton";
import TrustedBrandsSection from "./sections/TrustedBrandsSection";
import FeaturedVehiclesSection from "./sections/FeaturedVehiclesSection";
import WhyChooseSection from "./sections/WhyChooseSection";
import ReviewsSection from "./sections/ReviewsSection";
import StatsSection from "./sections/StatsSection";
import FAQSection from "./sections/FAQSection";
import { motion, useScroll, useTransform } from "framer-motion";
import { useState, useEffect } from "react";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { Helmet, HelmetProvider } from "react-helmet-async";

const Index = () => {
  const [isMobile, setIsMobile] = useState(false);
  const { scrollYProgress } = useScroll();
  const {
    homepageSettings,
    seoSettings,
    loading: settingsLoading,
  } = useSiteSettings();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Renderizar Helmet inmediatamente, incluso si los settings están cargando
  // Esto evita que se muestre el título hardcodeado del HTML
  return (
    <HelmetProvider>
      <Helmet>
        <title>{seoSettings?.siteTitle || "AutoHaus"}</title>
        <meta name="description" content={seoSettings?.siteDescription || ""} />
        <meta name="keywords" content={seoSettings?.keywords || ""} />
        <meta
          property="og:title"
          content={seoSettings?.siteTitle || "AutoHaus"}
        />
        <meta
          property="og:description"
          content={seoSettings?.siteDescription || ""}
        />
        <meta property="og:image" content={seoSettings?.ogImageUrl || ""} />
        <meta
          property="og:site_name"
          content={seoSettings?.ogSiteName || "AutoHaus"}
        />
        <meta
          property="twitter:card"
          content={seoSettings?.twitterCard || "summary_large_image"}
        />
        <link rel="canonical" href={seoSettings?.canonicalUrl || "/"} />
        {seoSettings?.faviconUrl && (
          <link rel="icon" href={seoSettings.faviconUrl} />
        )}
      </Helmet>
      <div
        className="min-h-screen bg-white"
        style={{ backgroundColor: "#F5F4F2" }}
      >
        {/* Hero Section */}
        <section className="relative h-[100vh] md:h-[130vh] flex items-start justify-center bg-slate-900 text-white overflow-hidden pt-[20vh] md:pt-[18vh]">
          {/* Background Image Layer with Parallax + subtle zoom-out on page enter */}
          <motion.div
            className="absolute inset-0 w-full h-[120vh] md:h-[160vh]"
            initial={{ scale: 1.06 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.8, ease: "easeOut" }}
            style={{
              // Parallax más suave en móvil, más dramático en desktop
              y: useTransform(
                scrollYProgress,
                [0, 0.5],
                [isMobile ? -20 : -80, isMobile ? -100 : -260]
              ),
            }}
          >
            <img
              src={homepageSettings.heroImageUrl}
              alt="Luxury Car"
              className="w-full h-full object-cover object-center"
              loading="eager"
            />
            {/* Dark Overlay - reduced opacity */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-black/8 to-black/15"></div>
          </motion.div>

          {/* Bottom fade to white - appears only on scroll */}
          <motion.div
            className="absolute bottom-0 left-0 right-0 h-[40%] md:h-[35%] pointer-events-none z-[3]"
            style={{
              background: `linear-gradient(to top, #F5F4F2, rgba(245, 244, 242, 0.95), transparent)`,
              opacity: useTransform(
                scrollYProgress,
                isMobile
                  ? [0, 0.03, 0.1, 0.2, 0.35]
                  : [0, 0.05, 0.12, 0.2, 0.3],
                [0, 0.5, 0.85, 0.95, 1]
              ),
            }}
          />

          {/* Fade overlay that appears on scroll - intensifies as next component enters */}
          <motion.div
            className="absolute inset-0 z-[5]"
            style={{
              backgroundColor: "#F5F4F2",
              opacity: useTransform(
                scrollYProgress,
                isMobile ? [0, 0.1, 0.25, 0.4, 0.6] : [0, 0.15, 0.3, 0.45, 0.6],
                [0, 0, 0.3, 0.7, 1]
              ),
            }}
          />

          {/* Content Layer with scroll animation */}
          <motion.div
            className="relative z-10 text-center space-y-4 md:space-y-8 max-w-4xl px-4 md:px-6"
            style={{
              y: useTransform(
                scrollYProgress,
                [0, 0.3],
                [0, isMobile ? -80 : -150]
              ),
              opacity: useTransform(
                scrollYProgress,
                isMobile ? [0, 0.15, 0.25] : [0, 0.2, 0.3],
                [1, 0.5, 0]
              ),
            }}
          >
            <motion.h1
              className="text-[2.5rem] leading-tight sm:text-5xl md:text-[5rem] tracking-tight md:leading-tight drop-shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.0, delay: 0.1 }}
            >
              {homepageSettings.heroTitle}
            </motion.h1>
            <motion.h2
              className="text-[1.125rem] md:text-2xl text-gray-200 font-light drop-shadow-md px-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.0, delay: 0.25 }}
            >
              {homepageSettings.heroSubtitle}
            </motion.h2>
            <motion.div
              className="flex justify-center pt-2 md:pt-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.0, delay: 0.4 }}
            >
              <RollingTextButton
                primaryText="Explorar Coches"
                secondaryText="¡Encuentra tu Coche!"
                to="/coches"
                ariaLabel="Explorar catálogo de coches"
                backgroundColor="bg-white"
                textColor="text-black"
                className="text-sm sm:text-base md:text-lg px-5 py-3 sm:px-6 sm:py-3 md:px-8 md:py-4"
              />
            </motion.div>
          </motion.div>
        </section>

        {/* Trusted Brands Section */}
        {homepageSettings.sectionsEnabled.trustedBrands && (
          <TrustedBrandsSection />
        )}

        {/* Featured Vehicles Section */}
        {homepageSettings.sectionsEnabled.featuredVehicles && (
          <FeaturedVehiclesSection
            featuredCarsCount={homepageSettings.featuredCarsCount}
          />
        )}

        {/* Why Choose Section */}
        {homepageSettings.sectionsEnabled.whyChoose && <WhyChooseSection />}

        {/* Stats Section */}
        {homepageSettings.sectionsEnabled.stats && <StatsSection />}

        {/* Reviews Section */}
        {homepageSettings.sectionsEnabled.reviews && <ReviewsSection />}

        {/* FAQ Section */}
        {homepageSettings.sectionsEnabled.faq && <FAQSection />}

        {/* CTA Section */}
        <section
          className="py-12 md:py-20 px-4 md:px-8"
          style={{ backgroundColor: "#F5F4F2" }}
        >
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10 md:mb-16">
              <h2
                className="text-center text-[2.5rem] md:text-[52px]"
                style={{
                  lineHeight: "1.2em",
                  letterSpacing: "-0.04em",
                  fontWeight: 500,
                  fontFamily: '"Inter Display", sans-serif',
                  marginBottom: "15px",
                  color: "var(--black-custom)",
                }}
              >
                ¿Listo para encontrar tu coche ideal?
              </h2>
              <div
                className="text-[1.125rem] md:text-xl text-gray-700 md:text-gray-600 text-center font-normal leading-relaxed"
                style={{ textWrap: "pretty" }}
              >
                <span className="md:hidden">
                  Visita nuestro showroom hoy o explora
                  <br />
                  nuestro inventario online para
                  <br />
                  encontrar el vehículo perfecto para tu estilo de vida.
                </span>
                <span className="hidden md:inline">
                  <div>
                    Visita nuestro showroom hoy o explora nuestro inventario
                    online para encontrar
                  </div>
                  <div>el vehículo perfecto para tu estilo de vida.</div>
                </span>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              <RollingTextButton
                primaryText="Ver Coches"
                secondaryText="Explorar Ahora"
                to="/coches"
                ariaLabel="Ver catálogo de coches"
                backgroundColor="bg-black"
                textColor="text-white"
                className="text-lg px-8 py-4"
              />
              <RollingTextButton
                primaryText="Programar Prueba"
                secondaryText="Reservar Ahora"
                to="/contacto"
                ariaLabel="Programar prueba de manejo"
                backgroundColor="bg-black"
                textColor="text-white"
                className="text-lg px-8 py-4"
              />
            </div>
          </div>
        </section>
      </div>
    </HelmetProvider>
  );
};

export default Index;
