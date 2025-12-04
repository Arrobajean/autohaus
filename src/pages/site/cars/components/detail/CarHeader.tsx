import { Car } from "@/types";
import RollingTextButton from "@/components/common/RollingTextButton";
import { calculateMonthlyPayment } from "../../utils/carUtils";

interface CarHeaderProps {
  car: Car;
}

export const CarHeader = ({ car }: CarHeaderProps) => {
  const monthlyPayment = calculateMonthlyPayment(car.price);

  return (
    <div className="text-center mb-12 md:mb-16">
      {/* Category Badge */}
      <div className="inline-block mb-6">
        <span className="px-4 py-1.5 rounded-full bg-gray-100 text-gray-700 text-sm font-medium">
          {car.category === "luxury" ? "Lujo" : car.category || "Lujo"}
        </span>
      </div>

      {/* Title */}
      <h1 className="text-5xl md:text-[5rem] mb-6 text-black text-center">
        {car.make} {car.model}
      </h1>

      {/* Description */}
      <p
        className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed text-center text-wrap-safe"
        style={{ textWrap: "pretty" }}
      >
        {car.description ||
          "A track-focused masterpiece combining race-bred aerodynamics, precision engineering, and everyday usability."}
      </p>

      {/* Price */}
      <div className="mb-8 flex justify-center">
        <p className="text-center">
          <span className="text-xl md:text-2xl font-normal text-black">
            {car.price.toLocaleString("es-ES")} €
          </span>
          {car.showFinancedPrice && (
            <>
              {" "}
              <span className="font-normal text-gray-600 text-base md:text-lg">
                (desde {monthlyPayment.toLocaleString("es-ES")} €/mes)
              </span>
            </>
          )}
        </p>
      </div>

      {/* CTA Button */}
      <div className="flex justify-center">
        <RollingTextButton
          primaryText="Contactar Ventas"
          secondaryText="Contactar Ventas"
          to="/contacto"
          ariaLabel="Contactar ventas"
          backgroundColor="bg-gray-900"
          textColor="text-white"
          className="text-lg px-8 py-4"
        />
      </div>
    </div>
  );
};
