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
    <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3 pt-6 border-t border-[#2a2a2a]">
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={onPreview}
        className="w-full sm:w-auto bg-[#1a1a1a] border-[#3a3a3a] text-blue-400 hover:bg-blue-500/10 hover:border-blue-500/50 hover:text-blue-300 h-10 sm:h-9 px-4"
      >
        Vista Previa
      </Button>
      <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => navigate("/admin/cars")}
          className="w-full sm:w-auto bg-[#1a1a1a] border-[#3a3a3a] text-gray-300 hover:bg-gray-700 hover:border-gray-600 hover:text-white h-10 sm:h-9 px-4"
        >
          Cancelar
        </Button>
        <Button 
          type="submit" 
          size="sm" 
          disabled={loading || uploading} 
          className="w-full sm:w-auto min-w-[100px] bg-green-600 hover:bg-green-700 text-white border-0 disabled:opacity-50 disabled:cursor-not-allowed h-10 sm:h-9 px-4"
        >
          {loading || uploading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              {uploading ? "Subiendo..." : "Guardando..."}
            </>
          ) : (
            "Guardar"
          )}
        </Button>
      </div>
    </div>
  );
};

