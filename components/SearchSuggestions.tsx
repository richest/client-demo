import type { SearchSuggestion } from "@/types/product";

import { Icon } from "@/components/Icons";
import { getHighlightParts } from "@/lib/search";

function SuggestionText({ text, query }: { text: string; query: string }) {
  return (
    <>
      {getHighlightParts(text, query).map((part, index) => (
        <span
          key={`${part.text}-${index}`}
          className={part.match ? "rounded-[3px] bg-[rgba(199,154,60,0.32)] px-0.5" : undefined}
        >
          {part.text}
        </span>
      ))}
    </>
  );
}

export function SearchSuggestions({
  open,
  query,
  recentSearches,
  suggestions,
  activeIndex,
  onSelect,
  onRemoveRecent,
  onHover
}: {
  open: boolean;
  query: string;
  recentSearches: SearchSuggestion[];
  suggestions: SearchSuggestion[];
  activeIndex: number;
  onSelect: (suggestion: SearchSuggestion) => void;
  onRemoveRecent: (value: string) => void;
  onHover: (index: number) => void;
}) {
  if (!open || (!recentSearches.length && !suggestions.length)) {
    return null;
  }

  let offset = 0;

  return (
    <div
      className="absolute left-0 right-0 top-[calc(100%+8px)] z-[60] overflow-hidden rounded-[14px] border border-[#e8e1d6] bg-white shadow-[0_24px_48px_-16px_rgba(36,31,26,0.22)]"
      role="listbox"
      aria-label="Search suggestions"
    >
      {!query && recentSearches.length ? (
        <>
          <p className="px-4 pb-1 pt-3 text-[11px] font-semibold uppercase tracking-[0.06em] text-[#a39c91]">
            Recent searches
          </p>
          {recentSearches.map((suggestion, index) => (
            <button
              key={suggestion.id}
              id={`search-suggestion-${index}`}
              type="button"
              role="option"
              aria-selected={activeIndex === index}
              onMouseEnter={() => onHover(index)}
              onClick={() => onSelect(suggestion)}
              className={`flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm ${
                activeIndex === index ? "bg-[#f4efe4]" : "hover:bg-[#f4efe4]"
              }`}
            >
              <Icon name="clock" className="size-3.5 text-[#a39c91]" />
              <span>{suggestion.label}</span>
              <span className="ml-auto">
                <span
                  role="button"
                  tabIndex={-1}
                  onClick={(event) => {
                    event.stopPropagation();
                    onRemoveRecent(suggestion.value);
                  }}
                  className="inline-flex size-6 items-center justify-center rounded-full text-[#a39c91] transition hover:bg-[#ece6da] hover:text-[#241f1a]"
                  aria-label={`Remove ${suggestion.value} from recent searches`}
                >
                  <Icon name="close" className="size-3" />
                </span>
              </span>
            </button>
          ))}
        </>
      ) : null}

      {!query ? (
        <p className="px-4 pb-1 pt-3 text-[11px] font-semibold uppercase tracking-[0.06em] text-[#a39c91]">
          Popular categories
        </p>
      ) : (
        <p className="px-4 pb-1 pt-3 text-[11px] font-semibold uppercase tracking-[0.06em] text-[#a39c91]">
          {suggestions[0]?.type === "empty" ? "No matches" : "Suggestions"}
        </p>
      )}

      {suggestions.map((suggestion, index) => {
        const absoluteIndex = index + recentSearches.length;

        if (suggestion.type === "empty") {
          return (
            <div key={suggestion.id} className="px-4 py-2.5 text-sm text-[#a39c91]">
              {suggestion.label}
            </div>
          );
        }

        return (
          <button
            key={suggestion.id}
            id={`search-suggestion-${absoluteIndex}`}
            type="button"
            role="option"
            aria-selected={activeIndex === absoluteIndex}
            onMouseEnter={() => onHover(absoluteIndex)}
            onClick={() => onSelect(suggestion)}
            className={`flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm ${
              activeIndex === absoluteIndex ? "bg-[#f4efe4]" : "hover:bg-[#f4efe4]"
            }`}
          >
            <Icon
              name={suggestion.type === "category" ? "sparkles" : suggestion.type === "brand" ? "house" : "search"}
              className="size-3.5 text-[#a39c91]"
            />
            <span className="min-w-0 flex-1">
              <SuggestionText text={suggestion.label} query={query} />
            </span>
            {suggestion.meta ? (
              <span className="text-xs text-[#a39c91]">{suggestion.meta}</span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
