export interface TeamMember {
  id: string;
  name: string;
  position: string;
  initials: string;
  gradientFrom: string;
  gradientTo: string;
  primaryText: string;
  secondaryText: string;
  ariaLabel: string;
  bio?: string;
  experience?: string;
  specialties?: string[];
  image?: string;
}

export interface ContactInfo {
  address: string;
  phone: string;
  email: string;
  schedule: string;
  scheduleDays: string;
  scheduleHours: string;
}

export const teamMembers: TeamMember[] = [
  {
    id: "javier",
    name: "Javier Martínez",
    position: "Director de Ventas",
    initials: "JM",
    gradientFrom: "from-gray-300",
    gradientTo: "to-gray-400",
    primaryText: "Contactar a Javier",
    secondaryText: "Ponerse en contacto",
    ariaLabel: "Contactar a Javier Martínez",
    bio: "Con más de 15 años de experiencia en el sector automotriz de lujo, Javier ha liderado equipos de ventas en algunas de las marcas más prestigiosas de Europa.",
    experience: "15+ años de experiencia",
    image: "/images/team/Felix_Hartmann.avif",
  },
  {
    id: "diego",
    name: "Diego Rodríguez",
    position: "Asesor Comercial",
    initials: "DR",
    gradientFrom: "from-blue-300",
    gradientTo: "to-blue-400",
    primaryText: "Contactar a Diego",
    secondaryText: "Ponerse en contacto",
    ariaLabel: "Contactar a Diego Rodríguez",
    bio: "Especialista en atención al cliente y experiencia de compra, Diego se destaca por su capacidad para entender las necesidades únicas de cada cliente.",
    experience: "8+ años de experiencia",
    image: "/images/team/Michael_Bauer.avif",
  },
  {
    id: "andres",
    name: "Andrés Sánchez",
    position: "Especialista en Financiación",
    initials: "AS",
    gradientFrom: "from-green-300",
    gradientTo: "to-green-400",
    primaryText: "Contactar a Andrés",
    secondaryText: "Ponerse en contacto",
    ariaLabel: "Contactar a Andrés Sánchez",
    bio: "Experto en soluciones financieras y leasing, Andrés ayuda a nuestros clientes a encontrar la mejor opción de financiación adaptada a su situación.",
    experience: "12+ años de experiencia",
    image: "/images/team/Thomas_keller.avif",
  },
];

export const contactInfo: ContactInfo = {
  address: "Calle de Serrano 87, Madrid, España",
  phone: "+34 915 678 923",
  email: "info@autohaus.com",
  schedule: "Lun-Sáb, 9:00 AM – 7:00 PM",
  scheduleDays: "Lunes a sábados",
  scheduleHours: "9:00 AM – 7:00 PM",
};

