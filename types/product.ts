export type ProductSort =
  | "relevance"
  | "price-asc"
  | "price-desc"
  | "rating-desc"
  | "newest";

export type SearchSuggestionType =
  | "product"
  | "brand"
  | "category"
  | "recent"
  | "empty";

export interface RawProduct {
  id?: number | string | null;
  title?: string | null;
  brand?: string | null;
  category?: string | null;
  tags?: unknown;
  price?: number | string | null;
  rating?: number | null;
  reviews?: number | null;
  inStock?: boolean | null;
  releasedAt?: string | null;
  image?: string | null;
  imageWidth?: number | null;
  imageHeight?: number | null;
  description?: string | null;
}

export interface Product {
  id: number;
  title: string;
  brand: string;
  category: string;
  tags: string[];
  price: number | null;
  rating: number | null;
  reviews: number;
  inStock: boolean;
  releasedAt: string | null;
  releasedTimestamp: number;
  image: string | null;
  imageWidth: number | null;
  imageHeight: number | null;
  description: string;
  searchText: string;
}

export interface SearchIndexEntry {
  id: number;
  title: string;
  brand: string;
  category: string;
  tags: string[];
  titleNormalized: string;
  brandNormalized: string;
  categoryNormalized: string;
  tagsNormalized: string[];
  haystack: string;
}

export interface SearchSuggestion {
  id: string;
  label: string;
  value: string;
  meta?: string;
  type: SearchSuggestionType;
}

export interface SearchFilters {
  query: string;
  categories: string[];
  brands: string[];
  maxPrice: number;
  inStockOnly: boolean;
  sort: ProductSort;
  priceCap: number;
}

export interface FacetOption {
  label: string;
  count: number;
}

export interface ActiveFilter {
  id: string;
  label: string;
  type: "category" | "brand" | "price" | "stock";
}
