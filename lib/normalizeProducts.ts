import { fallbackProducts } from "@/lib/fallbackProducts";
import type { Product, RawProduct } from "@/types/product";

export const PRODUCTS_DATASET_URL =
  "https://media.downshift.app/hiring/founding-engineer/items.json";

const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1517705008128-361805f42e86?auto=format&fit=crop&w=900&q=80";

function normalizeWhitespace(value: string) {
  return value.trim().replace(/\s+/g, " ");
}

function toTitleCase(value: string) {
  return value.replace(/\w\S*/g, (word) => {
    const lower = word.toLowerCase();
    return lower.charAt(0).toUpperCase() + lower.slice(1);
  });
}

function normalizeLabel(value: string, fallback: string, shouldTitleCase = false) {
  const cleaned = normalizeWhitespace(value || "");
  if (!cleaned) {
    return fallback;
  }

  return shouldTitleCase ? toTitleCase(cleaned) : cleaned;
}

function normalizeTags(tags: unknown) {
  if (!Array.isArray(tags)) {
    return [];
  }

  return tags
    .map((tag) => String(tag ?? ""))
    .map((tag) => normalizeWhitespace(tag))
    .filter(Boolean)
    .map((tag) => tag.toLowerCase());
}

function normalizePrice(price: RawProduct["price"]) {
  if (typeof price === "number" && Number.isFinite(price)) {
    return price;
  }

  if (typeof price === "string") {
    const parsed = Number(price.replace(/,/g, ""));
    return Number.isFinite(parsed) ? parsed : null;
  }

  return null;
}

function normalizeDate(value: string | null | undefined) {
  if (!value) {
    return { releasedAt: null, releasedTimestamp: 0 };
  }

  const timestamp = Date.parse(value);
  if (Number.isNaN(timestamp)) {
    return { releasedAt: null, releasedTimestamp: 0 };
  }

  return { releasedAt: value, releasedTimestamp: timestamp };
}

function isAllowedImage(url: string | null | undefined) {
  if (!url) {
    return false;
  }

  return /^https?:\/\//i.test(url);
}

export function normalizeProducts(rawProducts: RawProduct[] | null | undefined): Product[] {
  const source = rawProducts?.length ? rawProducts : fallbackProducts;

  return source.map((item, index) => {
    const title = normalizeLabel(String(item.title ?? ""), `Untitled Product ${index + 1}`, true);
    const brand = normalizeLabel(String(item.brand ?? ""), "Unknown Brand");
    const category = normalizeLabel(String(item.category ?? ""), "Uncategorized");
    const tags = normalizeTags(item.tags);
    const price = normalizePrice(item.price);
    const rating =
      typeof item.rating === "number" && Number.isFinite(item.rating) ? item.rating : null;
    const reviews =
      typeof item.reviews === "number" && Number.isFinite(item.reviews) && item.reviews >= 0
        ? item.reviews
        : 0;
    const image: string | null = isAllowedImage(item.image) ? item.image ?? DEFAULT_IMAGE : DEFAULT_IMAGE;
    const imageWidth =
      typeof item.imageWidth === "number" && Number.isFinite(item.imageWidth)
        ? item.imageWidth
        : null;
    const imageHeight =
      typeof item.imageHeight === "number" && Number.isFinite(item.imageHeight)
        ? item.imageHeight
        : null;
    const description = normalizeLabel(
      String(item.description ?? ""),
      `${title} by ${brand}. Crafted for everyday living.`
    );
    const { releasedAt, releasedTimestamp } = normalizeDate(item.releasedAt);

    return {
      id:
        typeof item.id === "number" && Number.isFinite(item.id)
          ? item.id
          : typeof item.id === "string"
            ? Number(item.id) || index + 1
            : index + 1,
      title,
      brand,
      category,
      tags,
      price,
      rating,
      reviews,
      inStock: Boolean(item.inStock),
      releasedAt,
      releasedTimestamp,
      image,
      imageWidth,
      imageHeight,
      description,
      searchText: [title, brand, category, tags.join(" "), description].join(" ").toLowerCase()
    };
  });
}

export async function getNormalizedProductsFromSource() {
  try {
    const response = await fetch(PRODUCTS_DATASET_URL, {
      next: { revalidate: 3600 }
    });

    if (!response.ok) {
      throw new Error(`Dataset request failed with ${response.status}`);
    }

    const data = (await response.json()) as RawProduct[];
    return normalizeProducts(data);
  } catch {
    return normalizeProducts(fallbackProducts);
  }
}
