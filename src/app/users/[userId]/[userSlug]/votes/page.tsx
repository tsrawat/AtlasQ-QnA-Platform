import Pagination from "@/components/Pagination";
import { answerCollection, db, questionCollection, voteCollection } from "@/models/name";
import { databases } from "@/models/server/config";
import convertDateToRelativeTime from "@/utils/relativeTime";
import slugify from "@/utils/slugify";
import Link from "next/link";
import { Query } from "node-appwrite";
import React from "react";

const Page = async ({
    params,
    searchParams,
}: {
    params: Promise<{ userId: string; userSlug: string }>;
    searchParams: Promise<{ page?: string; voteStatus?: "upvoted" | "downvoted" }>;
}) => {
    const [{ userId, userSlug }, resolvedSearchParams] = await Promise.all([params, searchParams]);
    const page = resolvedSearchParams.page || "1";

    const query = [
        Query.equal("votedById", userId),
        Query.orderDesc("$createdAt"),
        Query.offset((+page - 1) * 25),
        Query.limit(25),
    ];

    if (resolvedSearchParams.voteStatus) query.push(Query.equal("voteStatus", resolvedSearchParams.voteStatus));

    const votes = await databases.listDocuments(db, voteCollection, query);

    votes.documents = await Promise.all(
        votes.documents.map(async vote => {
            const questionOfTypeQuestion =
                vote.type === "question"
                    ? await databases.getDocument(db, questionCollection, vote.typeId, [
                          Query.select(["title"]),
                      ])
                    : null;

            if (questionOfTypeQuestion) {
                return {
                    ...vote,
                    question: questionOfTypeQuestion,
                };
            }

            const answer = await databases.getDocument(db, answerCollection, vote.typeId);
            const questionOfTypeAnswer = await databases.getDocument(
                db,
                questionCollection,
                answer.questionId,
                [Query.select(["title"])]
            );

            return {
                ...vote,
                question: questionOfTypeAnswer,
            };
        })
    );

    return (
        <div className="px-4">
            <div className="mb-4 flex justify-between">
                <p>{votes.total} votes</p>
                <ul className="flex gap-1">
                    <li>
                        <Link
                            href={`/users/${userId}/${userSlug}/votes`}
                            className={`block w-full rounded-full px-3 py-0.5 duration-200 ${
                                !resolvedSearchParams.voteStatus ? "bg-[hsl(var(--accent)/0.28)]" : "hover:bg-[hsl(var(--panel-strong))]"
                            }`}
                        >
                            All
                        </Link>
                    </li>
                    <li>
                        <Link
                            href={`/users/${userId}/${userSlug}/votes?voteStatus=upvoted`}
                            className={`block w-full rounded-full px-3 py-0.5 duration-200 ${
                                resolvedSearchParams?.voteStatus === "upvoted"
                                    ? "bg-[hsl(var(--accent)/0.28)]"
                                    : "hover:bg-[hsl(var(--panel-strong))]"
                            }`}
                        >
                            Upvotes
                        </Link>
                    </li>
                    <li>
                        <Link
                            href={`/users/${userId}/${userSlug}/votes?voteStatus=downvoted`}
                            className={`block w-full rounded-full px-3 py-0.5 duration-200 ${
                                resolvedSearchParams?.voteStatus === "downvoted"
                                    ? "bg-[hsl(var(--accent)/0.28)]"
                                    : "hover:bg-[hsl(var(--panel-strong))]"
                            }`}
                        >
                            Downvotes
                        </Link>
                    </li>
                </ul>
            </div>
            <div className="mb-4 max-w-3xl space-y-6">
                {votes.documents.map(vote => (
                    <div
                        key={vote.$id}
                        className="rounded-xl border border-[hsl(var(--border)/0.65)] bg-[hsl(var(--panel)/0.72)] p-4 duration-200 hover:bg-[hsl(var(--panel-strong))]"
                    >
                        <div className="flex">
                            <p className="mr-4 shrink-0">{vote.voteStatus}</p>
                            <p>
                                <Link
                                    href={`/questions/${vote.question.$id}/${slugify(vote.question.title)}`}
                                    className="text-orange-500 hover:text-orange-600"
                                >
                                    {vote.question.title}
                                </Link>
                            </p>
                        </div>
                        <p className="text-right text-sm">
                            {convertDateToRelativeTime(new Date(vote.$createdAt))}
                        </p>
                    </div>
                ))}
            </div>
            <Pagination total={votes.total} limit={25} />
        </div>
    );
};

export default Page;
