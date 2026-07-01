import type { IconName } from "@/components/Icons";
import type { ProductSort } from "@/types/product";

export const CATEGORY_ICONS: Record<string, IconName> = {
  Storage: "box",
  Outdoor: "leaf",
  Bath: "bath",
  Kitchen: "utensils",
  Textiles: "textiles",
  "Wall Art": "frame",
  Decor: "sparkles",
  Office: "briefcase",
  Furniture: "chair",
  Lighting: "lamp"
};

export const SORT_OPTIONS: Array<{ label: string; value: ProductSort }> = [
  { label: "Relevance", value: "relevance" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "Top Rated", value: "rating-desc" },
  { label: "Newest Arrivals", value: "newest" }
];
