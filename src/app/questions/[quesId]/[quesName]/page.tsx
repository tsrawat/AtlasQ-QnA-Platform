import Answers from "@/components/Answers";
import { MarkdownPreview } from "@/components/RTE";
import VoteButtons from "@/components/VoteButtons";
import {
    answerCollection,
    db,
    voteCollection,
    questionCollection,
    questionAttachmentBucket,
} from "@/models/name";
import { databases, users } from "@/models/server/config";
import { storage } from "@/models/client/config";
import { UserPrefs } from "@/store/Auth";
import convertDateToRelativeTime from "@/utils/relativeTime";
import slugify from "@/utils/slugify";
import Link from "next/link";
import { Query } from "node-appwrite";
import React from "react";
import DeleteQuestion from "./DeleteQuestion";
import EditQuestion from "./EditQuestion";
import { Badge, LinkButton, PageShell, StatCard, Surface } from "@/components/design-system";
import { ArrowLeft, MessageSquare, Triangle } from "lucide-react";
import { calculateReputation } from "@/lib/reputation";
import UserAvatar from "@/components/UserAvatar";
import VoteCount from "@/components/VoteCount";

const Page = async ({ params }: { params: Promise<{ quesId: string; quesName: string }> }) => {
    const { quesId } = await params;
    const [question, answers, upvotes, downvotes] = await Promise.all([
        databases.getDocument(db, questionCollection, quesId),
        databases.listDocuments(db, answerCollection, [
            Query.orderDesc("$createdAt"),
            Query.equal("questionId", quesId),
        ]),
        databases.listDocuments(db, voteCollection, [
            Query.equal("typeId", quesId),
            Query.equal("type", "question"),
            Query.equal("voteStatus", "upvoted"),
            Query.limit(1), // for optimization
        ]),
        databases.listDocuments(db, voteCollection, [
            Query.equal("typeId", quesId),
            Query.equal("type", "question"),
            Query.equal("voteStatus", "downvoted"),
            Query.limit(1), // for optimization
        ]),
    ]);

    // since it is dependent on the question, we fetch it here outside of the Promise.all
    const [author, authorReputation] = await Promise.all([
        users.get<UserPrefs>(question.authorId),
        calculateReputation(question.authorId),
    ]);
    answers.documents = await Promise.all(
        answers.documents.map(async answer => {
                const [author, reputation, upvotes, downvotes] = await Promise.all([
                    users.get<UserPrefs>(answer.authorId),
                    calculateReputation(answer.authorId),
                    databases.listDocuments(db, voteCollection, [
                        Query.equal("typeId", answer.$id),
                        Query.equal("type", "answer"),
                        Query.equal("voteStatus", "upvoted"),
                        Query.limit(1), // for optimization
                    ]),
                    databases.listDocuments(db, voteCollection, [
                        Query.equal("typeId", answer.$id),
                        Query.equal("type", "answer"),
                        Query.equal("voteStatus", "downvoted"),
                        Query.limit(1), // for optimization
                    ]),
                ]);

                return {
                    ...answer,
                    upvotesDocuments: upvotes,
                    downvotesDocuments: downvotes,
                    author: {
                        $id: author.$id,
                        name: author.name,
                        reputation,
                        avatarId: author.prefs.avatarId,
                        avatarVersion: author.prefs.avatarVersion,
                    },
                };
            })
    );

    return (
        <PageShell>
            <div className="grid min-w-0 gap-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-8">
                <div className="min-w-0">
                    <div className="mb-5 flex min-w-0 flex-col gap-3 sm:mb-6 sm:gap-4 md:flex-row md:items-start md:justify-between">
                        <div className="min-w-0">
                            <Badge tone="brand">Question</Badge>
                            <h1 className="mt-4 break-words text-4xl font-semibold tracking-tight text-balance">{question.title}</h1>
                            <div className="mt-4 flex flex-wrap gap-3 text-sm text-[hsl(var(--muted))]">
                                <span>Asked {convertDateToRelativeTime(new Date(question.$createdAt))}</span>
                                <span>{answers.total} answers</span>
                                <span><VoteCount type="question" typeId={question.$id} initialCount={upvotes.total + downvotes.total} /> votes</span>
                            </div>
                        </div>
                        <LinkButton href="/questions" variant="secondary" className="w-full shrink-0 md:w-auto">
                            <ArrowLeft className="size-4" aria-hidden="true" />
                            Back to questions
                        </LinkButton>
                    </div>

                    <Surface className="p-0">
                        <div className="grid gap-0 lg:grid-cols-[92px_minmax(0,1fr)]">
                            <div className="border-b p-3 sm:p-4 lg:border-b-0 lg:border-r">
                                <div className="flex flex-wrap items-center gap-3 lg:flex-col lg:flex-nowrap">
                                    <VoteButtons
                                        type="question"
                                        id={question.$id}
                                        className="w-auto flex-row gap-x-3 gap-y-0 lg:w-full lg:flex-col lg:gap-x-0 lg:gap-y-3"
                                        upvotes={upvotes}
                                        downvotes={downvotes}
                                    />
                                    <EditQuestion
                                        questionId={question.$id}
                                        questionTitle={question.title}
                                        authorId={question.authorId}
                                    />
                                    <DeleteQuestion questionId={question.$id} authorId={question.authorId} />
                                </div>
                            </div>
                            <article className="min-w-0 p-3 sm:p-5">
                                <MarkdownPreview className="markdown-content min-w-0 rounded-lg border bg-[hsl(var(--panel-strong))] p-3 sm:p-4" source={question.content} />
                                {question.attachmentId && (
                                    <picture>
                                        <img
                                            src={`${storage.getFileView(questionAttachmentBucket, question.attachmentId).href}&attachment=${question.attachmentId}`}
                                            alt={question.title}
                                            className="mt-5 max-h-[520px] w-full rounded-lg border object-cover"
                                        />
                                    </picture>
                                )}
                                <div className="mt-5 flex flex-wrap items-center gap-2">
                                    {question.tags.map((tag: string) => (
                                        <Link key={tag} href={`/questions?tag=${tag}`} className="atlas-focus rounded">
                                            <Badge tone="brand">#{tag}</Badge>
                                        </Link>
                                    ))}
                                </div>
                                <div className="mt-6 flex min-w-0 items-center justify-end gap-3">
                                    <UserAvatar name={author.name} avatarId={author.prefs.avatarId} avatarVersion={author.prefs.avatarVersion} className="size-10 border-2 border-[hsl(var(--accent))] shadow-sm" />
                                    <div className="min-w-0 break-words leading-tight">
                                        <Link
                                            href={`/users/${author.$id}/${slugify(author.name)}`}
                                            className="atlas-focus rounded font-semibold hover:text-[hsl(var(--brand-strong))]"
                                        >
                                            {author.name}
                                        </Link>
                                        <p className="text-sm text-[hsl(var(--muted))]">{authorReputation} reputation</p>
                                    </div>
                                </div>
                            </article>
                        </div>
                    </Surface>

                    <div className="mt-8">
                        <Answers answers={answers} questionId={question.$id} />
                    </div>
                </div>

                <aside className="space-y-4">
                    <StatCard label="Votes" value={<VoteCount type="question" typeId={question.$id} initialCount={upvotes.total + downvotes.total} />} detail="Community confidence signal" />
                    <StatCard label="Answers" value={answers.total} detail="Responses attached to this question" />
                    <Surface>
                            <h2 className="font-semibold">Answer tips</h2>
                        <div className="mt-4 space-y-3 text-sm text-[hsl(var(--muted))]">
                            <p className="flex gap-2"><Triangle className="mt-0.5 size-4 text-[hsl(var(--brand))]" /> Explain the solution clearly.</p>
                            <p className="flex gap-2"><MessageSquare className="mt-0.5 size-4 text-[hsl(var(--brand))]" /> Add examples when helpful.</p>
                        </div>
                    </Surface>
                </aside>
            </div>
        </PageShell>
    );
};

export default Page;
