import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface FormActionsProps {
  loading: boolean;
  uploading: boolean;
  onPreview: () => void;
}

export const FormActions = ({ loading, uploading, onPreview }: FormActionsProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between pt-4 border-t border-[#2a2a2a]">
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={onPreview}
        className="border-[#2a2a2a] text-gray-200 hover:bg-[#2a2a2a]"
      >
        Vista Previa
      </Button>
      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => navigate("/admin/cars")}
          className="border-[#2a2a2a] text-gray-200 hover:bg-[#2a2a2a]"
        >
          Cancelar
        </Button>
        <Button type="submit" size="sm" disabled={loading || uploading} className="min-w-[120px] bg-[#2a2a2a] text-white hover:bg-[#3a3a3a]">
          {loading || uploading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              {uploading ? "Subiendo..." : "Guardando..."}
            </>
          ) : (
            "Guardar Vehículo"
          )}
        </Button>
      </div>
    </div>
  );
};

