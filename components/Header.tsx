import type { SearchSuggestion } from "@/types/product";

import { Icon } from "@/components/Icons";
import { SearchBar } from "@/components/SearchBar";

export function Header({
  query,
  suggestions,
  recentSearches,
  onQueryChange,
  onSearchSubmit,
  onClearSearch,
  onRemoveRecent,
  wishlistCount,
  onOpenFilters
}: {
  query: string;
  suggestions: SearchSuggestion[];
  recentSearches: SearchSuggestion[];
  onQueryChange: (value: string) => void;
  onSearchSubmit: (value: string) => void;
  onClearSearch: () => void;
  onRemoveRecent: (value: string) => void;
  wishlistCount: number;
  onOpenFilters: () => void;
}) {
  return (
    <header className="sticky top-0 z-50 border-b border-[#e8e1d6] bg-[rgba(250,246,239,0.86)] backdrop-blur-[14px] backdrop-saturate-150">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-6 px-7 py-3.5 max-[900px]:gap-3 max-[900px]:px-[18px] max-[900px]:py-3">
        <div className="whitespace-nowrap font-[Fraunces,Georgia,serif] text-[21px] font-semibold tracking-[-0.02em]">
          <span className="inline-flex items-center gap-[9px]">
            <span className="flex size-[30px] rotate-[-3deg] items-center justify-center rounded-[8px] bg-[linear-gradient(155deg,#c1602f,#9c4720)] text-white shadow-[0_1px_2px_rgba(36,31,26,0.06),0_1px_1px_rgba(36,31,26,0.04)]">
              <Icon name="house" className="size-3.5" />
            </span>
            Hearth
          </span>
        </div>

        <div className="order-3 basis-full min-[901px]:order-none min-[901px]:basis-auto">
          <SearchBar
            query={query}
            suggestions={suggestions}
            recentSearches={recentSearches}
            onQueryChange={onQueryChange}
            onSubmit={onSearchSubmit}
            onClear={onClearSearch}
            onRemoveRecent={onRemoveRecent}
          />
        </div>

        <div className="ml-auto flex shrink-0 items-center gap-2">

          <button
            type="button"
            aria-label={`Wishlist with ${wishlistCount} saved items`}
            className="relative inline-flex size-[38px] items-center justify-center rounded-full border-[1.5px] border-[#e8e1d6] bg-white text-[#241f1a] transition hover:border-[#c1602f] hover:text-[#c1602f]"
          >
            <Icon name="heart" className="size-4" />
            {wishlistCount ? (
              <span className="absolute -right-1 -top-1 inline-flex min-w-4 items-center justify-center rounded-full bg-[#241f1a] px-1 text-[10px] font-semibold text-white">
                {wishlistCount}
              </span>
            ) : null}
          </button>
          <div className="flex size-[38px] items-center justify-center rounded-full bg-[linear-gradient(155deg,#6f7d5e,#4f5a40)] font-[Fraunces,Georgia,serif] text-sm font-semibold text-white">
            U
          </div>
        </div>
      </div>
    </header>
  );
}
