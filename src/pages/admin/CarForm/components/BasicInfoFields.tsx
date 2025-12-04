import { Car } from "@/types";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Combobox } from "@/components/ui/combobox";
import { CAR_BRANDS } from "@/data/carBrands";
import { Checkbox } from "@/components/animate-ui/components/radix/checkbox";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface BasicInfoFieldsProps {
  formData: Partial<Car>;
  setFormData: (data: Partial<Car>) => void;
  featuredCount?: number;
  originalFeatured?: boolean;
}

export const BasicInfoFields = ({
  formData,
  setFormData,
  featuredCount = 0,
  originalFeatured = false,
}: BasicInfoFieldsProps) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-semibold mb-3 text-white">
          Información Básica
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-8 gap-3">
          <div className="space-y-1">
            <label className="block text-xs font-medium text-gray-200 mb-1">Marca</label>
            <div className="w-full">
              <Combobox
                options={CAR_BRANDS}
                value={formData.make}
                onValueChange={(value) =>
                  setFormData({ ...formData, make: value })
                }
                placeholder="Seleccionar marca..."
                searchPlaceholder="Buscar marca..."
                emptyText="No se encontró la marca."
              />
            </div>
          </div>
          <div className="space-y-1">
            <label className="block text-xs font-medium text-gray-200 mb-1">Modelo</label>
            <Input
              value={formData.model}
              onChange={(e) =>
                setFormData({ ...formData, model: e.target.value })
              }
              required
              className="h-9 text-sm bg-[#0a0a0a] border-[#2a2a2a] text-white placeholder:text-gray-400"
            />
          </div>
          <div className="space-y-1">
            <label className="block text-xs font-medium text-gray-200 mb-1">Año</label>
            <Input
              type="number"
              value={formData.year}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  year: parseInt(e.target.value),
                })
              }
              required
              className="h-9 text-sm bg-[#0a0a0a] border-[#2a2a2a] text-white placeholder:text-gray-400"
            />
          </div>
          <div className="space-y-1">
            <label className="block text-xs font-medium text-gray-200 mb-1">
              Precio (€)
            </label>
            <Input
              type="number"
              value={formData.price}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  price: parseFloat(e.target.value),
                })
              }
              required
              className="h-9 text-sm bg-[#0a0a0a] border-[#2a2a2a] text-white placeholder:text-gray-400"
            />
          </div>
          <div className="space-y-1">
            <label className="block text-xs font-medium text-gray-200 mb-1">Km</label>
            <Input
              type="number"
              value={formData.mileage}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  mileage: parseInt(e.target.value),
                })
              }
              required
              className="h-9 text-sm bg-[#0a0a0a] border-[#2a2a2a] text-white placeholder:text-gray-400"
            />
          </div>
          <div className="space-y-1">
            <label className="block text-xs font-medium text-gray-200 mb-1">
              Combustible
            </label>
            <Select
              value={formData.fuelType}
              onValueChange={(value) =>
                setFormData({ ...formData, fuelType: value })
              }
            >
              <SelectTrigger className="h-9 text-sm bg-[#0a0a0a] border-[#2a2a2a] text-white w-full">
                <SelectValue placeholder="Seleccionar" />
              </SelectTrigger>
              <SelectContent className="bg-[#1a1a1a] border-[#2a2a2a]">
                <SelectItem
                  value="Gasoline"
                  className="text-white hover:bg-[#2a2a2a]"
                >
                  Gasolina
                </SelectItem>
                <SelectItem
                  value="Diesel"
                  className="text-white hover:bg-[#2a2a2a]"
                >
                  Diésel
                </SelectItem>
                <SelectItem
                  value="Electric"
                  className="text-white hover:bg-[#2a2a2a]"
                >
                  Eléctrico
                </SelectItem>
                <SelectItem
                  value="Hybrid"
                  className="text-white hover:bg-[#2a2a2a]"
                >
                  Híbrido
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <label className="block text-xs font-medium text-gray-200 mb-1">
              Transmisión
            </label>
            <Input
              value={formData.transmission}
              onChange={(e) =>
                setFormData({ ...formData, transmission: e.target.value })
              }
              placeholder="7-Speed PDK"
              required
              className="h-9 text-sm bg-[#0a0a0a] border-[#2a2a2a] text-white placeholder:text-gray-400"
            />
          </div>
          <div className="space-y-1">
            <label className="block text-xs font-medium text-gray-200 mb-1">Categoría</label>
            <Select
              value={formData.category || "luxury"}
              onValueChange={(value: any) =>
                setFormData({ ...formData, category: value })
              }
            >
              <SelectTrigger className="h-9 text-sm bg-[#0a0a0a] border-[#2a2a2a] text-white w-full">
                <SelectValue placeholder="Seleccionar" />
              </SelectTrigger>
              <SelectContent className="bg-[#1a1a1a] border-[#2a2a2a]">
                <SelectItem
                  value="luxury"
                  className="text-white hover:bg-[#2a2a2a]"
                >
                  Lujo
                </SelectItem>
                <SelectItem
                  value="premium"
                  className="text-white hover:bg-[#2a2a2a]"
                >
                  Premium
                </SelectItem>
                <SelectItem value="suv" className="text-white hover:bg-[#2a2a2a]">
                  SUV
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Opciones: Estado y Checkboxes */}
      <div className="pt-2">
        <h3 className="text-sm font-semibold mb-3 text-white">Opciones</h3>
        <div className="flex flex-wrap items-end gap-6">
          <div className="space-y-1">
            <label className="block text-xs font-medium text-gray-200 mb-1">Estado</label>
            <Select
              value={formData.status}
              onValueChange={(value: any) =>
                setFormData({ ...formData, status: value })
              }
            >
              <SelectTrigger className="h-9 text-sm bg-[#0a0a0a] border-[#2a2a2a] text-white w-[130px]">
                <SelectValue placeholder="Seleccionar" />
              </SelectTrigger>
              <SelectContent className="bg-[#1a1a1a] border-[#2a2a2a]">
                <SelectItem
                  value="available"
                  className="text-white hover:bg-[#2a2a2a]"
                >
                  Disponible
                </SelectItem>
                <SelectItem
                  value="reserved"
                  className="text-white hover:bg-[#2a2a2a]"
                >
                  Reservado
                </SelectItem>
                <SelectItem
                  value="sold"
                  className="text-white hover:bg-[#2a2a2a]"
                >
                  Vendido
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center gap-2 h-9 border border-[#2a2a2a] rounded-md px-3 bg-[#0a0a0a]">
            <Checkbox
              id="featured"
              checked={formData.featured || false}
              onCheckedChange={(checked) => {
                if (checked && featuredCount >= 6 && !originalFeatured) {
                  toast.error(
                    "Ya hay 6 coches destacados. Desactiva uno primero para añadir este.",
                    { duration: 4000 }
                  );
                  return;
                }
                setFormData({ ...formData, featured: checked === true });
              }}
            />
            <div className="flex flex-col">
              <Label
                htmlFor="featured"
                className="text-xs font-medium cursor-pointer text-gray-200"
              >
                Destacado
              </Label>
              {!formData.featured && featuredCount >= 6 && (
                <span className="text-[9px] text-orange-400 leading-none">
                  Máx. 6
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 h-9 border border-[#2a2a2a] rounded-md px-3 bg-[#0a0a0a]">
            <Checkbox
              id="showFinancedPrice"
              checked={formData.showFinancedPrice || false}
              onCheckedChange={(checked) => {
                setFormData({
                  ...formData,
                  showFinancedPrice: checked === true,
                });
              }}
            />
            <Label
              htmlFor="showFinancedPrice"
              className="text-xs font-medium cursor-pointer text-gray-200"
            >
              Precio Financiado
            </Label>
          </div>
        </div>
      </div>
    </div>
  );
};
