import { databases, users } from "@/models/server/config";
import { answerCollection, db, voteCollection, questionCollection } from "@/models/name";
import { Query } from "node-appwrite";
import React from "react";
import QuestionCard from "@/components/QuestionCard";
import { UserPrefs } from "@/store/Auth";
import Pagination from "@/components/Pagination";
import Search from "./Search";
import { Badge, EmptyState, PageShell, StatCard, Surface } from "@/components/design-system";
import { ArrowUpDown, Filter, Sparkles } from "lucide-react";

const Page = async ({
    searchParams,
}: {
    searchParams: Promise<{ page?: string; tag?: string; search?: string }>;
}) => {
    const resolvedSearchParams = await searchParams;
    const page = resolvedSearchParams.page || "1";

    const queries = [
        Query.orderDesc("$createdAt"),
        Query.offset((+page - 1) * 25),
        Query.limit(25),
    ];

    if (resolvedSearchParams.tag) queries.push(Query.contains("tags", resolvedSearchParams.tag));
    if (resolvedSearchParams.search)
        queries.push(
            Query.or([
                Query.search("title", resolvedSearchParams.search),
                Query.search("content", resolvedSearchParams.search),
            ])
        );

    const questions = await databases.listDocuments(db, questionCollection, queries);
    questions.documents = await Promise.all(
        questions.documents.map(async ques => {
            const [author, answers, votes] = await Promise.all([
                users.get<UserPrefs>(ques.authorId),
                databases.listDocuments(db, answerCollection, [
                    Query.equal("questionId", ques.$id),
                    Query.limit(1), // for optimization
                ]),
                databases.listDocuments(db, voteCollection, [
                    Query.equal("type", "question"),
                    Query.equal("typeId", ques.$id),
                    Query.limit(1), // for optimization
                ]),
            ]);

            return {
                ...ques,
                totalAnswers: answers.total,
                totalVotes: votes.total,
                author: {
                    $id: author.$id,
                    reputation: author.prefs.reputation,
                    name: author.name,
                    avatarId: author.prefs.avatarId,
                    avatarVersion: author.prefs.avatarVersion,
                },
            };
        })
    );

    return (
        <PageShell>
            <div className="mb-8 grid gap-6 lg:grid-cols-[1fr_320px] lg:items-end">
                <div>
                    <Badge tone="brand">Questions</Badge>
                    <h1 className="mt-4 text-3xl font-semibold tracking-tight">All Questions</h1>
                    <p className="mt-3 max-w-2xl text-sm leading-6 text-[hsl(var(--muted))]">
                        Browse questions, search by topic, or filter using tags.
                    </p>
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
                <div className="space-y-5">
                    <Search />
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <p className="text-sm font-medium text-[hsl(var(--muted))]">
                            Showing {questions.documents.length} of {questions.total} questions
                        </p>
                        <div className="flex gap-2">
                            <Badge><Filter className="mr-1 size-3" /> Tag: {resolvedSearchParams.tag || "All"}</Badge>
                            <Badge><ArrowUpDown className="mr-1 size-3" /> Newest</Badge>
                        </div>
                    </div>
                    {questions.documents.length > 0 ? (
                        <div className="space-y-4">
                            {questions.documents.map(ques => (
                                <QuestionCard key={ques.$id} ques={ques} />
                            ))}
                        </div>
                    ) : (
                        <EmptyState
                            title="No matching questions yet"
                            description="Try a broader search, remove the tag filter, or capture the first answer-worthy question for this topic."
                            actionHref="/questions/ask"
                            actionLabel="Ask the first question"
                        />
                    )}
                    <Pagination total={questions.total} limit={25} />
                </div>

                <aside className="space-y-4">
                    <Surface>
                        <div className="flex items-center gap-2">
                            <Sparkles className="size-4 text-[hsl(var(--brand))]" aria-hidden="true" />
                            <h2 className="font-semibold">Posting tip</h2>
                        </div>
                        <p className="mt-3 text-sm leading-6 text-[hsl(var(--muted))]">
                            Good questions include a clear title, useful details, relevant tags, and an image when it helps explain the issue.
                        </p>
                    </Surface>
                    <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
                        <StatCard label="Questions" value={questions.total} detail="Total matching records" />
                        <StatCard label="Page size" value="25" detail="Optimized for scanning" />
                        <StatCard label="Sort" value="New" detail="Fresh issues first" />
                    </div>
                </aside>
            </div>
        </PageShell>
    );
};

export default Page;
