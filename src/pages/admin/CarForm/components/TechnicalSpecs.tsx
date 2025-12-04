import { Car } from "@/types";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TechnicalSpecsProps {
  formData: Partial<Car>;
  setFormData: (data: Partial<Car>) => void;
}

export const TechnicalSpecs = ({ formData, setFormData }: TechnicalSpecsProps) => {
  return (
    <div>
      <h3 className="text-sm font-semibold mb-3 text-white">Especificaciones Técnicas</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <div className="space-y-1">
          <label className="block text-xs font-medium text-gray-200 mb-1">V. Máx.</label>
          <Input
            type="number"
            value={formData.topSpeed || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                topSpeed: e.target.value ? parseInt(e.target.value) : undefined,
              })
            }
            placeholder="320"
            className="h-9 text-sm bg-[#0a0a0a] border-[#2a2a2a] text-white placeholder:text-gray-400"
          />
        </div>
        <div className="space-y-1">
          <label className="block text-xs font-medium text-gray-200 mb-1">Potencia</label>
          <Input
            type="number"
            value={formData.power || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                power: e.target.value ? parseInt(e.target.value) : undefined,
              })
            }
            placeholder="650"
            className="h-9 text-sm bg-[#0a0a0a] border-[#2a2a2a] text-white placeholder:text-gray-400"
          />
        </div>
        <div className="space-y-1">
          <label className="block text-xs font-medium text-gray-200 mb-1">0-100</label>
          <Input
            type="number"
            step="0.1"
            value={formData.acceleration || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                acceleration: e.target.value ? parseFloat(e.target.value) : undefined,
              })
            }
            placeholder="3.2"
            className="h-9 text-sm bg-[#0a0a0a] border-[#2a2a2a] text-white placeholder:text-gray-400"
          />
        </div>
        <div className="space-y-1">
          <label className="block text-xs font-medium text-gray-200 mb-1">Asientos</label>
          <Input
            type="number"
            value={formData.seats || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                seats: e.target.value ? parseInt(e.target.value) : undefined,
              })
            }
            placeholder="2"
            className="h-9 text-sm bg-[#0a0a0a] border-[#2a2a2a] text-white placeholder:text-gray-400"
          />
        </div>
        <div className="space-y-1">
          <label className="block text-xs font-medium text-gray-200 mb-1">Tracción</label>
          <Select
            value={formData.drivetrain || ""}
            onValueChange={(value) => setFormData({ ...formData, drivetrain: value })}
          >
            <SelectTrigger className="h-9 text-sm bg-[#0a0a0a] border-[#2a2a2a] text-white w-full">
              <SelectValue placeholder="Sel." />
            </SelectTrigger>
            <SelectContent className="bg-[#1a1a1a] border-[#2a2a2a]">
              <SelectItem value="RWD" className="text-white hover:bg-[#2a2a2a]">
                RWD
              </SelectItem>
              <SelectItem value="FWD" className="text-white hover:bg-[#2a2a2a]">
                FWD
              </SelectItem>
              <SelectItem value="AWD" className="text-white hover:bg-[#2a2a2a]">
                AWD
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <label className="block text-xs font-medium text-gray-200 mb-1">Motor</label>
          <Input
            value={formData.engine || ""}
            onChange={(e) => setFormData({ ...formData, engine: e.target.value })}
            placeholder="V8"
            className="h-9 text-sm bg-[#0a0a0a] border-[#2a2a2a] text-white placeholder:text-gray-400"
          />
        </div>
        <div className="space-y-1 col-span-2 md:col-span-2 lg:col-span-2">
          <label className="block text-xs font-medium text-gray-200 mb-1">Color Exterior</label>
          <Input
            value={formData.exterior || ""}
            onChange={(e) => setFormData({ ...formData, exterior: e.target.value })}
            placeholder="Arctic Grey"
            className="h-9 text-sm bg-[#0a0a0a] border-[#2a2a2a] text-white placeholder:text-gray-400"
          />
        </div>
        <div className="space-y-1 col-span-2 md:col-span-2 lg:col-span-2">
          <label className="block text-xs font-medium text-gray-200 mb-1">Color Interior</label>
          <Input
            value={formData.interior || ""}
            onChange={(e) => setFormData({ ...formData, interior: e.target.value })}
            placeholder="Black Alcantara"
            className="h-9 text-sm bg-[#0a0a0a] border-[#2a2a2a] text-white placeholder:text-gray-400"
          />
        </div>
      </div>
    </div>
  );
};

