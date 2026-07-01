export function LoadingSkeleton({ count = 8 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="overflow-hidden rounded-[14px] border border-[#e8e1d6] bg-white"
          aria-hidden="true"
        >
          <div className="aspect-[4/3.1] animate-pulse bg-[linear-gradient(90deg,#ece6da_25%,#f4efe4_37%,#ece6da_63%)] [background-size:400%_100%]" />
          <div className="mx-4 mt-4 h-[11px] w-[60%] animate-pulse rounded bg-[linear-gradient(90deg,#ece6da_25%,#f4efe4_37%,#ece6da_63%)] [background-size:400%_100%]" />
          <div className="mx-4 mt-3 h-[11px] w-[40%] animate-pulse rounded bg-[linear-gradient(90deg,#ece6da_25%,#f4efe4_37%,#ece6da_63%)] [background-size:400%_100%]" />
          <div className="mx-4 mb-6 mt-3 h-[11px] w-[80%] animate-pulse rounded bg-[linear-gradient(90deg,#ece6da_25%,#f4efe4_37%,#ece6da_63%)] [background-size:400%_100%]" />
        </div>
      ))}
    </>
  );
}
