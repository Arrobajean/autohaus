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
  heroTitle?: string;
  parallaxTitle?: string;
  parallaxSubtitle?: string;
  category?: string;
  status: "available" | "sold" | "reserved";
  featured?: boolean; // Si el coche aparece en la sección de destacados del landing
  showFinancedPrice?: boolean; // Si se muestra el precio financiado en la vista detallada
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

export interface SEOSettings {
  siteTitle: string;
  siteDescription: string;
  keywords: string;
  ogImageUrl: string;
  ogSiteName: string;
  twitterCard: string;
  canonicalUrl: string;
}

export interface HomepageSectionsEnabled {
  trustedBrands: boolean;
  featuredVehicles: boolean;
  whyChoose: boolean;
  stats: boolean;
  reviews: boolean;
  faq: boolean;
}

export interface HomepageSettings {
  heroTitle: string;
  heroSubtitle: string;
  heroImageUrl: string;
  featuredCarsCount: number;
  sectionsEnabled: HomepageSectionsEnabled;
}

export interface SiteSettings {
  seo: SEOSettings;
  homepage: HomepageSettings;
}