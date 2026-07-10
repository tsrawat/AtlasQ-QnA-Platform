"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React from "react";
import { Button } from "./design-system";

const Pagination = ({
    className,
    total,
    limit,
}: {
    className?: string;
    limit: number;
    total: number;
}) => {
    const searchParams = useSearchParams();
    const page = searchParams.get("page") || "1";
    const totalPages = Math.ceil(total / limit);
    const router = useRouter();
    const pathname = usePathname();

    const prev = () => {
        if (page <= "1") return;
        const pageNumber = parseInt(page);
        const newSearchParams = new URLSearchParams(searchParams);
        newSearchParams.set("page", `${pageNumber - 1}`);
        router.push(`${pathname}?${newSearchParams}`);
    };

    const next = () => {
        if (page >= `${totalPages}`) return;
        const pageNumber = parseInt(page);
        const newSearchParams = new URLSearchParams(searchParams);
        newSearchParams.set("page", `${pageNumber + 1}`);
        router.push(`${pathname}?${newSearchParams}`);
    };

    return (
        <div className="flex items-center justify-center gap-4 pt-4">
            <Button
                className={className}
                variant="secondary"
                onClick={prev}
                disabled={page <= "1"}
            >
                Previous
            </Button>
            <span className="text-sm font-medium text-[hsl(var(--muted))]">
                {page} of {totalPages || "1"} {/* incase totalPage is 0 */}
            </span>
            <Button
                className={className}
                variant="secondary"
                onClick={next}
                disabled={page >= `${totalPages}`}
            >
                Next
            </Button>
        </div>
    );
};

export default Pagination;
