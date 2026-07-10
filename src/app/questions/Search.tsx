"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/design-system";
import { SearchIcon, X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React from "react";

const Search = () => {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const router = useRouter();
    const [search, setSearch] = React.useState(searchParams.get("search") || "");

    React.useEffect(() => {
        setSearch(() => searchParams.get("search") || "");
    }, [searchParams]);

    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const newSearchParams = new URLSearchParams(searchParams);
        if (search.trim()) newSearchParams.set("search", search.trim());
        else newSearchParams.delete("search");
        newSearchParams.set("page", "1");
        router.push(`${pathname}?${newSearchParams}`);
    };

    return (
        <form className="flex w-full flex-col gap-3 rounded-lg border bg-[hsl(var(--panel))] p-3 shadow-sm sm:flex-row" onSubmit={handleSearch}>
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
                    type="button"
                    variant="ghost"
                    onClick={() => {
                        setSearch("");
                        const newSearchParams = new URLSearchParams(searchParams);
                        newSearchParams.delete("search");
                        router.push(`${pathname}?${newSearchParams}`);
                    }}
                >
                    <X className="size-4" aria-hidden="true" />
                    Clear
                </Button>
            )}
            <Button className="shrink-0" type="submit">Search</Button>
        </form>
    );
};

export default Search;
