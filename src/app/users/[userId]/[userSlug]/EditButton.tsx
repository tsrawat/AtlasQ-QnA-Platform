"use client";

import { useAuthStore } from "@/store/Auth";
import Link from "next/link";
import { useParams } from "next/navigation";
import React from "react";

const EditButton = () => {
    const { userId, userSlug } = useParams();
    const { user } = useAuthStore();

    if (user?.$id !== userId) return null;

    return (
        <Link
            href={`/users/${userId}/${userSlug}/edit`}
            className="atlas-focus inline-flex h-10 items-center rounded-md border bg-[hsl(var(--panel))] px-4 text-sm font-medium text-[hsl(var(--foreground))] transition hover:-translate-y-0.5 hover:bg-[hsl(var(--panel-strong))]"
        >
            <span>Edit</span>
        </Link>
    );
};

export default EditButton;
