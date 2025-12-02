import React from "react";

// Hook personalizado para obtener el año actual
const useCurrentYear = () => {
  const [currentYear, setCurrentYear] = React.useState(
    new Date().getFullYear()
  );

  React.useEffect(() => {
    const updateYear = () => {
      setCurrentYear(new Date().getFullYear());
    };

    // Actualizar el año al inicio del año
    const now = new Date();
    const nextYear = new Date(now.getFullYear() + 1, 0, 1);
    const timeUntilNextYear = nextYear.getTime() - now.getTime();

    const timer = setTimeout(updateYear, timeUntilNextYear);

    return () => clearTimeout(timer);
  }, []);

  return currentYear;
};

export { useCurrentYear };
export default useCurrentYear;
