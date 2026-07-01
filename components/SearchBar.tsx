"use client";

import { useEffect, useRef, useState } from "react";

import type { SearchSuggestion } from "@/types/product";

import { Icon } from "@/components/Icons";
import { SearchSuggestions } from "@/components/SearchSuggestions";

export function SearchBar({
  query,
  suggestions,
  recentSearches,
  onQueryChange,
  onSubmit,
  onClear,
  onRemoveRecent
}: {
  query: string;
  suggestions: SearchSuggestion[];
  recentSearches: SearchSuggestion[];
  onQueryChange: (value: string) => void;
  onSubmit: (value: string) => void;
  onClear: () => void;
  onRemoveRecent: (value: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const allSuggestions = [...recentSearches, ...suggestions].filter(
    (suggestion) => suggestion.type !== "empty"
  );

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "/" && document.activeElement !== inputRef.current) {
        event.preventDefault();
        inputRef.current?.focus();
      }
    };

    const onPointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
        setActiveIndex(-1);
      }
    };

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("mousedown", onPointerDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("mousedown", onPointerDown);
    };
  }, []);

  useEffect(() => {
    setActiveIndex(-1);
  }, [query, recentSearches, suggestions]);

  const commitSuggestion = (suggestion: SearchSuggestion) => {
    onSubmit(suggestion.value);
    setOpen(false);
    setActiveIndex(-1);
    inputRef.current?.focus();
  };

  return (
    <div ref={containerRef} className="relative flex-1 max-w-[640px] max-[900px]:max-w-none">
      <div className="flex items-center gap-2 rounded-full border-[1.5px] border-[#e8e1d6] bg-white px-4 py-2.5 transition focus-within:border-[#c1602f] focus-within:shadow-[0_0_0_4px_rgba(193,96,47,0.12)]">
        <Icon name="search" className="size-4 text-[#5c5650]" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onFocus={() => setOpen(true)}
          onChange={(event) => {
            onQueryChange(event.target.value);
            setOpen(true);
          }}
          onKeyDown={(event) => {
            if (event.key === "ArrowDown") {
              event.preventDefault();
              setOpen(true);
              setActiveIndex((current) => (allSuggestions.length ? (current + 1) % allSuggestions.length : -1));
            }

            if (event.key === "ArrowUp") {
              event.preventDefault();
              setOpen(true);
              setActiveIndex((current) =>
                allSuggestions.length ? (current <= 0 ? allSuggestions.length - 1 : current - 1) : -1
              );
            }

            if (event.key === "Enter") {
              event.preventDefault();
              if (activeIndex >= 0 && allSuggestions[activeIndex]) {
                commitSuggestion(allSuggestions[activeIndex]);
                return;
              }

              onSubmit(query);
              setOpen(false);
            }

            if (event.key === "Escape") {
              setOpen(false);
              setActiveIndex(-1);
              inputRef.current?.blur();
            }
          }}
          placeholder="Search by product, brand, or category..."
          aria-label="Search products"
          aria-autocomplete="list"
          aria-expanded={open}
          aria-controls="search-suggestions"
          aria-activedescendant={activeIndex >= 0 ? `search-suggestion-${activeIndex}` : undefined}
          className="min-w-0 flex-1 bg-transparent text-[14.5px] text-[#241f1a] outline-none placeholder:text-[#a39c91]"
        />
        <span className="rounded-[5px] border border-[#e8e1d6] px-1.5 py-0.5 text-[11px] text-[#a39c91] max-[900px]:hidden">
          /
        </span>
        {query ? (
          <button
            type="button"
            onClick={() => {
              onClear();
              setOpen(true);
              inputRef.current?.focus();
            }}
            className="inline-flex size-5 items-center justify-center rounded-full bg-[#e8e1d6] text-[#5c5650] transition hover:bg-[#ddd4c5]"
            aria-label="Clear search"
          >
            <Icon name="close" className="size-3" />
          </button>
        ) : null}
      </div>

      <div id="search-suggestions">
        <SearchSuggestions
          open={open}
          query={query}
          recentSearches={recentSearches}
          suggestions={suggestions}
          activeIndex={activeIndex}
          onSelect={commitSuggestion}
          onRemoveRecent={onRemoveRecent}
          onHover={setActiveIndex}
        />
      </div>
    </div>
  );
}
