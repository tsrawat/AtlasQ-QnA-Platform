import Pagination from "@/components/Pagination";
import { MarkdownPreview } from "@/components/RTE";
import { answerCollection, db, questionCollection } from "@/models/name";
import { databases } from "@/models/server/config";
import slugify from "@/utils/slugify";
import Link from "next/link";
import { Query } from "node-appwrite";
import React from "react";

const Page = async ({
    params,
    searchParams,
}: {
    params: Promise<{ userId: string; userSlug: string }>;
    searchParams: Promise<{ page?: string }>;
}) => {
    const [{ userId }, resolvedSearchParams] = await Promise.all([params, searchParams]);
    const page = resolvedSearchParams.page || "1";

    const queries = [
        Query.equal("authorId", userId),
        Query.orderDesc("$createdAt"),
        Query.offset((+page - 1) * 25),
        Query.limit(25),
    ];

    const answers = await databases.listDocuments(db, answerCollection, queries);

    answers.documents = await Promise.all(
        answers.documents.map(async ans => {
            const question = await databases.getDocument(db, questionCollection, ans.questionId, [
                Query.select(["title"]),
            ]);
            return { ...ans, question };
        })
    );

    return (
        <div className="space-y-5">
            <div>
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[hsl(var(--brand))]">Contributions</p>
                <h1 className="mt-2 text-2xl font-semibold tracking-tight">{answers.total} answers</h1>
            </div>
            <div className="max-w-3xl space-y-4">
                {answers.documents.map(ans => (
                    <article key={ans.$id} className="rounded-xl border bg-[hsl(var(--panel)/0.9)] p-5 shadow-sm">
                        <div className="max-h-40 overflow-auto rounded-lg bg-[hsl(var(--panel-strong)/0.45)]">
                            <MarkdownPreview source={ans.content} className="markdown-content p-4" />
                        </div>
                        <Link
                            href={`/questions/${ans.questionId}/${slugify(ans.question.title)}`}
                            className="atlas-focus mt-4 inline-flex shrink-0 rounded-[10px] bg-[hsl(var(--brand))] px-4 py-2 text-sm font-semibold text-[hsl(var(--button-text))] transition duration-200 hover:bg-[hsl(var(--brand-hover))]"
                        >
                            View question
                        </Link>
                    </article>
                ))}
            </div>
            <Pagination total={answers.total} limit={25} />
        </div>
    );
};

export default Page;
