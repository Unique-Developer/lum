type Props = { defaultValue?: string };

export function PostsSearchForm({ defaultValue = "" }: Props) {
  return (
    <form action="/posts" method="get" className="mx-auto mt-6 max-w-md">
      <div className="flex gap-2">
        <input
          name="q"
          type="search"
          defaultValue={defaultValue}
          placeholder="Search posts…"
          aria-label="Search posts"
          className="flex-1 rounded-lg border border-foreground/20 bg-background px-4 py-2.5 text-foreground placeholder:text-foreground/50 focus:border-primary-main focus:outline-none focus:ring-1 focus:ring-primary-main"
        />
        <button
          type="submit"
          className="rounded-lg border border-foreground/20 bg-foreground/5 px-4 py-2.5 text-sm font-medium text-foreground hover:bg-foreground/10"
        >
          Search
        </button>
      </div>
    </form>
  );
}
