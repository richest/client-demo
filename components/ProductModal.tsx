"use client";

import { useEffect } from "react";
import type { Product } from "@/types/product";
import { Icon } from "@/components/Icons";
import { formatCurrency, formatCount } from "@/utils/format";

export function ProductModal({
  product,
  onClose,
  wished,
  onWishlistToggle
}: {
  product: Product | null;
  onClose: () => void;
  wished: boolean;
  onWishlistToggle: (id: number) => void;
}) {
  // Listen for Escape key to close
  useEffect(() => {
    if (!product) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [product, onClose]);

  if (!product) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-[rgba(36,31,26,0.55)] backdrop-blur-[6px] transition-opacity duration-300"
      />

      {/* Modal Box */}
      <div className="relative z-10 flex w-full max-w-2xl transform flex-col overflow-hidden rounded-[20px] border border-[#e8e1d6] bg-white shadow-[0_24px_48px_-12px_rgba(36,31,26,0.25)] transition-all duration-300 animate-in fade-in zoom-in-95 sm:flex-row md:max-w-3xl">
        
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-20 flex size-9 items-center justify-center rounded-full bg-white/90 text-[#241f1a] shadow-[0_1px_2px_rgba(36,31,26,0.06),0_1px_1px_rgba(36,31,26,0.04)] backdrop-blur transition hover:scale-105 hover:bg-white hover:text-[#c1602f] focus:outline-none"
          aria-label="Close details"
        >
          <Icon name="close" className="size-4" />
        </button>

        {/* Media Column */}
        <div className="relative aspect-[4/3] w-full bg-[#f0ebe0] sm:aspect-auto sm:w-[42%]">
          {product.image ? (
            <img
              src={product.image}
              alt={product.title}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-[linear-gradient(135deg,#efe6da,#ddd4c5)] text-sm font-medium text-[#5c5650]">
              Image unavailable
            </div>
          )}
          <span
            className={`absolute left-4 top-4 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.03em] text-white ${
              product.inStock ? "bg-[rgba(36,31,26,0.85)]" : "bg-[#a35a3c]"
            }`}
          >
            {product.inStock ? "In stock" : "Sold out"}
          </span>
        </div>

        {/* Content Column */}
        <div className="flex flex-1 flex-col p-6 sm:p-8">
          <div className="flex-1">
            <span className="text-[12px] font-bold uppercase tracking-[0.06em] text-[#9c4720]">
              {product.brand}
            </span>
            <h2 className="mt-1 font-[Fraunces,Georgia,serif] text-[clamp(20px,3vw,26px)] font-semibold leading-[1.2] text-[#241f1a]">
              {product.title}
            </h2>

            {/* Category tag */}
            <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-[#f4efe4] px-3 py-1 text-[12px] font-medium text-[#5c5650]">
              <span className="font-semibold text-[#5c5650]">{product.category}</span>
            </div>

            {/* Rating and reviews */}
            <div className="mt-4 flex items-center gap-2.5 text-[13px] text-[#5c5650]">
              {product.rating === null ? (
                <span className="inline-flex items-center gap-1 text-[#a39c91]">
                  <Icon name="star" className="size-3 text-[#a39c91]" />
                  New arrival
                </span>
              ) : (
                <span className="inline-flex items-center gap-1">
                  <Icon name="star" className="size-3.5 text-[#c79a3c]" />
                  {product.rating.toFixed(1)}
                </span>
              )}
              <span>&middot;</span>
              <span>{formatCount(product.reviews)} reviews</span>
            </div>

            <hr className="my-5 border-t border-[#e8e1d6]" />

            <p className="text-[14px] leading-[1.6] text-[#5c5650]">
              {product.description}
            </p>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
            <span className="font-[Fraunces,Georgia,serif] text-[24px] font-semibold text-[#241f1a]">
              {formatCurrency(product.price)}
            </span>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => onWishlistToggle(product.id)}
                className={`inline-flex size-[42px] items-center justify-center rounded-full border-[1.5px] border-[#e8e1d6] bg-white transition hover:scale-105 hover:border-[#c1602f] ${
                  wished ? "text-[#c1602f]" : "text-[#241f1a]"
                }`}
                aria-label="Toggle wishlist"
              >
                <Icon name="heart" className="size-4" />
              </button>
              <button
                type="button"
                onClick={onClose}
                className="rounded-full border-[1.5px] border-[#241f1a] bg-[#241f1a] px-6 py-2.5 text-[13.5px] font-semibold text-white transition hover:border-[#c1602f] hover:bg-[#c1602f]"
              >
                Close
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
