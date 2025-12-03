import { Car } from "@/types";

export const getDefaultCarFormData = (): Partial<Car> => ({
  make: "",
  model: "",
  year: new Date().getFullYear(),
  price: 0,
  mileage: 0,
  fuelType: "Gasoline",
  transmission: "Automatic",
  description: "",
  status: "available",
  category: "luxury",
  featured: false,
  images: [],
  // Especificaciones técnicas
  topSpeed: undefined,
  power: undefined,
  acceleration: undefined,
  exterior: "",
  interior: "",
  drivetrain: "",
  engine: "",
  seats: undefined,
});

export const createPreviewCar = (
  formData: Partial<Car>,
  imageUrls: string[],
  imagePreviews: string[],
  id?: string
): Car => {
  return {
    id: id || "preview",
    make: formData.make || "",
    model: formData.model || "",
    year: formData.year || new Date().getFullYear(),
    price: formData.price || 0,
    mileage: formData.mileage || 0,
    fuelType: formData.fuelType || "Gasoline",
    transmission: formData.transmission || "Automática",
    images: imagePreviews.length > 0 ? imagePreviews : imageUrls,
    description: formData.description || "",
    category: formData.category,
    status: formData.status || "available",
    createdAt: new Date(),
    updatedAt: new Date(),
    topSpeed: formData.topSpeed,
    power: formData.power,
    acceleration: formData.acceleration,
    exterior: formData.exterior,
    interior: formData.interior,
    drivetrain: formData.drivetrain,
    engine: formData.engine,
    seats: formData.seats,
  };
};

export const validateCarForm = (formData: Partial<Car>): { valid: boolean; error?: string } => {
  if (!formData.make || !formData.model) {
    return { valid: false, error: "Completa al menos la marca y el modelo para previsualizar." };
  }
  return { valid: true };
};

