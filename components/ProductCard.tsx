"use client";

import { memo, useState } from "react";

import type { Product } from "@/types/product";

import { Icon } from "@/components/Icons";
import { getHighlightParts } from "@/lib/search";
import { formatCount, formatCurrency } from "@/utils/format";

function HighlightText({ text, query }: { text: string; query: string }) {
  return (
    <>
      {getHighlightParts(text, query).map((part, index) => (
        <span
          key={`${part.text}-${index}`}
          className={part.match ? "rounded-[3px] bg-[rgba(199,154,60,0.35)]" : undefined}
        >
          {part.text}
        </span>
      ))}
    </>
  );
}

function ProductCardComponent({
  product,
  query,
  wished,
  onWishlistToggle,
  onViewDetails
}: {
  product: Product;
  query: string;
  wished: boolean;
  onWishlistToggle: (id: number) => void;
  onViewDetails: (product: Product) => void;
}) {
  const [imageFailed, setImageFailed] = useState(false);

  return (
    <article className="flex flex-col [contain-intrinsic-size:420px] [content-visibility:auto] overflow-hidden rounded-[14px] border border-[#e8e1d6] bg-white shadow-[0_1px_2px_rgba(36,31,26,0.06),0_1px_1px_rgba(36,31,26,0.04)] transition duration-200 hover:-translate-y-1 hover:border-[#ddd4c5] hover:shadow-[0_24px_48px_-16px_rgba(36,31,26,0.22)]">
      <div className="relative aspect-[4/3.1] overflow-hidden bg-[#f0ebe0]">
        {!imageFailed && product.image ? (
          <img
            src={product.image}
            alt={product.title}
            width={product.imageWidth ?? 400}
            height={product.imageHeight ?? 320}
            loading="lazy"
            decoding="async"
            onError={() => setImageFailed(true)}
            className="h-full w-full object-cover transition duration-500 hover:scale-[1.06]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-[linear-gradient(135deg,#efe6da,#ddd4c5)] text-center text-sm font-medium text-[#5c5650]">
            Image unavailable
          </div>
        )}
        <span
          className={`absolute left-2.5 top-2.5 rounded-full px-2.5 py-1 text-[10.5px] font-bold uppercase tracking-[0.03em] text-white ${
            product.inStock ? "bg-[rgba(36,31,26,0.78)]" : "bg-[#a35a3c]"
          }`}
        >
          {product.inStock ? "In stock" : "Sold out"}
        </span>
        <button
          type="button"
          onClick={() => onWishlistToggle(product.id)}
          className={`absolute right-2.5 top-2.5 inline-flex size-[34px] items-center justify-center rounded-full bg-[rgba(255,255,255,0.92)] text-[#241f1a] shadow-[0_1px_2px_rgba(36,31,26,0.06),0_1px_1px_rgba(36,31,26,0.04)] backdrop-blur transition hover:scale-105 ${
            wished ? "text-[#c1602f]" : ""
          }`}
          aria-label={`${wished ? "Remove" : "Add"} ${product.title} ${wished ? "from" : "to"} wishlist`}
        >
          <Icon name="heart" className="size-4" />
        </button>
      </div>

      <div className="flex flex-1 flex-col gap-1.5 p-4">
        <span className="text-[11.5px] font-bold uppercase tracking-[0.05em] text-[#9c4720]">
          <HighlightText text={product.brand} query={query} />
        </span>
        <h3 className="text-[15.5px] font-semibold leading-[1.32] text-[#241f1a]">
          <HighlightText text={product.title} query={query} />
        </h3>
        <p className="mb-1 flex-1 text-[12.5px] leading-[1.45] text-[#5c5650]">
          {product.description}
        </p>
        <div className="flex items-center gap-2.5 text-[12.5px] text-[#5c5650]">
          {product.rating === null ? (
            <span className="inline-flex items-center gap-1 text-[#a39c91]">
              <Icon name="star" className="size-3 text-[#a39c91]" />
              New
            </span>
          ) : (
            <span className="inline-flex items-center gap-1">
              <Icon name="star" className="size-3 text-[#c79a3c]" />
              {product.rating.toFixed(1)}
            </span>
          )}
          <span>&middot;</span>
          <span>{formatCount(product.reviews)} reviews</span>
        </div>
        <div className="mt-1.5 flex items-center justify-between gap-3">
          <span className="font-[Fraunces,Georgia,serif] text-[19px] font-semibold text-[#241f1a]">
            {formatCurrency(product.price)}
          </span>
          <button
            type="button"
            onClick={() => onViewDetails(product)}
            className="rounded-full border-[1.5px] border-[#241f1a] bg-[#241f1a] px-3.5 py-2 text-[12.5px] font-semibold text-white transition hover:border-[#c1602f] hover:bg-[#c1602f]"
            aria-label={`View details for ${product.title}`}
          >
            View details
          </button>
        </div>
      </div>
    </article>
  );
}

export const ProductCard = memo(ProductCardComponent);
