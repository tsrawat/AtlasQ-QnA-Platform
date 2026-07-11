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
import { unstable_cache } from "next/cache";

type QuestionSearchParams = {
    page?: string | string[];
    tag?: string | string[];
    search?: string | string[];
};

const sanitizeSearchParam = (value: string | string[] | undefined, maxLength: number) => {
    if (typeof value !== "string") return "";

    return value
        .replace(/[\u0000-\u001F\u007F]/g, " ")
        .replace(/\s+/g, " ")
        .trim()
        .slice(0, maxLength);
};

const getPopularTags = unstable_cache(async () => {
    const frequencies = new Map<string, number>();
    let offset = 0;
    const limit = 500;

    while (true) {
        const result = await databases.listDocuments(db, questionCollection, [
            Query.select(["tags"]),
            Query.limit(limit),
            Query.offset(offset),
        ]);

        result.documents.forEach(question => {
            if (!Array.isArray(question.tags)) return;
            question.tags.forEach((value: unknown) => {
                if (typeof value !== "string") return;
                const tag = value.trim().toLowerCase();
                if (tag) frequencies.set(tag, (frequencies.get(tag) || 0) + 1);
            });
        });

        offset += result.documents.length;
        if (offset >= result.total || result.documents.length === 0) break;
    }

    return Array.from(frequencies, ([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}, ["question-tag-frequencies"], { revalidate: 300 });

const Page = async ({
    searchParams,
}: {
    searchParams: Promise<QuestionSearchParams>;
}) => {
    const resolvedSearchParams = await searchParams;
    const rawPage = typeof resolvedSearchParams.page === "string" ? resolvedSearchParams.page : "";
    const page = /^[1-9]\d{0,6}$/.test(rawPage) ? Number(rawPage) : 1;
    const selectedTags = (Array.isArray(resolvedSearchParams.tag)
        ? resolvedSearchParams.tag
        : resolvedSearchParams.tag ? [resolvedSearchParams.tag] : [])
        .map(value => sanitizeSearchParam(value, 50).toLowerCase())
        .filter((value, index, values) => value && values.indexOf(value) === index)
        .slice(0, 10);
    const search = sanitizeSearchParam(resolvedSearchParams.search, 200);
    let popularTags: { name: string; count: number }[] = [];
    let questions: Awaited<ReturnType<typeof databases.listDocuments>> = {
        total: 0,
        documents: [],
    };

    try {
        const queries = [
            Query.orderDesc("$createdAt"),
            Query.offset((page - 1) * 25),
            Query.limit(25),
        ];

        selectedTags.forEach(selectedTag => queries.push(Query.contains("tags", selectedTag)));
        if (search) {
            queries.push(
                Query.or([
                    Query.search("title", search),
                    Query.search("content", search),
                    Query.contains("tags", search.toLowerCase()),
                ])
            );
        }

        questions = await databases.listDocuments(db, questionCollection, queries);
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
    } catch (error) {
        console.error("Unable to load question search results", error);
        questions = { total: 0, documents: [] };
    }

    try {
        popularTags = await getPopularTags();
    } catch (error) {
        console.error("Unable to load tag suggestions", error);
    }

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
                    <Search popularTags={popularTags} selectedTags={selectedTags} resultCount={questions.total} />
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <p className="text-sm font-medium text-[hsl(var(--muted))]">
                            Showing {questions.documents.length} of {questions.total} questions
                        </p>
                        <div className="flex gap-2">
                            <Badge><Filter className="mr-1 size-3" /> Tags: {selectedTags.length ? selectedTags.join(", ") : "All"}</Badge>
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
