"use client";

import Link from "next/link";
import { Models } from "appwrite";
import slugify from "@/utils/slugify";
import convertDateToRelativeTime from "@/utils/relativeTime";
import { Badge } from "./design-system";
import { ArrowUpRight, MessageSquare, Triangle } from "lucide-react";
import UserAvatar from "./UserAvatar";

const QuestionCard = ({ ques }: { ques: Models.Document }) => {
    return (
        <article className="group rounded-lg border bg-[hsl(var(--panel))] p-5 shadow-sm transition hover:border-[hsl(var(--brand)/0.45)]">
            <div className="flex flex-col gap-5 lg:flex-row">
                <div className="grid grid-cols-2 gap-2 text-sm lg:w-28 lg:grid-cols-1">
                    <div className="rounded-md border bg-[hsl(var(--panel-strong))] p-3">
                        <div className="flex items-center gap-2 text-[hsl(var(--muted))]">
                            <Triangle className="size-3" aria-hidden="true" />
                            Votes
                        </div>
                        <p className="mt-2 text-2xl font-semibold">{ques.totalVotes}</p>
                    </div>
                    <div className="rounded-md border bg-[hsl(var(--panel-strong))] p-3">
                        <div className="flex items-center gap-2 text-[hsl(var(--muted))]">
                            <MessageSquare className="size-3" aria-hidden="true" />
                            Answers
                        </div>
                        <p className="mt-2 text-2xl font-semibold">{ques.totalAnswers}</p>
                    </div>
                </div>
                <div className="min-w-0 flex-1">
                    <div className="flex items-start gap-3">
                        <Link
                            href={`/questions/${ques.$id}/${slugify(ques.title)}`}
                            className="atlas-focus rounded text-xl font-semibold tracking-tight text-[hsl(var(--foreground))] decoration-[hsl(var(--brand))] underline-offset-4 transition hover:text-[hsl(var(--brand-strong))] hover:underline"
                        >
                            {ques.title}
                        </Link>
                        <ArrowUpRight className="mt-1 size-4 shrink-0 text-[hsl(var(--muted-2))] transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
                    </div>
                    <div className="mt-4 flex flex-wrap items-center gap-2">
                        {ques.tags.map((tag: string) => (
                            <Link key={tag} href={`/questions?tag=${tag}`} className="atlas-focus rounded">
                                <Badge tone="brand">#{tag}</Badge>
                            </Link>
                        ))}
                    </div>
                    <div className="mt-5 flex flex-wrap items-center gap-3 text-sm text-[hsl(var(--muted))]">
                        <div className="flex items-center gap-2">
                            <UserAvatar name={ques.author.name} avatarId={ques.author.avatarId} avatarVersion={ques.author.avatarVersion} className="size-7 border border-[hsl(var(--accent))]" />
                            <Link
                                href={`/users/${ques.author.$id}/${slugify(ques.author.name)}`}
                                className="atlas-focus rounded font-medium text-[hsl(var(--foreground))] hover:text-[hsl(var(--brand-strong))]"
                            >
                                {ques.author.name}
                            </Link>
                            <span aria-label={`${ques.author.reputation} reputation`}>
                                {ques.author.reputation} rep
                            </span>
                        </div>
                        <span>Asked {convertDateToRelativeTime(new Date(ques.$createdAt))}</span>
                    </div>
                </div>
            </div>
        </article>
    );
};

export default QuestionCard;
