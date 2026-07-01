"use client";

import { useDeferredValue, useEffect, useMemo, useRef, useState } from "react";

import { useDebounce } from "@/hooks/useDebounce";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { getActiveFilters } from "@/lib/search";
import type {
  ActiveFilter,
  FacetOption,
  Product,
  ProductSort,
  SearchFilters,
  SearchSuggestion
} from "@/types/product";

const PRODUCTS_PER_PAGE = 9;

export function useSearch() {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 300);
  const debouncedSuggestionsQuery = useDebounce(query, 120);

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState(0);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sort, setSort] = useState<ProductSort>("relevance");
  const [currentPage, setCurrentPage] = useState(1);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const [wishlistIds, setWishlistIds] = useLocalStorage<number[]>("hearth_wishlist", []);
  const [recentSearches, setRecentSearches] = useLocalStorage<string[]>("hearth_recent", []);

  // Debounced filters to prevent API spamming
  const debouncedCategories = useDebounce(selectedCategories, 250);
  const debouncedBrands = useDebounce(selectedBrands, 250);
  const debouncedMaxPrice = useDebounce(maxPrice, 250);
  const debouncedInStockOnly = useDebounce(inStockOnly, 250);
  const debouncedSort = useDebounce(sort, 250);

  // API data state
  const [products, setProducts] = useState<Product[]>([]);
  const [totalResults, setTotalResults] = useState(0);
  const [categories, setCategories] = useState<FacetOption[]>([]);
  const [brands, setBrands] = useState<FacetOption[]>([]);
  const [priceCap, setPriceCap] = useState(0);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [isSearching, setIsSearching] = useState(false);

  // Suggestions state
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [recentSuggestionItems, setRecentSuggestionItems] = useState<SearchSuggestion[]>([]);

  const isFirstRender = useRef(true);
  const isInitializingFromUrl = useRef(false);

  // Check if we need to initialize from URL on first render (client-side only)
  if (typeof window !== "undefined" && isFirstRender.current) {
    const params = new URLSearchParams(window.location.search);
    if (params.toString()) {
      isInitializingFromUrl.current = true;
    }
  }

  // Load initial state from URL query parameters on mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    let hasParams = false;

    const urlQuery = params.get("q");
    if (urlQuery !== null) {
      setQuery(urlQuery);
      hasParams = true;
    }

    const urlCategories = params.get("categories");
    if (urlCategories) {
      setSelectedCategories(urlCategories.split(",").filter(Boolean));
      hasParams = true;
    }

    const urlBrands = params.get("brands");
    if (urlBrands) {
      setSelectedBrands(urlBrands.split(",").filter(Boolean));
      hasParams = true;
    }

    const urlMaxPrice = params.get("maxPrice");
    if (urlMaxPrice !== null) {
      setMaxPrice(Number(urlMaxPrice));
      hasParams = true;
    }

    const urlStock = params.get("inStockOnly");
    if (urlStock !== null) {
      setInStockOnly(urlStock === "true");
      hasParams = true;
    }

    const urlSort = params.get("sort");
    if (urlSort !== null) {
      setSort(urlSort as ProductSort);
      hasParams = true;
    }

    const urlPage = params.get("page");
    if (urlPage !== null) {
      setCurrentPage(Number(urlPage));
      hasParams = true;
    }

    if (hasParams) {
      // Clear the initializing flag after state updates are processed
      setTimeout(() => {
        isInitializingFromUrl.current = false;
      }, 0);
    }
  }, []);

  // Synchronize state back to URL query parameters
  useEffect(() => {
    if (typeof window === "undefined") return;

    const params = new URLSearchParams();
    if (debouncedQuery) params.set("q", debouncedQuery);
    if (selectedCategories.length) params.set("categories", selectedCategories.join(","));
    if (selectedBrands.length) params.set("brands", selectedBrands.join(","));

    // Only set maxPrice if a filter is actually applied (i.e. it's less than the priceCap)
    if (maxPrice > 0 && priceCap > 0 && maxPrice < priceCap) {
      params.set("maxPrice", String(maxPrice));
    }
    if (inStockOnly) params.set("inStockOnly", "true");
    if (sort !== "relevance") params.set("sort", sort);
    if (currentPage > 1) params.set("page", String(currentPage));

    const newSearch = params.toString();
    const newUrl = newSearch ? `?${newSearch}` : window.location.pathname;

    if (window.location.search !== newUrl) {
      window.history.replaceState({ ...window.history.state, as: newUrl, url: newUrl }, "", newUrl);
    }
  }, [debouncedQuery, selectedCategories, selectedBrands, maxPrice, inStockOnly, sort, currentPage, priceCap]);

  // Handle Back/Forward buttons (popstate)
  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      setQuery(params.get("q") || "");
      setSelectedCategories(params.get("categories")?.split(",").filter(Boolean) || []);
      setSelectedBrands(params.get("brands")?.split(",").filter(Boolean) || []);
      
      const p = params.get("maxPrice");
      if (p !== null) {
        setMaxPrice(Number(p));
      } else if (priceCap > 0) {
        setMaxPrice(priceCap);
      }
      
      setInStockOnly(params.get("inStockOnly") === "true");
      setSort((params.get("sort") as ProductSort) || "relevance");
      setCurrentPage(Number(params.get("page")) || 1);
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [priceCap]);

  // Scroll to top on filter / page change
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [debouncedQuery, debouncedCategories, debouncedBrands, debouncedMaxPrice, debouncedInStockOnly, debouncedSort, currentPage]);

  // Set loading state as user is typing/filtering
  useEffect(() => {
    setIsSearching(true);
  }, [query, selectedCategories, selectedBrands, maxPrice, inStockOnly, sort, currentPage]);

  // Handle body scroll locking on mobile filters open
  useEffect(() => {
    document.body.style.overflow = mobileFiltersOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileFiltersOpen]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedQuery, selectedCategories, selectedBrands, maxPrice, inStockOnly, sort]);

  // Initialize maxPrice to priceCap on first load
  useEffect(() => {
    if (priceCap > 0 && maxPrice === 0) {
      setMaxPrice(priceCap);
    }
  }, [priceCap, maxPrice]);

  // Fetch paginated and filtered products from API
  useEffect(() => {
    if (isInitializingFromUrl.current) {
      return;
    }
    const controller = new AbortController();
    let active = true;
    async function loadProducts() {
      try {
        setIsLoadingProducts(true);
        const params = new URLSearchParams({
          page: String(currentPage),
          limit: String(PRODUCTS_PER_PAGE),
          query: debouncedQuery,
          categories: debouncedCategories.join(","),
          brands: debouncedBrands.join(","),
          inStockOnly: String(debouncedInStockOnly),
          sort: debouncedSort
        });
        if (debouncedMaxPrice > 0) {
          params.append("maxPrice", String(debouncedMaxPrice));
        }

        const response = await fetch(`/api/products?${params.toString()}`, {
          signal: controller.signal
        });
        if (!response.ok) {
          throw new Error("Failed to load products");
        }
        const data = await response.json();
        if (active) {
          setProducts(data.products || []);
          setTotalResults(data.total || 0);
          setCategories(data.categories || []);
          setBrands(data.brands || []);
          setPriceCap(data.priceCap || 0);
        }
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") {
          return;
        }
        console.error("Error loading products:", error);
      } finally {
        if (active) {
          setIsLoadingProducts(false);
          setIsSearching(false);
        }
      }
    }
    loadProducts();
    return () => {
      active = false;
      controller.abort();
    };
  }, [currentPage, debouncedQuery, debouncedCategories, debouncedBrands, debouncedMaxPrice, debouncedInStockOnly, debouncedSort]);

  // Fetch suggestions from API as user types
  useEffect(() => {
    const controller = new AbortController();
    let active = true;
    async function loadSuggestions() {
      try {
        const params = new URLSearchParams({
          suggestions: "true",
          q: debouncedSuggestionsQuery,
          recent: recentSearches.join(",")
        });
        const response = await fetch(`/api/products?${params.toString()}`, {
          signal: controller.signal
        });
        if (!response.ok) {
          throw new Error("Failed to load suggestions");
        }
        const data = await response.json();
        if (active) {
          setSuggestions(data.suggestions || []);
          setRecentSuggestionItems(data.recent || []);
        }
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") {
          return;
        }
        console.error("Error loading suggestions:", error);
      }
    }

    loadSuggestions();

    return () => {
      active = false;
      controller.abort();
    };
  }, [debouncedSuggestionsQuery, recentSearches]);

  // Compute active filters
  const filters: SearchFilters = useMemo(
    () => ({
      query: debouncedQuery,
      categories: selectedCategories,
      brands: selectedBrands,
      maxPrice,
      inStockOnly,
      sort,
      priceCap
    }),
    [debouncedQuery, inStockOnly, maxPrice, priceCap, selectedBrands, selectedCategories, sort]
  );

  const activeFilters = useMemo(() => getActiveFilters(filters), [filters]);
  const wishlist = useMemo(() => new Set(wishlistIds), [wishlistIds]);

  // popularCategories: get top 6 category labels
  const popularCategories = useMemo(() => {
    return [...categories]
      .sort((left, right) => right.count - left.count || left.label.localeCompare(right.label))
      .slice(0, 6)
      .map((option) => option.label);
  }, [categories]);

  const totalPages = Math.max(1, Math.ceil(totalResults / PRODUCTS_PER_PAGE));

  const commitSearch = (value: string) => {
    const nextValue = value.trim();
    setQuery(value);

    if (!nextValue) {
      return;
    }

    setRecentSearches((current) =>
      [nextValue, ...current.filter((entry) => entry.toLowerCase() !== nextValue.toLowerCase())].slice(0, 5)
    );
  };

  const clearSearch = () => {
    setQuery("");
  };

  const toggleWishlist = (id: number) => {
    setWishlistIds((current) =>
      current.includes(id) ? current.filter((value) => value !== id) : [...current, id]
    );
  };

  const resetAll = () => {
    setQuery("");
    setSelectedCategories([]);
    setSelectedBrands([]);
    setMaxPrice(priceCap);
    setInStockOnly(false);
    setSort("relevance");
    setCurrentPage(1);
  };

  const removeActiveFilter = (filter: ActiveFilter) => {
    if (filter.type === "category") {
      setSelectedCategories((current) => current.filter((value) => value !== filter.label));
    }

    if (filter.type === "brand") {
      setSelectedBrands((current) => current.filter((value) => value !== filter.label));
    }

    if (filter.type === "price") {
      setMaxPrice(priceCap);
    }

    if (filter.type === "stock") {
      setInStockOnly(false);
    }
  };

  const removeRecentSearch = (value: string) => {
    setRecentSearches((current) => current.filter((entry) => entry !== value));
  };

  return {
    query,
    setQuery,
    commitSearch,
    clearSearch,
    categories,
    brands,
    popularCategories: categories.filter((category) => popularCategories.includes(category.label)),
    selectedCategories,
    selectedBrands,
    maxPrice,
    priceCap,
    inStockOnly,
    sort,
    setSort,
    results: { length: totalResults },
    paginatedResults: products,
    currentPage,
    totalPages,
    productsPerPage: PRODUCTS_PER_PAGE,
    isSearching: isSearching || isLoadingProducts,
    suggestions,
    recentSuggestionItems,
    wishlist,
    wishlistCount: wishlist.size,
    activeFilters,
    mobileFiltersOpen,
    setMobileFiltersOpen,
    setCurrentPage,
    toggleCategory: (category: string) => {
      setSelectedCategories((current) =>
        current.includes(category) ? current.filter((value) => value !== category) : [...current, category]
      );
    },
    quickToggleCategory: (category: string) => {
      setSelectedCategories((current) => (current.includes(category) ? [] : [category]));
    },
    clearCategories: () => setSelectedCategories([]),
    toggleBrand: (brand: string) => {
      setSelectedBrands((current) =>
        current.includes(brand) ? current.filter((value) => value !== brand) : [...current, brand]
      );
    },
    clearBrands: () => setSelectedBrands([]),
    setMaxPrice,
    setInStockOnly,
    toggleWishlist,
    resetAll,
    removeActiveFilter,
    removeRecentSearch
  };
}
