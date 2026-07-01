import type { Product } from "@/types/product";

import { EmptyState } from "@/components/EmptyState";
import { LoadingSkeleton } from "@/components/LoadingSkeleton";
import { ProductCard } from "@/components/ProductCard";
import { formatCurrency } from "@/utils/format";

export function ProductGrid({
  products,
  query,
  isLoading,
  onReset,
  wishlist,
  onWishlistToggle,
  onViewDetails
}: {
  products: Product[];
  query: string;
  isLoading: boolean;
  onReset: () => void;
  wishlist: Set<number>;
  onWishlistToggle: (id: number) => void;
  onViewDetails: (product: Product) => void;
}) {
  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(252px,1fr))] gap-[22px] max-[900px]:grid-cols-[repeat(auto-fill,minmax(150px,1fr))] max-[900px]:gap-3.5">
      {isLoading ? <LoadingSkeleton count={8} /> : null}

      {!isLoading && !products.length ? (
        <EmptyState
          title="No products found"
          description="Try a different search term, or clear your filters to see the full catalog."
          actionLabel="Clear all filters"
          onAction={onReset}
        />
      ) : null}

      {!isLoading
        ? products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              query={query}
              wished={wishlist.has(product.id)}
              onWishlistToggle={onWishlistToggle}
              onViewDetails={onViewDetails}
            />
          ))
        : null}
    </div>
  );
}
