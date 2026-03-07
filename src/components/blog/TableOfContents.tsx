"use client";

import { useEffect, useState } from "react";

type Heading = { id: string; text: string; level: number };

export function TableOfContents({ headings }: { headings: Heading[] }) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActiveId(e.target.id);
        }
      },
      { rootMargin: "-80px 0px -80% 0px" }
    );

    for (const h of headings) {
      const el = document.getElementById(h.id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [headings]);

  return (
    <nav className="sticky top-24 hidden lg:block" aria-label="Table of contents">
      <p className="mb-4 text-sm font-semibold uppercase tracking-wider text-foreground/50">
        On this page
      </p>
      <ul className="space-y-2 border-l border-foreground/20 pl-4">
        {headings.map((h) => (
          <li
            key={h.id}
            style={{ paddingLeft: (h.level - 2) * 12 }}
            className={activeId === h.id ? "border-l-2 border-primary-main -ml-[17px] pl-[13px]" : ""}
          >
            <a
              href={`#${h.id}`}
              className={`block text-sm transition-colors hover:text-primary-main ${
                activeId === h.id ? "text-primary-main font-medium" : "text-foreground/70"
              }`}
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
