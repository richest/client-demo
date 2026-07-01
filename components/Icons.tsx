import type { ReactNode } from "react";

export type IconName =
  | "arrow-down"
  | "bath"
  | "box"
  | "briefcase"
  | "chair"
  | "check"
  | "close"
  | "clock"
  | "filter"
  | "frame"
  | "heart"
  | "house"
  | "lamp"
  | "leaf"
  | "search"
  | "sparkles"
  | "star"
  | "textiles"
  | "utensils";

const paths: Record<IconName, ReactNode> = {
  "arrow-down": <path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />,
  bath: (
    <>
      <path d="M4 13h16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M6 13v1.5A2.5 2.5 0 0 0 8.5 17h7A2.5 2.5 0 0 0 18 14.5V13" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M8 13V8.5A2.5 2.5 0 0 1 10.5 6H12a2 2 0 0 1 2 2v5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </>
  ),
  box: (
    <>
      <path d="M4 8.5 12 4l8 4.5-8 4.5-8-4.5Z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M4 8.5V16l8 4 8-4V8.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M12 13v7" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </>
  ),
  briefcase: (
    <>
      <rect x="4" y="7" width="16" height="11" rx="2" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path d="M9 7V5.8A1.8 1.8 0 0 1 10.8 4h2.4A1.8 1.8 0 0 1 15 5.8V7" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path d="M4 11h16" fill="none" stroke="currentColor" strokeWidth="1.8" />
    </>
  ),
  chair: (
    <>
      <path d="M8 11V7.5A2.5 2.5 0 0 1 10.5 5h3A2.5 2.5 0 0 1 16 7.5V11" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path d="M6 11h12v4H6z" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path d="M8 15v4M16 15v4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </>
  ),
  check: <path d="m5 12 4 4L19 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />,
  close: <path d="M6 6l12 12M18 6 6 18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />,
  clock: (
    <>
      <circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path d="M12 8v4l3 2" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </>
  ),
  filter: (
    <>
      <path d="M4 6h16M7 12h10M10 18h4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </>
  ),
  frame: (
    <>
      <rect x="5" y="5" width="14" height="14" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path d="m8 15 3-3 2 2 3-4 2 5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  heart: <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z" fill="currentColor" />,
  house: (
    <>
      <path d="m4 11 8-6 8 6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7 10.5V19h10v-8.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    </>
  ),
  lamp: (
    <>
      <path d="M8 9h8l-1.5 5h-5z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M12 14v4M9 19h6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </>
  ),
  leaf: <path d="M18 5c-7 1-11 5-12 14 9-1 13-5 14-12a2 2 0 0 0-2-2Z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />,
  search: (
    <>
      <circle cx="11" cy="11" r="6" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path d="m16 16 4 4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </>
  ),
  sparkles: (
    <>
      <path d="m12 4 1.4 3.6L17 9l-3.6 1.4L12 14l-1.4-3.6L7 9l3.6-1.4L12 4Z" fill="currentColor" />
      <path d="m18 3 .7 1.8L20.5 5.5l-1.8.7L18 8l-.7-1.8-1.8-.7 1.8-.7L18 3Z" fill="currentColor" />
    </>
  ),
  star: <path d="m12 4 2.3 4.7 5.2.8-3.8 3.7.9 5.3L12 16l-4.6 2.5.9-5.3-3.8-3.7 5.2-.8L12 4Z" fill="currentColor" />,
  textiles: (
    <>
      <path d="M5 8h14v8H5z" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path d="M8 8V6M12 8V5M16 8V6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </>
  ),
  utensils: (
    <>
      <path d="M8 4v8M6 4v4M10 4v4M8 12v8" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M15 4v7c0 1.1.9 2 2 2v7" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </>
  )
};

export function Icon({
  name,
  className
}: {
  name: IconName;
  className?: string;
}) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {paths[name]}
    </svg>
  );
}
