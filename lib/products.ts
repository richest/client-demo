import { getNormalizedProductsFromSource } from "@/lib/normalizeProducts";
import type { Product } from "@/types/product";

const REVALIDATE_SECONDS = 3600;

interface ProductsApiResponse {
  products: Product[];
  count: number;
  error?: string;
}

function getInternalApiUrl(pathname: string) {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.SITE_URL ??
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null);

  if (!siteUrl) {
    return null;
  }

  return new URL(pathname, siteUrl).toString();
}

export async function getProducts(): Promise<Product[]> {
  const internalApiUrl = getInternalApiUrl("/api/products");

  if (!internalApiUrl) {
    return getNormalizedProductsFromSource();
  }

  try {
    const response = await fetch(internalApiUrl, {
      next: { revalidate: REVALIDATE_SECONDS }
    });

    if (!response.ok) {
      throw new Error(`Products API request failed with ${response.status}`);
    }

    const data = (await response.json()) as ProductsApiResponse;
    return Array.isArray(data.products) ? data.products : [];
  } catch {
    return getNormalizedProductsFromSource();
  }
}
