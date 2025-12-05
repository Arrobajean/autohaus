import { ChevronUp, ChevronDown, ChevronsUpDown } from "lucide-react";
import { SortField, SortDirection } from "../../helpers/carsListHelpers";

interface SortIconProps {
  field: Exclude<SortField, null>;
  currentSortField: SortField;
  sortDirection: SortDirection;
}

export const SortIcon = ({
  field,
  currentSortField,
  sortDirection,
}: SortIconProps) => {
  if (currentSortField !== field) {
    return <ChevronsUpDown className="w-3 h-3 opacity-40 text-gray-300" />;
  }

  if (sortDirection === "asc") {
    return <ChevronUp className="w-3 h-3 text-white" />;
  }

  return <ChevronDown className="w-3 h-3 text-white" />;
};

