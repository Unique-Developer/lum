"use client";

type Heading = { id: string; text: string; level: number };

function addIdsToHeadings(html: string, headings: Heading[]): string {
  let i = 0;
  return html.replace(/<h([2-3])([^>]*)>([^<]+)<\/h\1>/gi, (_match, level: string, attrs: string, text: string) => {
    const id = headings[i]?.id ?? `heading-${i}`;
    i++;
    return `<h${level} id="${id}"${attrs}>${text}</h${level}>`;
  });
}

export function BlogContent({ html, headings }: { html: string; headings: Heading[] }) {
  const content = addIdsToHeadings(html, headings);

  return (
    <article
      className="blog-content prose prose-lg max-w-none text-foreground/90 [&_h2]:mt-12 [&_h2]:scroll-mt-24 [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:tracking-tight [&_h3]:mt-8 [&_h3]:scroll-mt-24 [&_h3]:text-xl [&_h3]:font-semibold [&_p]:mt-4 [&_p]:leading-[1.75] [&_ul]:mt-4 [&_ul]:list-disc [&_ul]:pl-6 [&_li]:mt-2 [&_a]:text-primary-main [&_a]:underline [&_a:hover]:no-underline [&_img]:mt-6 [&_img]:max-w-full [&_img]:h-auto [&_img]:rounded-xl [&_img]:shadow-md [&_blockquote]:border-l-4 [&_blockquote]:border-primary-200 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-foreground/80"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}
