"use client";

import { Models } from "appwrite";
import React from "react";
import VoteButtons from "./VoteButtons";
import { useAuthStore } from "@/store/Auth";
import { databases } from "@/models/client/config";
import { answerCollection, db } from "@/models/name";
import RTE, { MarkdownPreview } from "./RTE";
import slugify from "@/utils/slugify";
import Link from "next/link";
import { IconTrash } from "@tabler/icons-react";
import { Button, EmptyState, Surface } from "./design-system";
import UserAvatar from "./UserAvatar";

const Answers = ({
    answers: _answers,
    questionId,
}: {
    answers: Models.DocumentList<Models.Document>;
    questionId: string;
}) => {
    const [answers, setAnswers] = React.useState(_answers);
    const [newAnswer, setNewAnswer] = React.useState("");
    const { user } = useAuthStore();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!newAnswer || !user) return;

        try {
            const response = await fetch("/api/answer", {
                method: "POST",
                body: JSON.stringify({
                    questionId: questionId,
                    answer: newAnswer,
                    authorId: user.$id,
                }),
            });

            const data = await response.json();

            if (!response.ok) throw data;

            setNewAnswer(() => "");
            setAnswers(prev => ({
                total: prev.total + 1,
                documents: [
                    {
                        ...data,
                        author: user,
                        upvotesDocuments: { documents: [], total: 0 },
                        downvotesDocuments: { documents: [], total: 0 },
                    },
                    ...prev.documents,
                ],
            }));
        } catch (error: any) {
            window.alert(error?.message || error?.error || "Error creating answer");
        }
    };

    const deleteAnswer = async (answerId: string) => {
        try {
            const response = await fetch("/api/answer", {
                method: "DELETE",
                body: JSON.stringify({
                    answerId: answerId,
                }),
            });

            const data = await response.json();

            if (!response.ok) throw data;

            setAnswers(prev => ({
                total: prev.total - 1,
                documents: prev.documents.filter(answer => answer.$id !== answerId),
            }));
        } catch (error: any) {
            window.alert(error?.message || "Error deleting answer");
        }
    };

    return (
        <section className="space-y-5">
            <h2 className="text-2xl font-semibold tracking-tight">{answers.total} Answers</h2>
            {answers.documents.length === 0 && (
                <EmptyState
                    title="No answers yet"
                    description="Be the first to turn this question into reusable team knowledge."
                />
            )}
            {answers.documents.map(answer => (
                <Surface key={answer.$id} className="overflow-hidden p-0 transition duration-200 hover:border-[hsl(var(--brand)/0.5)] hover:shadow-[0_16px_35px_-25px_hsl(var(--foreground)/0.6)]">
                    <div className="grid lg:grid-cols-[92px_minmax(0,1fr)]">
                        <div className="border-b bg-[hsl(var(--panel-strong)/0.38)] p-4 lg:border-b-0 lg:border-r">
                            <div className="flex items-center gap-3 lg:flex-col">
                                <VoteButtons
                                    type="answer"
                                    id={answer.$id}
                                    upvotes={answer.upvotesDocuments}
                                    downvotes={answer.downvotesDocuments}
                                />
                                {user?.$id === answer.authorId ? (
                                    <button
                                        aria-label="Delete answer"
                                        className="atlas-focus flex h-10 w-10 items-center justify-center rounded-md border border-[#B54848]/45 p-1 text-[#B54848] duration-200 hover:bg-[#B54848]/10"
                                        onClick={() => deleteAnswer(answer.$id)}
                                    >
                                        <IconTrash className="h-4 w-4" />
                                    </button>
                                ) : null}
                            </div>
                        </div>
                        <div className="min-w-0 p-5 sm:p-6">
                            <MarkdownPreview className="atlas-markdown markdown-content rounded-xl border bg-[hsl(var(--background)/0.72)] p-4 sm:p-5" source={answer.content} />
                            <div className="mt-5 flex items-center justify-end gap-3 border-t border-[hsl(var(--border)/0.7)] pt-4">
                                <UserAvatar
                                    name={answer.author.name}
                                    avatarId={answer.author.avatarId || answer.author.prefs?.avatarId}
                                    avatarVersion={answer.author.avatarVersion || answer.author.prefs?.avatarVersion}
                                    className="size-10 border-2 border-[hsl(var(--accent))] shadow-sm"
                                />
                                <div className="block leading-tight text-right">
                                    <Link
                                        href={`/users/${answer.author.$id}/${slugify(answer.author.name)}`}
                                        className="atlas-focus rounded font-semibold hover:text-[hsl(var(--brand-strong))]"
                                    >
                                        {answer.author.name}
                                    </Link>
                                    <p className="mt-1 text-xs font-medium text-[hsl(var(--muted))]">{answer.author.reputation} reputation</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </Surface>
            ))}
            <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border bg-[hsl(var(--panel)/0.9)] p-5 shadow-sm">
                <h2 className="text-xl font-semibold">Your answer</h2>
                <RTE value={newAnswer} onChange={value => setNewAnswer(() => value || "")} data-color-mode="dark" />
                <Button>
                    Post Your Answer
                </Button>
            </form>
        </section>
    );
};

export default Answers;
