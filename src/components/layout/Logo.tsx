"use client";

import Image from "next/image";
import Link from "next/link";

type LogoProps = {
  href?: string;
  className?: string;
  height?: number;
  width?: number;
  priority?: boolean;
};

const defaultWidth = 140;
const defaultHeight = 44;

export function Logo({
  href = "/",
  className = "",
  height = defaultHeight,
  width = defaultWidth,
  priority = false,
}: LogoProps) {
  const img = (
    <Image
      src="/logo.png"
      alt="Lumin Art"
      width={width}
      height={height}
      className={`object-contain object-left ${className}`}
      priority={priority}
    />
  );

  if (href) {
    return (
      <Link
        href={href}
        className="block transition-opacity hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-main focus-visible:ring-offset-2 rounded"
      >
        {img}
      </Link>
    );
  }

  return img;
}
