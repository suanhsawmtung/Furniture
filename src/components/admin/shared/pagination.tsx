import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { Link, useLocation } from "react-router";

interface AdminPaginationProps {
  currentPage: number;
  totalPages: number;
  basePath: string; // e.g., "/admin/categories", "/admin/products"
  className?: string;
}

// Generate page numbers to display with ellipsis
const getPageNumbers = (
  currentPage: number,
  totalPages: number,
): (number | "ellipsis")[] => {
  const pages: (number | "ellipsis")[] = [];
  const maxVisible = 5; // Show max 5 page numbers

  if (totalPages <= maxVisible) {
    // Show all pages if total is small
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
  } else {
    // Always show first page
    pages.push(1);

    if (currentPage <= 3) {
      // Near the start
      for (let i = 2; i <= 4; i++) {
        pages.push(i);
      }
      pages.push("ellipsis");
      pages.push(totalPages);
    } else if (currentPage >= totalPages - 2) {
      // Near the end
      pages.push("ellipsis");
      for (let i = totalPages - 3; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // In the middle
      pages.push("ellipsis");
      for (let i = currentPage - 1; i <= currentPage + 1; i++) {
        pages.push(i);
      }
      pages.push("ellipsis");
      pages.push(totalPages);
    }
  }

  return pages;
};

// Build URL with page parameter while preserving all existing search params
const buildPageUrl = (
  pageNum: number,
  basePath: string,
  existingSearchParams: URLSearchParams,
): string => {
  const url = new URL(basePath, window.location.origin);

  // Copy all existing search params (except page)
  existingSearchParams.forEach((value, key) => {
    if (key !== "page") {
      url.searchParams.set(key, value);
    }
  });

  // Add page parameter (only if > 1)
  if (pageNum > 1) {
    url.searchParams.set("page", pageNum.toString());
  }

  return url.pathname + url.search;
};

export function AdminPagination({
  currentPage,
  totalPages,
  basePath,
  className,
}: AdminPaginationProps) {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  // Don't render if only one page or less
  if (totalPages <= 1) {
    return null;
  }

  const pageNumbers = getPageNumbers(currentPage, totalPages);
  const prevPage = currentPage > 1 ? currentPage - 1 : null;
  const nextPage = currentPage < totalPages ? currentPage + 1 : null;

  return (
    <Pagination className={className}>
      <PaginationContent>
        <PaginationItem>
          {prevPage ? (
            <Button
              asChild
              variant="ghost"
              size="default"
              className="text-text-gray hover:text-muted-foreground gap-1 px-2.5 sm:pl-2.5"
            >
              <Link to={buildPageUrl(prevPage, basePath, searchParams)}>
                <ChevronLeftIcon />
                <span className="hidden sm:block">Previous</span>
              </Link>
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="default"
              disabled
              className="pointer-events-none gap-1 px-2.5 opacity-50 sm:pl-2.5"
            >
              <ChevronLeftIcon />
              <span className="hidden sm:block">Previous</span>
            </Button>
          )}
        </PaginationItem>
        {pageNumbers.map((pageNum, index) => {
          if (pageNum === "ellipsis") {
            return (
              <PaginationItem key={`ellipsis-${index}`}>
                <PaginationEllipsis className="text-text-gray" />
              </PaginationItem>
            );
          }
          const isActive = pageNum === currentPage;
          return (
            <PaginationItem key={pageNum}>
              <Button
                asChild
                variant={isActive ? "outline" : "ghost"}
                size="icon"
                className={cn(
                  isActive
                    ? "bg-primary hover:bg-secondary text-white"
                    : "text-text-gray hover:bg-secondary",
                )}
              >
                <Link to={buildPageUrl(pageNum, basePath, searchParams)}>
                  {pageNum}
                </Link>
              </Button>
            </PaginationItem>
          );
        })}
        <PaginationItem>
          {nextPage ? (
            <Button
              asChild
              variant="ghost"
              size="default"
              className="text-text-gray hover:text-muted-foreground gap-1 px-2.5 sm:pr-2.5"
            >
              <Link to={buildPageUrl(nextPage, basePath, searchParams)}>
                <span className="hidden sm:block">Next</span>
                <ChevronRightIcon />
              </Link>
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="default"
              disabled
              className="pointer-events-none gap-1 px-2.5 opacity-50 sm:pr-2.5"
            >
              <span className="hidden sm:block">Next</span>
              <ChevronRightIcon />
            </Button>
          )}
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
