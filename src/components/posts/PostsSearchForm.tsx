type Props = {
  defaultValue?: string;
  defaultCategory?: string;
  categories?: { id: string; name: string }[];
};

export function PostsSearchForm({
  defaultValue = "",
  defaultCategory = "",
  categories = [],
}: Props) {
  return (
    <form action="/posts" method="get" className="mx-auto mt-6 max-w-md">
      <div className="flex flex-col gap-2">
        <input
          name="q"
          type="search"
          defaultValue={defaultValue}
          placeholder="Search posts…"
          aria-label="Search posts"
          className="flex-1 rounded-lg border border-foreground/20 bg-background px-4 py-2.5 text-foreground placeholder:text-foreground/50 focus:border-primary-main focus:outline-none focus:ring-1 focus:ring-primary-main"
        />
        <div className="flex gap-2">
          <select
            name="cat"
            defaultValue={defaultCategory}
            aria-label="Filter by category"
            className="flex-1 rounded-lg border border-foreground/20 bg-background px-4 py-2.5 text-sm text-foreground focus:border-primary-main focus:outline-none focus:ring-1 focus:ring-primary-main"
          >
            <option value="">All categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="rounded-lg border border-foreground/20 bg-foreground/5 px-4 py-2.5 text-sm font-medium text-foreground hover:bg-foreground/10"
          >
            Filter
          </button>
        </div>
      </div>
    </form>
  );
}
