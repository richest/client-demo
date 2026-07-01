import { Icon } from "@/components/Icons";

export function EmptyState({
  title,
  description,
  actionLabel,
  onAction
}: {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <div className="col-span-full px-5 py-[70px] text-center text-[#5c5650]">
      <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-[rgba(193,96,47,0.12)] text-[#c1602f]">
        <Icon name="sparkles" className="size-6" />
      </div>
      <h3 className="font-[Fraunces,Georgia,serif] text-[19px] font-semibold text-[#241f1a]">
        {title}
      </h3>
      <p className="mx-auto mt-2 max-w-[360px] text-sm leading-6">{description}</p>
      {actionLabel && onAction ? (
        <button
          type="button"
          onClick={onAction}
          className="mt-5 rounded-full border border-[#241f1a] px-[18px] py-[9px] text-[13.5px] font-semibold text-[#241f1a] transition hover:bg-[#241f1a] hover:text-white"
        >
          {actionLabel}
        </button>
      ) : null}
    </div>
  );
}
