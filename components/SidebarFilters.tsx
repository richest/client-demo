"use client";

import { useState } from "react";

import type { FacetOption, ProductSort } from "@/types/product";

import { Icon } from "@/components/Icons";
import { SORT_OPTIONS } from "@/utils/constants";

function FilterCheckbox({
  id,
  label,
  checked,
  count,
  onChange
}: {
  id: string;
  label: string;
  checked: boolean;
  count: number;
  onChange: () => void;
}) {
  return (
    <label htmlFor={id} className="flex cursor-pointer items-center gap-2.5 py-1.5 text-sm text-[#241f1a] hover:text-[#c1602f] transition-colors select-none">
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="size-[15px] accent-[#c1602f] cursor-pointer"
      />
      <span>{label}</span>
      <span className="ml-auto text-xs text-[#a39c91]">{count}</span>
    </label>
  );
}

function AccordionSection({
  title,
  isOpen,
  onToggle,
  onClear,
  showClear,
  children
}: {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  onClear?: () => void;
  showClear?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="border-b border-[#e8e1d6] py-4 last:border-b-0">
      <div className="flex cursor-pointer items-center justify-between select-none" onClick={onToggle}>
        <h3 className="text-[15px] font-semibold text-[#241f1a] hover:text-[#c1602f] transition-colors">
          {title}
        </h3>
        <div className="flex items-center gap-3.5" onClick={(e) => e.stopPropagation()}>
          {showClear && onClear && (
            <button
              type="button"
              onClick={onClear}
              className="text-xs font-semibold text-[#c1602f] hover:underline"
            >
              Clear
            </button>
          )}
          <button
            type="button"
            onClick={onToggle}
            className="text-[#5c5650] hover:text-[#c1602f] transition-transform duration-200"
            style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}
            aria-label={`Toggle ${title} section`}
          >
            <Icon name="arrow-down" className="size-4" />
          </button>
        </div>
      </div>
      {isOpen && <div className="mt-3.5 animate-fadeIn">{children}</div>}
    </div>
  );
}

