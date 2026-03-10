"use client";

/**
 * Renders post content as a caption (e.g. for Instagram-style posts).
 * Simpler typography than BlogContent — no heading hierarchy, just readable prose.
 */
export function SocialPostContent({ html }: { html: string }) {
  return (
    <div
      className="social-caption prose prose-sm max-w-none text-foreground/90 [&_a]:text-primary-main [&_a]:underline [&_a:hover]:no-underline [&_img]:max-w-full [&_img]:rounded-lg [&_img]:object-contain [&_img]:object-center [&_p]:leading-relaxed [&_p]:first:mt-0 [&_ul]:list-disc [&_ul]:pl-5"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
