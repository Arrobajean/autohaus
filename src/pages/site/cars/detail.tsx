import { Helmet, HelmetProvider } from "react-helmet-async";
import { useCarDetail } from "./hooks/useCarDetail";
import { CarHeader } from "./components/detail/CarHeader";
import { CarImageGallery } from "./components/detail/CarImageGallery";
import { ParallaxSection } from "./components/detail/ParallaxSection";
import { CarSpecifications } from "./components/detail/CarSpecifications";
import { SimilarCarsSection } from "./components/detail/SimilarCarsSection";
import { CarDetailCTA } from "./components/detail/CarDetailCTA";
import { LoadingState } from "./components/detail/LoadingState";
import { NotFoundState } from "./components/detail/NotFoundState";
import { useParallaxAnimations } from "./hooks/useParallaxAnimations";

/**
 * Genera el título de la página de manera dinámica
 */
const generatePageTitle = (car: any) => {
  return `${car.make} ${car.model} ${car.year} - AutoHaus | Concesionario de Lujo`;
};

const CarDetail = () => {
  const { car, loading, selectedImageIndex, setSelectedImageIndex } =
    useCarDetail();
  const { parallaxAnimations, similarCars } = useParallaxAnimations(car);

  if (loading) {
    return <LoadingState />;
  }

  if (!car) {
    return <NotFoundState />;
  }

  const pageTitle = generatePageTitle(car);

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
      <div className="min-h-screen bg-white pt-24 md:pt-32" style={{ backgroundColor: '#F5F4F2' }}>
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

          <SimilarCarsSection similarCars={similarCars} />

          <CarDetailCTA />
        </div>
      </div>
    </HelmetProvider>
  );
};

export default CarDetail;

