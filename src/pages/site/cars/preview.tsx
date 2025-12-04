import { Helmet, HelmetProvider } from "react-helmet-async";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Car } from "@/types";
import { CarHeader } from "./components/detail/CarHeader";
import { CarImageGallery } from "./components/detail/CarImageGallery";
import { ParallaxSection } from "./components/detail/ParallaxSection";
import { CarSpecifications } from "./components/detail/CarSpecifications";
import { CarDetailCTA } from "./components/detail/CarDetailCTA";
import { useParallaxAnimations } from "./hooks/useParallaxAnimations";

const CarDetailPreview = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as { car?: Car; returnTo?: string } | null;
  const car = state?.car || null;
  const returnTo = state?.returnTo || "/admin/cars";

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const { parallaxAnimations } = useParallaxAnimations(car);

  if (!car) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: "#F5F4F2" }}>
        <div className="max-w-md text-center space-y-4">
          <h1 className="text-2xl font-semibold text-gray-900">
            Vista previa no disponible
          </h1>
          <p className="text-gray-600 text-sm">
            Esta es una URL de vista previa. Para verla correctamente, abre la ficha de un coche desde el panel de administración y usa el botón
            <span className="font-semibold"> “Vista previa ficha”</span>.
          </p>
          <button
            onClick={() => navigate("/")}
            className="mt-4 inline-flex items-center justify-center px-4 py-2 rounded-md bg-black text-white text-sm font-medium"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  const pageTitle = `${car.make} ${car.model} ${car.year} [PREVIEW] - AutoHaus | Concesionario de Lujo`;

  return (
    <HelmetProvider>
      <Helmet>
        <title>{pageTitle}</title>
        <meta
          name="description"
          content={
            car.description ||
            `${car.make} ${car.model} ${car.year} disponible en AutoHaus`
          }
        />
      </Helmet>
      <div className="min-h-screen bg-white pt-24 md:pt-32" style={{ backgroundColor: "#F5F4F2" }}>
        {/* Banner de PREVIEW estilo barra de admin */}
        <div className="fixed top-0 left-0 right-0 z-[60] bg-slate-900/95 text-white shadow-md border-b border-slate-800">
          <div className="max-w-7xl mx-auto px-4 md:px-6 py-2 flex flex-col sm:flex-row items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-xs md:text-sm">
              <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-full bg-yellow-400 text-black text-[10px] font-semibold uppercase tracking-wide">
                Modo Preview
              </span>
              <span className="text-xs md:text-sm text-slate-100">
                Esta ficha es solo una vista previa. Los cambios no guardados no se verán en la web pública.
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate(returnTo)}
                className="text-xs md:text-sm font-medium px-3 py-1 rounded-md bg-white text-slate-900 hover:bg-slate-100 transition-colors"
              >
                Volver
              </button>
              <button
                onClick={() => navigate(returnTo, { state: { autoSave: true } })}
                className="text-xs md:text-sm font-medium px-3 py-1 rounded-md bg-emerald-400 text-slate-900 hover:bg-emerald-300 transition-colors"
              >
                Guardar cambios
              </button>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <CarHeader car={car} />

          <div className="mb-32">
            <CarImageGallery
              car={car}
              selectedImageIndex={selectedImageIndex}
              onImageSelect={setSelectedImageIndex}
            />
          </div>

          <div className="hidden md:block">
            <ParallaxSection car={car} animations={parallaxAnimations} />
          </div>

          <CarSpecifications car={car} />

          <CarDetailCTA />
        </div>
      </div>
    </HelmetProvider>
  );
};

export default CarDetailPreview;


