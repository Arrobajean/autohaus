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
    <div>
      <h3 className="text-sm font-semibold mb-1.5 text-white">Descripción</h3>
      <Textarea
        value={formData.description}
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        rows={2}
        placeholder="Descripción detallada del vehículo..."
        className="text-sm bg-[#0a0a0a] border-[#2a2a2a] text-white placeholder:text-gray-400 min-h-[60px]"
      />
    </div>
  );
};

