"use client";

import { useState } from "react";
import { useSearch } from "@/hooks/useSearch";
import type { Product } from "@/types/product";

import { ActiveFilters } from "@/components/ActiveFilters";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { PaginationControls } from "@/components/PaginationControls";
import { ProductGrid } from "@/components/ProductGrid";
import { ProductModal } from "@/components/ProductModal";
import { QuickFilters } from "@/components/QuickFilters";
import { SidebarFilters } from "@/components/SidebarFilters";

export function ProductDiscovery() {
  const search = useSearch();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  return (
    <div>
      <Header
        query={search.query}
        suggestions={search.suggestions}
        recentSearches={search.recentSuggestionItems}
        onQueryChange={search.setQuery}
        onSearchSubmit={search.commitSearch}
        onClearSearch={search.clearSearch}
        onRemoveRecent={search.removeRecentSearch}
        wishlistCount={search.wishlistCount}
        onOpenFilters={() => search.setMobileFiltersOpen(true)}
      />

      <Hero totalProducts={search.results.length} />

      <QuickFilters
        categories={search.popularCategories}
        selectedCategories={search.selectedCategories}
        onToggle={search.quickToggleCategory}
      />

      <main className="mx-auto grid max-w-7xl grid-cols-[264px_minmax(0,1fr)] items-start gap-9 px-7 pb-24 max-[900px]:grid-cols-1 max-[900px]:px-[18px] max-[900px]:pb-[70px]">
        <SidebarFilters
          open={search.mobileFiltersOpen}
          categories={search.categories}
          brands={search.brands}
          selectedCategories={search.selectedCategories}
          selectedBrands={search.selectedBrands}
          maxPrice={search.maxPrice}
          priceCap={search.priceCap}
          inStockOnly={search.inStockOnly}
          sort={search.sort}
          onToggleCategory={search.toggleCategory}
          onToggleBrand={search.toggleBrand}
          onPriceChange={search.setMaxPrice}
          onStockToggle={search.setInStockOnly}
          onSortChange={search.setSort}
          onClearCategories={search.clearCategories}
          onClearBrands={search.clearBrands}
          onClose={() => search.setMobileFiltersOpen(false)}
          onReset={search.resetAll}
        />

        <section aria-label="Search results" className="min-w-0">
          <div className="mb-[18px] flex flex-wrap items-center justify-between gap-4">
            <p className="text-[14.5px] text-[#5c5650]">
              Showing{" "}
              <strong className="font-bold text-[#241f1a]">
                {search.results.length.toLocaleString()}
              </strong>{" "}
              product{search.results.length === 1 ? "" : "s"}
              {!search.isSearching ? (
                <span>
                  {" "}
                  · Page <strong className="font-bold text-[#241f1a]">{search.currentPage}</strong> of{" "}
                  <strong className="font-bold text-[#241f1a]">{search.totalPages}</strong>
                </span>
              ) : null}
            </p>
            <ActiveFilters filters={search.activeFilters} onRemove={search.removeActiveFilter} />
          </div>

          <ProductGrid
            products={search.paginatedResults}
            query={search.query}
            isLoading={search.isSearching}
            onReset={search.resetAll}
            wishlist={search.wishlist}
            onWishlistToggle={search.toggleWishlist}
            onViewDetails={setSelectedProduct}
          />

          <PaginationControls
            currentPage={search.currentPage}
            totalPages={search.totalPages}
            onPageChange={search.setCurrentPage}
          />
        </section>
      </main>

      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        wished={selectedProduct ? search.wishlist.has(selectedProduct.id) : false}
        onWishlistToggle={search.toggleWishlist}
      />
    </div>
  );
}
