import { Icon } from "@/components/Icons";
import { CATEGORY_ICONS } from "@/utils/constants";

export function QuickFilters({
  categories,
  selectedCategories,
  onToggle
}: {
  categories: Array<{ label: string; count: number }>;
  selectedCategories: string[];
  onToggle: (category: string) => void;
}) {
  return (
    <section
      aria-label="Popular categories"
      className="mx-auto flex max-w-7xl flex-wrap justify-center gap-2.5 px-7 pb-7 max-[900px]:px-5"
    >
      {categories.map((category) => {
        const active = selectedCategories.includes(category.label);
        return (
          <button
            key={category.label}
            type="button"
            onClick={() => onToggle(category.label)}
            className={`inline-flex items-center gap-2 rounded-full border px-[18px] py-[9px] text-[13.5px] font-semibold transition duration-150 hover:-translate-y-0.5 ${
              active
                ? "border-[#241f1a] bg-[#241f1a] text-white"
                : "border-[#e8e1d6] bg-white text-[#5c5650] hover:border-[#c1602f] hover:text-[#9c4720]"
            }`}
          >
            <Icon
              name={CATEGORY_ICONS[category.label] ?? "sparkles"}
              className="size-4"
            />
            {category.label}
            <span className="text-[11px] opacity-65">{category.count}</span>
          </button>
        );
      })}
    </section>
  );
}
