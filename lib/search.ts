import type {
  ActiveFilter,
  FacetOption,
  Product,
  SearchFilters,
  SearchIndexEntry,
  SearchSuggestion
} from "@/types/product";

function normalizeText(value: string) {
  return value.toLowerCase().trim().replace(/\s+/g, " ");
}

function splitTerms(value: string) {
  return normalizeText(value)
    .split(" ")
    .map((term) => term.trim())
    .filter(Boolean);
}

export function buildSearchIndex(products: Product[]): SearchIndexEntry[] {
  return products.map((product) => ({
    id: product.id,
    title: product.title,
    brand: product.brand,
    category: product.category,
    tags: product.tags,
    titleNormalized: normalizeText(product.title),
    brandNormalized: normalizeText(product.brand),
    categoryNormalized: normalizeText(product.category),
    tagsNormalized: product.tags.map(normalizeText),
    haystack: [product.title, product.brand, product.category, product.tags.join(" ")]
      .join(" ")
      .toLowerCase()
  }));
}

function getRelevanceScore(entry: SearchIndexEntry, terms: string[]) {
  if (!terms.length) {
    return 0;
  }

  return terms.reduce((score, term) => {
    let next = score;

    if (entry.titleNormalized.startsWith(term)) next += 10;
    if (entry.titleNormalized.includes(term)) next += 6;
    if (entry.brandNormalized.includes(term)) next += 4;
    if (entry.categoryNormalized.includes(term)) next += 3;
    if (entry.tagsNormalized.some((tag) => tag.includes(term))) next += 2;
    if (entry.haystack.includes(term)) next += 1;

    return next;
  }, 0);
}

export function filterAndSortProducts(
  products: Product[],
  searchIndex: SearchIndexEntry[],
  filters: SearchFilters
) {
  const terms = splitTerms(filters.query);
  const indexMap = new Map(searchIndex.map((entry) => [entry.id, entry]));

  const filtered = products.filter((product) => {
    const entry = indexMap.get(product.id);
    if (!entry) {
      return false;
    }

    if (terms.length && !terms.every((term) => entry.haystack.includes(term))) {
      return false;
    }

    if (filters.categories.length && !filters.categories.includes(product.category)) {
      return false;
    }

    if (filters.brands.length && !filters.brands.includes(product.brand)) {
      return false;
    }

    if (filters.inStockOnly && !product.inStock) {
      return false;
    }

    if (product.price === null) {
      return filters.maxPrice >= filters.priceCap;
    }

    return product.price <= filters.maxPrice;
  });

  return filtered.sort((left, right) => {
    if (filters.sort === "price-asc") {
      return (left.price ?? Number.MAX_SAFE_INTEGER) - (right.price ?? Number.MAX_SAFE_INTEGER);
    }

    if (filters.sort === "price-desc") {
      return (right.price ?? -1) - (left.price ?? -1);
    }

    if (filters.sort === "rating-desc") {
      return (right.rating ?? -1) - (left.rating ?? -1);
    }

    if (filters.sort === "newest") {
      return right.releasedTimestamp - left.releasedTimestamp;
    }

    if (!terms.length) {
      return left.id - right.id;
    }

    const leftScore = getRelevanceScore(indexMap.get(left.id)!, terms);
    const rightScore = getRelevanceScore(indexMap.get(right.id)!, terms);

    if (rightScore !== leftScore) {
      return rightScore - leftScore;
    }

    if ((right.rating ?? 0) !== (left.rating ?? 0)) {
      return (right.rating ?? 0) - (left.rating ?? 0);
    }

    return left.id - right.id;
  });
}

export function getFacetOptions(products: Product[], key: "category" | "brand"): FacetOption[] {
  const counts = new Map<string, number>();

  for (const product of products) {
    const label = product[key];
    counts.set(label, (counts.get(label) ?? 0) + 1);
  }

  return [...counts.entries()]
    .sort((left, right) => left[0].localeCompare(right[0]))
    .map(([label, count]) => ({ label, count }));
}

