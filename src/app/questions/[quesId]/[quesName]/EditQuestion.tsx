"use client";

import { useAuthStore } from "@/store/Auth";
import slugify from "@/utils/slugify";
import { IconEdit } from "@tabler/icons-react";
import Link from "next/link";
import React from "react";

const EditQuestion = ({
    questionId,
    questionTitle,
    authorId,
}: {
    questionId: string;
    questionTitle: string;
    authorId: string;
}) => {
    const { user } = useAuthStore();

    return user?.$id === authorId ? (
        <Link
            href={`/questions/${questionId}/${slugify(questionTitle)}/edit`}
            className="atlas-focus flex h-10 w-10 items-center justify-center rounded-md border bg-[hsl(var(--panel))] p-1 text-[hsl(var(--muted))] transition hover:-translate-y-0.5 hover:bg-[hsl(var(--panel-strong))] hover:text-[hsl(var(--foreground))]"
            aria-label="Edit question"
        >
            <IconEdit className="h-4 w-4" />
        </Link>
    ) : null;
};

export default EditQuestion;
