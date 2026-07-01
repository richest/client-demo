import { Icon } from "@/components/Icons";

export function Hero({ totalProducts }: { totalProducts: number }) {
  return (
    <section className="mx-auto max-w-7xl px-7 pb-9 pt-16 text-center max-[900px]:px-5 max-[900px]:pb-7 max-[900px]:pt-11">
      <span className="mb-5 inline-flex items-center gap-2 rounded-full bg-[rgba(193,96,47,0.1)] px-3.5 py-1.5 text-[12.5px] font-semibold tracking-[0.01em] text-[#9c4720]">
        <Icon name="sparkles" className="size-3.5" />
        {totalProducts.toLocaleString()}+ pieces, made to order
      </span>
      <h1 className="font-[Fraunces,Georgia,serif] text-[clamp(34px,5vw,54px)] font-semibold leading-[1.06] tracking-[-0.02em]">
        Find the <em className="text-[#c1602f]">perfect</em> home products
      </h1>
      {/* <p className="mx-auto mt-4 max-w-[520px] text-[17px] leading-[1.55] text-[#5c5650]">
        Search across every title, brand, and category in our catalog. Results update as you type,
        with helpful suggestions and filters that stay out of your way.
      </p> */}
    </section>
  );
}
