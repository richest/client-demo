import { NextRequest, NextResponse } from "next/server";

import { getNormalizedProductsFromSource } from "@/lib/normalizeProducts";
import {
  buildSearchIndex,
  filterAndSortProducts,
  getFacetOptions,
  getPriceCap,
  getPopularCategories,
  getSearchSuggestions
} from "@/lib/search";
import type { SearchFilters, ProductSort } from "@/types/product";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const allProducts = await getNormalizedProductsFromSource();

    // Check if suggestions request
    const isSuggestions = searchParams.get("suggestions") === "true";
    if (isSuggestions) {
      const q = searchParams.get("q") || "";
      const recent = searchParams.get("recent") || "";
      const recentSearches = recent ? recent.split(",").filter(Boolean) : [];

      const popularCategories = getPopularCategories(allProducts);
      const searchIndex = buildSearchIndex(allProducts);

      const suggestions = getSearchSuggestions({
        query: q,
        recentSearches,
        searchIndex,
        popularCategories
      });

      return NextResponse.json(suggestions, { status: 200 });
    }

    const page = Math.max(1, Number(searchParams.get("page")) || 1);
    const limit = Math.max(1, Number(searchParams.get("limit")) || 9);
    const query = searchParams.get("query") || "";

    const categoriesParam = searchParams.get("categories");
    const categories = categoriesParam ? categoriesParam.split(",").filter(Boolean) : [];

    const brandsParam = searchParams.get("brands");
    const brands = brandsParam ? brandsParam.split(",").filter(Boolean) : [];

    const inStockOnly = searchParams.get("inStockOnly") === "true";
    const sort = (searchParams.get("sort") || "relevance") as ProductSort;

    const priceCap = getPriceCap(allProducts);
    const maxPriceParam = searchParams.get("maxPrice");
    const maxPrice = maxPriceParam !== null && maxPriceParam !== undefined && maxPriceParam !== ""
      ? Number(maxPriceParam)
      : priceCap;

    const filters: SearchFilters = {
      query,
      categories,
      brands,
      maxPrice,
      inStockOnly,
      sort,
      priceCap
    };

    const searchIndex = buildSearchIndex(allProducts);
    const filteredProducts = filterAndSortProducts(allProducts, searchIndex, filters);

    const total = filteredProducts.length;
    const startIndex = (page - 1) * limit;
    const paginatedProducts = filteredProducts.slice(startIndex, startIndex + limit);

    // Compute facets from all products (as in the original useSearch.ts logic)
    const facetCategories = getFacetOptions(allProducts, "category");
    const facetBrands = getFacetOptions(allProducts, "brand");

    return NextResponse.json(
      {
        products: paginatedProducts,
        total,
        categories: facetCategories,
        brands: facetBrands,
        priceCap
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "s-maxage=60, stale-while-revalidate=600"
        }
      }
    );
  } catch (error) {
    console.error("Error in products API route:", error);
    return NextResponse.json(
      {
        products: [],
        total: 0,
        error: "Unable to load products at the moment."
      },
      {
        status: 500
      }
    );
  }
}