export function SidebarFilters({
  open,
  categories,
  brands,
  selectedCategories,
  selectedBrands,
  maxPrice,
  priceCap,
  inStockOnly,
  sort,
  onToggleCategory,
  onToggleBrand,
  onPriceChange,
  onStockToggle,
  onSortChange,
  onClearCategories,
  onClearBrands,
  onClose,
  onReset
}: {
  open: boolean;
  categories: FacetOption[];
  brands: FacetOption[];
  selectedCategories: string[];
  selectedBrands: string[];
  maxPrice: number;
  priceCap: number;
  inStockOnly: boolean;
  sort: ProductSort;
  onToggleCategory: (category: string) => void;
  onToggleBrand: (brand: string) => void;
  onPriceChange: (price: number) => void;
  onStockToggle: (checked: boolean) => void;
  onSortChange: (sort: ProductSort) => void;
  onClearCategories: () => void;
  onClearBrands: () => void;
  onClose: () => void;
  onReset?: () => void;
}) {
  const [openSections, setOpenSections] = useState({
    categories: true,
    brands: false,
    price: false,
    stock: false,
    sort: false,
  });

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((current) => ({
      ...current,
      [section]: !current[section],
    }));
  };

  return (
    <>
      <div
        onClick={onClose}
        className={`fixed inset-0 z-[90] bg-[rgba(36,31,26,0.45)] transition ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        } min-[901px]:hidden`}
        aria-hidden="true"
      />

      <aside
        className={`sticky top-[88px] self-start rounded-[14px] border border-[#e8e1d6] bg-white p-[22px] shadow-[0_1px_2px_rgba(36,31,26,0.06),0_1px_1px_rgba(36,31,26,0.04)] max-[900px]:fixed max-[900px]:right-0 max-[900px]:top-0 max-[900px]:z-[95] max-[900px]:h-full max-[900px]:w-[84%] max-[900px]:max-w-[340px] max-[900px]:overflow-y-auto max-[900px]:rounded-none max-[900px]:transition-transform ${
          open ? "max-[900px]:translate-x-0" : "max-[900px]:translate-x-full"
        }`}
        aria-label="Product filters"
      >
        <div className="mb-2 flex items-center justify-between pb-4 border-b border-[#e8e1d6]">
          <h2 className="font-[Fraunces,Georgia,serif] text-xl font-semibold text-[#241f1a]">Filters</h2>
          <div className="flex items-center gap-3">
            {onReset && (
              <button
                type="button"
                onClick={onReset}
                className="text-[#5c5650] hover:text-[#c1602f] transition cursor-pointer"
                aria-label="Reset all filters"
              >
                <svg viewBox="0 0 24 24" className="size-[18px]" stroke="currentColor" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
                </svg>
              </button>
            )}
            <button
              type="button"
              className="text-[#5c5650] hover:text-[#c1602f] transition cursor-pointer max-[900px]:hidden"
              aria-label="Filter settings"
            >
              <Icon name="filter" className="size-[18px]" />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="inline-flex size-9 items-center justify-center rounded-full border border-[#e8e1d6] text-[#241f1a] cursor-pointer min-[901px]:hidden"
              aria-label="Close filters"
            >
              <Icon name="close" className="size-4" />
            </button>
          </div>
        </div>

        <AccordionSection
          title="Categories"
          isOpen={openSections.categories}
          onToggle={() => toggleSection("categories")}
          onClear={onClearCategories}
          showClear={selectedCategories.length > 0}
        >
          <div className="flex flex-col">
            {categories.map((category) => (
              <FilterCheckbox
                key={category.label}
                id={`category-${category.label}`}
                label={category.label}
                count={category.count}
                checked={selectedCategories.includes(category.label)}
                onChange={() => onToggleCategory(category.label)}
              />
            ))}
          </div>
        </AccordionSection>

        <AccordionSection
          title="Brand"
          isOpen={openSections.brands}
          onToggle={() => toggleSection("brands")}
          onClear={onClearBrands}
          showClear={selectedBrands.length > 0}
        >
          <div className="flex flex-col animate-fadeIn">
            {brands.map((brand) => (
              <FilterCheckbox
                key={brand.label}
                id={`brand-${brand.label}`}
                label={brand.label}
                count={brand.count}
                checked={selectedBrands.includes(brand.label)}
                onChange={() => onToggleBrand(brand.label)}
              />
            ))}
          </div>
        </AccordionSection>

        <AccordionSection
          title="Price Range"
          isOpen={openSections.price}
          onToggle={() => toggleSection("price")}
        >
          <div className="flex flex-col gap-2.5">
            <input
              type="range"
              min={0}
              max={priceCap}
              step={10}
              value={maxPrice}
              onChange={(event) => onPriceChange(Number(event.target.value))}
              className="w-full accent-[#c1602f] cursor-pointer"
              aria-label="Maximum price"
            />
            <div className="mt-1 flex items-center gap-2">
              <span className="text-[12.5px] text-[#5c5650] select-none">Up to</span>
              <input
                type="number"
                min={0}
                max={priceCap}
                value={maxPrice}
                onChange={(event) => {
                  const next = Math.max(0, Math.min(priceCap, Number(event.target.value) || 0));
                  onPriceChange(next);
                }}
                className="w-full rounded-lg border-[1.5px] border-[#e8e1d6] px-2.5 py-2 text-[13px] text-[#241f1a] outline-none focus:border-[#c1602f] transition"
                aria-label="Maximum price input"
              />
            </div>
          </div>
        </AccordionSection>

        <AccordionSection
          title="In Stock Only"
          isOpen={openSections.stock}
          onToggle={() => toggleSection("stock")}
        >
          <label className="flex cursor-pointer items-center gap-2.5 text-sm text-[#241f1a] hover:text-[#c1602f] transition-colors py-1 select-none">
            <input
              type="checkbox"
              checked={inStockOnly}
              onChange={(event) => onStockToggle(event.target.checked)}
              className="size-[15px] accent-[#c1602f] cursor-pointer"
            />
            Show only available items
          </label>
        </AccordionSection>

        <AccordionSection
          title="Sort By"
          isOpen={openSections.sort}
          onToggle={() => toggleSection("sort")}
        >
          <div className="relative">
            <select
              value={sort}
              onChange={(event) => onSortChange(event.target.value as ProductSort)}
              className="w-full appearance-none rounded-lg border-[1.5px] border-[#e8e1d6] bg-white pl-3 pr-8 py-2.5 text-[13.5px] text-[#241f1a] outline-none focus:border-[#c1602f] cursor-pointer transition"
              aria-label="Sort products"
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <Icon
              name="arrow-down"
              className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-[#5c5650]"
            />
          </div>
        </AccordionSection>

        {onReset && (
          <button
            type="button"
            onClick={onReset}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl border border-[#c1602f] bg-white py-3 text-sm font-semibold text-[#c1602f] transition hover:bg-[#c1602f] hover:text-white cursor-pointer duration-200"
          >
            <svg viewBox="0 0 24 24" className="size-4" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
            </svg>
            Reset Filter
          </button>
        )}
      </aside>
    </>
  );
}
