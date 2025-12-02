import { Car } from "@/types";

interface CarSpecificationsProps {
  car: Car;
}

export const CarSpecifications = ({ car }: CarSpecificationsProps) => {
  return (
    <div className="mb-16 max-w-4xl mx-auto">
      <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
        Especificaciones Clave
      </h2>
      <p className="text-base text-gray-500 mb-8 text-wrap-safe">
        <span className="inline md:block">
          Una descripción detallada de las especificaciones técnicas clave
        </span>
        <span className="inline md:block">
          {" "}
          y los principales aspectos destacados de rendimiento del vehículo.
        </span>
      </p>

      <div className="space-y-0 border-t border-gray-200">
        {car.topSpeed && (
          <div className="flex justify-between items-center py-4 border-b border-gray-200">
            <span className="text-gray-700">Velocidad Máxima</span>
            <span className="text-gray-900 font-medium">
              {car.topSpeed} km/h
            </span>
          </div>
        )}
        {car.power && (
          <div className="flex justify-between items-center py-4 border-b border-gray-200">
            <span className="text-gray-700">Potencia</span>
            <span className="text-gray-900 font-medium">{car.power} hp</span>
          </div>
        )}
        {car.acceleration && (
          <div className="flex justify-between items-center py-4 border-b border-gray-200">
            <span className="text-gray-700">0-100 km/h</span>
            <span className="text-gray-900 font-medium">
              {car.acceleration} s
            </span>
          </div>
        )}
        <div className="flex justify-between items-center py-4 border-b border-gray-200">
          <span className="text-gray-700">Año</span>
          <span className="text-gray-900 font-medium">{car.year}</span>
        </div>
        {car.exterior && (
          <div className="flex justify-between items-center py-4 border-b border-gray-200">
            <span className="text-gray-700">Exterior</span>
            <span className="text-gray-900 font-medium">{car.exterior}</span>
          </div>
        )}
        {car.interior && (
          <div className="flex justify-between items-center py-4 border-b border-gray-200">
            <span className="text-gray-700">Interior</span>
            <span className="text-gray-900 font-medium">{car.interior}</span>
          </div>
        )}
        <div className="flex justify-between items-center py-4 border-b border-gray-200">
          <span className="text-gray-700">Transmisión</span>
          <span className="text-gray-900 font-medium">{car.transmission}</span>
        </div>
        {car.drivetrain && (
          <div className="flex justify-between items-center py-4 border-b border-gray-200">
            <span className="text-gray-700">Tracción</span>
            <span className="text-gray-900 font-medium">{car.drivetrain}</span>
          </div>
        )}
        {car.engine && (
          <div className="flex justify-between items-center py-4 border-b border-gray-200">
            <span className="text-gray-700">Motor</span>
            <span className="text-gray-900 font-medium">{car.engine}</span>
          </div>
        )}
        {car.seats && (
          <div className="flex justify-between items-center py-4 border-b border-gray-200">
            <span className="text-gray-700">Asientos</span>
            <span className="text-gray-900 font-medium">{car.seats}</span>
          </div>
        )}
      </div>
    </div>
  );
};