export function getPriceCap(products: Product[]) {
  const highestPrice = products.reduce((max, product) => {
    if (product.price === null) {
      return max;
    }

    return Math.max(max, product.price);
  }, 0);

  return Math.ceil(highestPrice / 10) * 10;
}

export function getPopularCategories(products: Product[]) {
  return getFacetOptions(products, "category")
    .sort((left, right) => right.count - left.count || left.label.localeCompare(right.label))
    .slice(0, 6)
    .map((option) => option.label);
}

export function getSearchSuggestions(params: {
  query: string;
  recentSearches: string[];
  searchIndex: SearchIndexEntry[];
  popularCategories: string[];
}) {
  const query = normalizeText(params.query);

  if (!query) {
    const recent = params.recentSearches.map<SearchSuggestion>((value) => ({
      id: `recent-${value.toLowerCase()}`,
      label: value,
      value,
      type: "recent"
    }));

    const categories = params.popularCategories.map<SearchSuggestion>((value) => ({
      id: `category-${value.toLowerCase()}`,
      label: value,
      value,
      type: "category"
    }));

    return {
      recent,
      suggestions: categories
    };
  }

  const productSuggestions: SearchSuggestion[] = [];
  const brandSuggestions = new Set<string>();
  const categorySuggestions = new Set<string>();

  for (const entry of params.searchIndex) {
    if (!entry.haystack.includes(query)) {
      continue;
    }

    if (productSuggestions.length < 4) {
      productSuggestions.push({
        id: `product-${entry.id}`,
        label: entry.title,
        value: entry.title,
        meta: entry.category,
        type: "product"
      });
    }

    if (entry.brandNormalized.includes(query)) {
      brandSuggestions.add(entry.brand);
    }

    if (entry.categoryNormalized.includes(query)) {
      categorySuggestions.add(entry.category);
    }

    if (productSuggestions.length >= 4 && brandSuggestions.size >= 2 && categorySuggestions.size >= 2) {
      break;
    }
  }

  const supplemental: SearchSuggestion[] = [
    ...[...brandSuggestions].slice(0, 2).map((value) => ({
      id: `brand-${value.toLowerCase()}`,
      label: value,
      value,
      meta: "Brand",
      type: "brand" as const
    })),
    ...[...categorySuggestions].slice(0, 2).map((value) => ({
      id: `category-${value.toLowerCase()}`,
      label: value,
      value,
      meta: "Category",
      type: "category" as const
    }))
  ];

  return {
    recent: [],
    suggestions:
      productSuggestions.length || supplemental.length
        ? [...productSuggestions, ...supplemental].slice(0, 6)
        : [
            {
              id: "no-match",
              label: "Try a different keyword",
              value: "",
              type: "empty" as const
            }
          ]
  };
}

export function getHighlightParts(text: string, query: string) {
  const terms = [...new Set(splitTerms(query))];
  if (!terms.length) {
    return [{ text, match: false }];
  }

  const escapedTerms = terms
    .map((term) => term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
    .sort((left, right) => right.length - left.length);

  const matcher = new RegExp(`(${escapedTerms.join("|")})`, "ig");
  const parts = text.split(matcher).filter(Boolean);

  return parts.map((part) => ({
    text: part,
    match: terms.some((term) => part.toLowerCase() === term)
  }));
}

export function getActiveFilters(filters: SearchFilters): ActiveFilter[] {
  const active: ActiveFilter[] = [];

  for (const category of filters.categories) {
    active.push({
      id: `category-${category}`,
      label: category,
      type: "category"
    });
  }

  for (const brand of filters.brands) {
    active.push({
      id: `brand-${brand}`,
      label: brand,
      type: "brand"
    });
  }

  if (filters.maxPrice < filters.priceCap) {
    active.push({
      id: "price",
      label: `Under $${filters.maxPrice}`,
      type: "price"
    });
  }

  if (filters.inStockOnly) {
    active.push({
      id: "stock",
      label: "In stock only",
      type: "stock"
    });
  }

  return active;
}
