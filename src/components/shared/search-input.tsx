import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { SearchIcon, X } from "lucide-react";
import type { ComponentProps } from "react";
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router";

interface SearchInputProps
  extends Omit<ComponentProps<typeof Input>, "value" | "onChange"> {
  paramKey?: string; // The search param key (e.g., "search", "query", "filter")
  debounceMs?: number; // Debounce delay in milliseconds (default: 300)
  placeholder?: string;
}

export function SearchInput({
  paramKey = "search",
  debounceMs = 300,
  placeholder = "Search...",
  className,
  ...props
}: SearchInputProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const initialValue = searchParams.get(paramKey) || "";

  const [value, setValue] = useState(initialValue);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Sync with URL when location changes (e.g., browser back/forward)
  useEffect(() => {
    const currentValue = searchParams.get(paramKey) || "";
    setValue(currentValue);
  }, [location.search, paramKey]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const updateUrl = (newValue: string) => {
    const newSearchParams = new URLSearchParams(location.search);

    if (newValue.trim()) {
      newSearchParams.set(paramKey, newValue.trim());
    } else {
      newSearchParams.delete(paramKey);
    }

    // Reset page to 1 when searching (if page param exists)
    if (newSearchParams.has("page")) {
      newSearchParams.delete("page");
    }

    navigate(`${location.pathname}?${newSearchParams.toString()}`, {
      replace: true,
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue(newValue);

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout for debounce
    timeoutRef.current = setTimeout(() => {
      updateUrl(newValue);
    }, debounceMs);
  };

  const handleClear = () => {
    setValue("");
    updateUrl("");
  };

  // Check if search param exists in URL
  const hasSearchParam =
    searchParams.has(paramKey) && searchParams.get(paramKey)?.trim() !== "";

  return (
    <div className="relative w-full sm:w-auto">
      <Input
        type="search"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className={cn(
          className,
          "pl-10",
          hasSearchParam && "pr-10",
          // Hide native clear button
          "[&::-webkit-search-cancel-button]:hidden",
          "[&::-webkit-search-decoration]:hidden",
        )}
        {...props}
      />
      <div className="absolute top-0 left-0 flex h-12 w-10 items-center justify-center">
        <SearchIcon className="text-muted-foreground size-4" />
      </div>
      {hasSearchParam && (
        <div
          className="absolute top-0 right-0 flex h-12 w-10 cursor-pointer items-center justify-center"
          onClick={handleClear}
        >
          <X className="text-primary size-4" />
        </div>
      )}
    </div>
  );
}
