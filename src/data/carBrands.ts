/**
 * Lista de marcas de vehículos disponibles en el concesionario
 */

export const CAR_BRANDS = [
  { value: "Aston Martin", label: "Aston Martin" },
  { value: "Audi", label: "Audi" },
  { value: "Bentley", label: "Bentley" },
  { value: "BMW", label: "BMW" },
  { value: "Bugatti", label: "Bugatti" },
  { value: "Ferrari", label: "Ferrari" },
  { value: "Jaguar", label: "Jaguar" },
  { value: "Lamborghini", label: "Lamborghini" },
  { value: "McLaren", label: "McLaren" },
  { value: "Mercedes-Benz", label: "Mercedes-Benz" },
  { value: "Porsche", label: "Porsche" },
  { value: "Rolls-Royce", label: "Rolls-Royce" },
  { value: "Maserati", label: "Maserati" },
  { value: "Alfa Romeo", label: "Alfa Romeo" },
  { value: "Lexus", label: "Lexus" },
  { value: "Tesla", label: "Tesla" },
  { value: "Lotus", label: "Lotus" },
  { value: "Pagani", label: "Pagani" },
  { value: "Koenigsegg", label: "Koenigsegg" },
  { value: "Rimac", label: "Rimac" },
].sort((a, b) => a.label.localeCompare(b.label));
