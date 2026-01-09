import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { useLocation, useNavigate } from "react-router";

interface FilterTagsProps {
  allowedFilters?: Record<string, string[] | true>;
  align?: "start" | "end";
  excludeKeys?: string[];
  className?: string;
}

// Helper function to format filter key (kebab-case to readable text)
const formatFilterLabel = (key: string): string => {
  return key
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export function FilterTags({
  allowedFilters,
  excludeKeys = ["page"],
  className,
}: FilterTagsProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);

  // Get all filters from URL, excluding specified keys (like "page")
  const allFilters = Array.from(searchParams.entries())
    .filter(([key]) => !excludeKeys.includes(key))
    .map(([key, value]) => ({
      key,
      value,
    }));

  // Filter to only show allowed keys and validate values if provided
  // If allowedFilters is provided, only show filters that match the config
  // If allowedFilters is not provided, show all filters (except excluded keys)
  const activeFilters = allowedFilters
    ? allFilters.filter((filter) => {
        const allowedConfig = allowedFilters[filter.key];

        // If key is not in allowedFilters, don't show it
        if (!allowedConfig) return false;

        // If true, any value is allowed for this key
        if (allowedConfig === true) return true;

        // If array, only allow if value is in the allowed array
        if (Array.isArray(allowedConfig)) {
          return allowedConfig.includes(filter.value);
        }

        return false;
      })
    : allFilters;

  const removeFilter = (key: string) => {
    const newSearchParams = new URLSearchParams(location.search);
    newSearchParams.delete(key);

    // Reset page to 1 when removing a filter
    if (newSearchParams.has("page")) {
      newSearchParams.delete("page");
    }

    const newSearch = newSearchParams.toString();
    navigate(`${location.pathname}${newSearch ? `?${newSearch}` : ""}`, {
      replace: true,
    });
  };

  if (activeFilters.length === 0) {
    return null;
  }

  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-start gap-3 md:justify-end",
        className,
      )}
    >
      {activeFilters.map((filter) => (
        <div
          key={filter.key}
          className="bg-secondary flex h-8 items-center gap-1 rounded-full border border-[#E9E9E9] px-3 py-2"
        >
          <span className="space-x-1 text-xs font-normal">
            <span className="text-muted-foreground">
              {formatFilterLabel(filter.key)}
            </span>
            <span className="text-muted-foreground">:</span>
            <span className="text-foreground font-medium">{filter.value}</span>
          </span>
          <button
            type="button"
            onClick={() => removeFilter(filter.key)}
            className="text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
            aria-label={`Remove ${filter.key} filter`}
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      ))}
    </div>
  );
}
