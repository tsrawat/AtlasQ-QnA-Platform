"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/design-system";
import { SearchIcon, X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React from "react";

const normalizeSearch = (value: string) => value
    .replace(/[\u0000-\u001F\u007F]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 200);

const Search = ({
    popularTags,
    selectedTags,
    resultCount,
}: {
    popularTags: { name: string; count: number }[];
    selectedTags: string[];
    resultCount: number;
}) => {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const router = useRouter();
    const [search, setSearch] = React.useState(searchParams.get("search") || "");
    const [tagSearch, setTagSearch] = React.useState("");

    React.useEffect(() => {
        setSearch(() => searchParams.get("search") || "");
    }, [searchParams]);

    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const newSearchParams = new URLSearchParams(searchParams);
        const normalizedSearch = normalizeSearch(search);
        if (normalizedSearch) newSearchParams.set("search", normalizedSearch);
        else newSearchParams.delete("search");
        newSearchParams.set("page", "1");
        router.push(`${pathname}?${newSearchParams}`);
    };

    const updateTags = (tags: string[]) => {
        const newSearchParams = new URLSearchParams(searchParams);
        newSearchParams.delete("tag");
        tags.forEach(tag => newSearchParams.append("tag", tag));
        newSearchParams.set("page", "1");
        router.replace(`${pathname}?${newSearchParams}`, { scroll: false });
    };

    const suggestions = popularTags
        .filter(tag => !selectedTags.includes(tag.name))
        .filter(tag => tag.name.includes(tagSearch.trim().toLowerCase()))
        .slice(0, 8);

    return (
      <div className="space-y-3">
        <form className="flex w-full flex-nowrap items-center gap-3 rounded-lg border bg-[hsl(var(--panel))] p-3 shadow-sm" onSubmit={handleSearch}>
            <label className="relative min-w-0 flex-1">
                <span className="sr-only">Search questions</span>
                <SearchIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[hsl(var(--muted-2))]" aria-hidden="true" />
                <Input
                    className="pl-10"
                    type="text"
                    placeholder="Search questions..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />
            </label>
            {search && (
                <Button
                    className="shrink-0"
                    type="button"
                    variant="ghost"
                    onClick={() => {
                        setSearch("");
                        const newSearchParams = new URLSearchParams(searchParams);
                        newSearchParams.delete("search");
                        newSearchParams.set("page", "1");
                        router.push(`${pathname}?${newSearchParams}`);
                    }}
                >
                    <X className="size-4" aria-hidden="true" />
                    Clear
                </Button>
            )}
            <Button className="shrink-0" type="submit">Search</Button>
        </form>
        <div className="rounded-lg border bg-[hsl(var(--panel))] p-3 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-2">
                <label className="relative min-w-[12rem] flex-1">
                    <span className="sr-only">Filter tags</span>
                    <Input
                        value={tagSearch}
                        onChange={event => setTagSearch(event.target.value)}
                        placeholder="Find tags..."
                        autoComplete="off"
                    />
                </label>
                <span className="text-sm font-medium text-[hsl(var(--muted))]" aria-live="polite">
                    {resultCount} matching {resultCount === 1 ? "question" : "questions"}
                </span>
            </div>

            {selectedTags.length > 0 && (
                <div className="mt-3 flex flex-wrap items-center gap-2" aria-label="Active tag filters">
                    {selectedTags.map(tag => (
                        <button
                            key={tag}
                            type="button"
                            onClick={() => updateTags(selectedTags.filter(selectedTag => selectedTag !== tag))}
                            className="atlas-focus inline-flex items-center gap-1 rounded-full bg-[hsl(var(--brand)/0.13)] px-2.5 py-1 text-xs font-semibold text-[hsl(var(--brand-strong))]"
                            aria-label={`Remove ${tag} filter`}
                        >
                            #{tag}<X className="size-3" aria-hidden="true" />
                        </button>
                    ))}
                    <Button type="button" variant="ghost" className="h-8 px-2" onClick={() => updateTags([])}>
                        Clear filters
                    </Button>
                </div>
            )}

            {suggestions.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2" aria-label="Tag suggestions">
                    {suggestions.map(tag => (
                        <button
                            key={tag.name}
                            type="button"
                            onClick={() => {
                                updateTags([...selectedTags, tag.name]);
                                setTagSearch("");
                            }}
                            className="atlas-focus inline-flex items-center rounded-full border bg-[hsl(var(--panel-strong))] px-2.5 py-1 text-xs font-semibold text-[hsl(var(--muted))] hover:text-[hsl(var(--foreground))]"
                        >
                            #{tag.name} <span className="ml-1 opacity-70">{tag.count}</span>
                        </button>
                    ))}
                </div>
            )}
        </div>
      </div>
    );
};

export default Search;
