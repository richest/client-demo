import type { ActiveFilter } from "@/types/product";

import { Icon } from "@/components/Icons";

export function ActiveFilters({
  filters,
  onRemove
}: {
  filters: ActiveFilter[];
  onRemove: (filter: ActiveFilter) => void;
}) {
  if (!filters.length) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-1.5">
      {filters.map((filter) => (
        <button
          key={filter.id}
          type="button"
          onClick={() => onRemove(filter)}
          className="inline-flex items-center gap-1.5 rounded-full bg-[#f4efe4] px-3 py-1.5 text-[12.5px] font-semibold text-[#5c5650] transition hover:bg-[#ece6da]"
          aria-label={`Remove ${filter.label} filter`}
        >
          {filter.label}
          <Icon name="close" className="size-3" />
        </button>
      ))}
    </div>
  );
}
