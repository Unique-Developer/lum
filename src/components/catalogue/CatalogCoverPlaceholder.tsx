import React from "react";

function hashString(input: string) {
  // Tiny deterministic hash for picking a visual variant.
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = (hash * 31 + input.charCodeAt(i)) >>> 0;
  }
  return hash;
}

function FixtureIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M12 3.5c2.8 0 5.1 2.3 5.1 5.1 0 1.7-.8 3.2-2.1 4.1v2.1c0 .6-.4 1-1 1H10.9c-.6 0-1-.4-1-1v-2.1c-1.3-.9-2.1-2.4-2.1-4.1 0-2.8 2.3-5.1 5.2-5.1Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path
        d="M9.2 19.3c.9-.8 1.9-1.2 2.8-1.2s1.9.4 2.8 1.2"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <path
        d="M8.2 20.7h7.6"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function CatalogCoverPlaceholder({
  label,
  className,
}: {
  label: string;
  className?: string;
}) {
  const initial = (label?.trim()?.charAt(0) ?? "L").toUpperCase();
  const upper = label?.toUpperCase?.() ?? "";
  const badge = upper.includes("COB") ? "COB" : "";
  const variant = hashString(label ?? initial) % 4;

  const variantStyles = [
    {
      bg: "from-primary-100 to-primary-200",
      glow: "bg-primary-300/25",
      grid: "rgba(17,79,117,0.20)",
      accent: "text-primary-700",
    },
    {
      bg: "from-primary-50 to-primary-300",
      glow: "bg-primary-500/20",
      grid: "rgba(58,163,210,0.22)",
      accent: "text-primary-600",
    },
    {
      bg: "from-primary-200 to-primary-100",
      glow: "bg-primary-700/20",
      grid: "rgba(29,140,193,0.18)",
      accent: "text-primary-800",
    },
    {
      bg: "from-primary-100 to-primary-50",
      glow: "bg-primary-200/25",
      grid: "rgba(17,79,117,0.18)",
      accent: "text-primary-main",
    },
  ][variant];

  return (
    <div
      className={`relative h-full w-full overflow-hidden ${className ?? ""}`}
      aria-label={label ? `${label} cover placeholder` : "Cover placeholder"}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${variantStyles.bg}`} />
      <div
        className="absolute inset-0 opacity-50"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(0,0,0,0.0) 0%, rgba(0,0,0,0.0) 48%, rgba(255,255,255,0.22) 50%, rgba(0,0,0,0.0) 52%, rgba(0,0,0,0.0) 100%)",
          transform: "skewX(-18deg)",
        }}
      />
      <div
        className="absolute inset-0 opacity-45"
        style={{
          backgroundImage: `linear-gradient(to right, ${variantStyles.grid} 1px, transparent 1px), linear-gradient(to bottom, ${variantStyles.grid} 1px, transparent 1px)`,
          backgroundSize: "22px 22px",
        }}
      />
      <div className={`absolute -left-16 -top-16 h-56 w-56 rounded-full blur-2xl ${variantStyles.glow}`} />
      <div className={`absolute -bottom-16 -right-16 h-56 w-56 rounded-full blur-2xl ${variantStyles.glow}`} />

      <div className="relative z-10 flex h-full w-full items-center justify-center p-5">
        <div className="relative w-full">
          {badge ? (
            <div className="absolute right-0 top-0 rounded-full border border-primary-main/20 bg-white/70 px-3 py-1 backdrop-blur">
              <span className="text-xs font-semibold tracking-[0.16em] text-primary-main/90">
                {badge}
              </span>
            </div>
          ) : null}
          <div className="absolute left-0 top-0 text-primary-main/80">
            <FixtureIcon className={`h-10 w-10 ${variantStyles.accent}`} />
          </div>

          <div className="flex items-center justify-center">
            <span
              className={[
                "select-none text-7xl font-light tracking-tight",
                "text-transparent bg-clip-text bg-gradient-to-br from-primary-main to-primary-700/80",
              ].join(" ")}
            >
              {initial}
            </span>
          </div>

          <div className="absolute bottom-0 left-0 right-0 h-px w-full bg-primary-main/20" />
        </div>
      </div>
    </div>
  );
}

