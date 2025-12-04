import { Car } from "@/types";
import { Textarea } from "@/components/ui/textarea";

interface DescriptionAndFeaturedProps {
  formData: Partial<Car>;
  setFormData: (data: Partial<Car>) => void;
  featuredCount: number;
  originalFeatured: boolean;
}

export const DescriptionAndFeatured = ({
  formData,
  setFormData,
  featuredCount,
  originalFeatured,
}: DescriptionAndFeaturedProps) => {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-sm font-semibold mb-3 text-white">Sección Hero</h3>
        <div className="space-y-4">
          <div className="space-y-1">
            <label className="block text-xs font-medium text-gray-200 mb-1">
              Título Hero
            </label>
            <Textarea
              value={formData.heroTitle || ''}
              onChange={(e) => setFormData({ ...formData, heroTitle: e.target.value })}
              rows={2}
              placeholder="Ej: Porsche 911 GT3 RS"
              className="text-sm bg-[#0a0a0a] border-[#2a2a2a] text-white placeholder:text-gray-400 resize-none"
            />
            <p className="text-xs text-gray-400 mt-1">
              Título que se mostrará en el hero. Si está vacío, se usará "{formData.make || 'Marca'} {formData.model || 'Modelo'}"
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-1">
        <h3 className="text-sm font-semibold mb-3 text-white">Descripción General</h3>
        <Textarea
          value={formData.description || ''}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={4}
          placeholder="Descripción detallada del vehículo..."
          className="text-sm bg-[#0a0a0a] border-[#2a2a2a] text-white placeholder:text-gray-400 h-40 md:h-[120px] resize-none"
        />
        <p className="text-xs text-gray-400 mt-1">
          Descripción que se mostrará en el hero debajo del título.
        </p>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-semibold mb-3 text-white">Sección Parallax</h3>
        <div className="space-y-4">
          <div className="space-y-1">
            <label className="block text-xs font-medium text-gray-200 mb-1">
              Título Parallax
            </label>
            <Textarea
              value={formData.parallaxTitle || ''}
              onChange={(e) => setFormData({ ...formData, parallaxTitle: e.target.value })}
              rows={2}
              placeholder="Ej: El 2024 Porsche 911 GT3 RS ofrece rendimiento y precisión"
              className="text-sm bg-[#0a0a0a] border-[#2a2a2a] text-white placeholder:text-gray-400 resize-none"
            />
            <p className="text-xs text-gray-400 mt-1">
              Título que se mostrará en la sección parallax. Si está vacío, se usará un título por defecto.
            </p>
          </div>
          <div className="space-y-1">
            <label className="block text-xs font-medium text-gray-200 mb-1">
              Subtítulo Parallax
            </label>
            <Textarea
              value={formData.parallaxSubtitle || ''}
              onChange={(e) => setFormData({ ...formData, parallaxSubtitle: e.target.value })}
              rows={3}
              placeholder="Ej: Un verdadero icono que combina la usabilidad diaria con la velocidad de un supercar, construido para aquellos que no esperan nada menos que la perfección."
              className="text-sm bg-[#0a0a0a] border-[#2a2a2a] text-white placeholder:text-gray-400 resize-none"
            />
            <p className="text-xs text-gray-400 mt-1">
              Subtítulo que se mostrará debajo del título en la sección parallax. Si está vacío, se usará un subtítulo por defecto.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

