"use client";

import Image from "next/image";
import { useState } from "react";

const BLUR_DATA_URL =
  "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAAIAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAAAAUH/8QAIhAAAgEDBAMBAAAAAAAAAAAAAQIDAAQRBRIhMQYTQVFh/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAZEQACAwEAAAAAAAAAAAAAAAABAgADESH/2gAMAwEAAhEDEA/AL6vGq7iqjIyQf/Z";

type Props = {
  src: string;
  alt: string;
  fill?: boolean;
  sizes?: string;
  className?: string;
};

/**
 * Catalogue cover image that bypasses Next.js image optimization to avoid
 * 400 errors when loading from B2 or when relative paths don't exist.
 * Falls back to first letter when image fails to load.
 */
export function CatalogCoverImage({ src, alt, fill = true, sizes, className }: Props) {
  const [errored, setErrored] = useState(false);

  if (errored) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-foreground/5 text-primary-main/60">
        <span className="text-6xl font-light">{alt.charAt(0)}</span>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill={fill}
      sizes={sizes ?? "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"}
      className={className}
      placeholder="blur"
      blurDataURL={BLUR_DATA_URL}
      loading="lazy"
      unoptimized
      onError={() => setErrored(true)}
    />
  );
}
