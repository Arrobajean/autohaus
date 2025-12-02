export interface Car {
  id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  fuelType: string;
  transmission: string;
  images: string[];
  description: string;
  category?: string;
  status: "available" | "sold" | "reserved";
  createdAt: Date;
  updatedAt: Date;
  // Especificaciones técnicas
  topSpeed?: number; // km/h
  power?: number; // hp
  acceleration?: number; // 0-100 km/h en segundos
  exterior?: string;
  interior?: string;
  drivetrain?: string;
  engine?: string;
  seats?: number;
}

export interface UserProfile {
  uid: string;
  email: string;
  role: "admin" | "editor";
  displayName: string;
  createdAt: Date;
}
