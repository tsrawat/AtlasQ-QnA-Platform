"use client";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import React from "react";
import { cn } from "@/lib/utils";

const Navbar = () => {
    const { userId, userSlug } = useParams();
    const pathname = usePathname();

    const items = [
        {
            name: "Summary",
            href: `/users/${userId}/${userSlug}`,
        },
        {
            name: "Questions",
            href: `/users/${userId}/${userSlug}/questions`,
        },
        {
            name: "Answers",
            href: `/users/${userId}/${userSlug}/answers`,
        },
        {
            name: "Votes",
            href: `/users/${userId}/${userSlug}/votes`,
        },
    ];

    return (
        <ul className="flex w-full shrink-0 gap-1 overflow-auto rounded-lg border bg-[hsl(var(--panel))] p-1 sm:w-44 sm:flex-col">
            {items.map(item => (
                <li key={item.name}>
                    <Link
                        href={item.href}
                        className={cn(
                            "atlas-focus block w-full rounded-md px-3 py-2 text-sm font-medium text-[hsl(var(--muted))] transition hover:bg-[hsl(var(--panel-strong))] hover:text-[hsl(var(--foreground))]",
                            pathname === item.href && "bg-[hsl(var(--brand))] text-[hsl(var(--button-text))] hover:bg-[hsl(var(--brand))] hover:text-[hsl(var(--button-text))]"
                        )}
                    >
                        {item.name}
                    </Link>
                </li>
            ))}
        </ul>
    );
};

export default Navbar;
