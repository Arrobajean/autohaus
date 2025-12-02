import { memo } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

const brands = [
  { name: "Porsche", logo: "Porsche" },
  { name: "Interlock", logo: "Interlock" },
  { name: "Acme Corp", logo: "Acme Corp" },
  { name: "Boltshift", logo: "Boltshift" },
  { name: "Epicurious", logo: "Epicurious" },
  { name: "Nietzsche", logo: "Nietzsche" },
];

const BrandsCarouselSection = memo(() => {
  return (
    <section className="py-20 bg-white" style={{ backgroundColor: "#F5F4F2" }}>
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
            Ofrecemos vehículos de las marcas más icónicas del mundo
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            Nuestro éxito está impulsado por personas que comparten una pasión
            por los coches, la precisión y un servicio excepcional.
          </p>
        </div>

        {/* Brands Carousel */}
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {brands.map((brand, index) => (
              <CarouselItem
                key={index}
                className="pl-2 md:pl-4 basis-1/2 md:basis-1/3 lg:basis-1/6"
              >
                <div className="flex items-center justify-center h-24 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
                  <span className="text-2xl font-bold text-gray-400">
                    {brand.logo}
                  </span>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </section>
  );
});

BrandsCarouselSection.displayName = "BrandsCarouselSection";

export default BrandsCarouselSection;
