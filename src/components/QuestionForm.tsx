"use client";

import RTE from "@/components/RTE";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/store/Auth";
import slugify from "@/utils/slugify";
import { IconX } from "@tabler/icons-react";
import { Models, ID } from "appwrite";
import { useRouter } from "next/navigation";
import React from "react";
import { databases, storage } from "@/models/client/config";
import { db, questionAttachmentBucket, questionCollection } from "@/models/name";
import { Confetti } from "@/components/magicui/confetti";
import { Badge, Button, Surface } from "@/components/design-system";
import { ImagePlus, Send, Tags } from "lucide-react";

/**
 * ******************************************************************************
 * ![INFO]: for buttons, refer to https://ui.aceternity.com/components/tailwindcss-buttons
 * ******************************************************************************
 */
const QuestionForm = ({ question }: { question?: Models.Document }) => {
    const { user } = useAuthStore();
    const [tag, setTag] = React.useState("");
    const router = useRouter();

    const [formData, setFormData] = React.useState({
        title: String(question?.title || ""),
        content: String(question?.content || ""),
        authorId: user?.$id,
        tags: new Set((question?.tags || []) as string[]),
        attachment: null as File | null,
    });

    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState("");

    const loadConfetti = (timeInMS = 3000) => {
        const end = Date.now() + timeInMS; // 3 seconds
        const colors = ["#4C8C5A", "#6B2D3A", "#B54848", "#E8D1C5"];

        const frame = () => {
            if (Date.now() > end) return;

            Confetti({
                particleCount: 2,
                angle: 60,
                spread: 55,
                startVelocity: 60,
                origin: { x: 0, y: 0.5 },
                colors: colors,
            });
            Confetti({
                particleCount: 2,
                angle: 120,
                spread: 55,
                startVelocity: 60,
                origin: { x: 1, y: 0.5 },
                colors: colors,
            });

            requestAnimationFrame(frame);
        };

        frame();
    };

    const create = async () => {
        if (!formData.attachment) throw new Error("Please upload an image");

        const storageResponse = await storage.createFile(
            questionAttachmentBucket,
            ID.unique(),
            formData.attachment
        );

        const response = await databases.createDocument(db, questionCollection, ID.unique(), {
            title: formData.title,
            content: formData.content,
            authorId: formData.authorId,
            tags: Array.from(formData.tags),
            attachmentId: storageResponse.$id,
        });

        loadConfetti();

        return response;
    };

    const update = async () => {
        if (!question) throw new Error("Please provide a question");

        const attachmentId = await (async () => {
            if (!formData.attachment) return question?.attachmentId as string;

            await storage.deleteFile(questionAttachmentBucket, question.attachmentId);

            const file = await storage.createFile(
                questionAttachmentBucket,
                ID.unique(),
                formData.attachment
            );

            return file.$id;
        })();

        const response = await databases.updateDocument(db, questionCollection, question.$id, {
            title: formData.title,
            content: formData.content,
            authorId: formData.authorId,
            tags: Array.from(formData.tags),
            attachmentId: attachmentId,
        });

        return response;
    };

    const submit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // didn't check for attachment because it's optional in updating
        if (!formData.title || !formData.content || !formData.authorId) {
            setError(() => "Please fill out all fields");
            return;
        }

        setLoading(() => true);
        setError(() => "");

        try {
            const response = question ? await update() : await create();

            router.push(`/questions/${response.$id}/${slugify(formData.title)}`);
        } catch (error: any) {
            setError(() => error.message);
        }

        setLoading(() => false);
    };

    return (
        <form className="space-y-5" onSubmit={submit}>
            {error && (
                <div className="rounded-md border border-[hsl(var(--danger)/0.35)] bg-[hsl(var(--danger)/0.08)] p-4 text-sm font-medium text-[hsl(var(--danger))]">
                    {error}
                </div>
            )}
            <Surface className="space-y-4">
                <div>
                    <Badge tone="brand">Title</Badge>
                    <Label className="mt-3 block text-base" htmlFor="title">
                        Question title
                    </Label>
                    <p className="mt-1 text-sm text-[hsl(var(--muted))]">
                        Write a short and clear title for your question.
                    </p>
                </div>
                <Input
                    id="title"
                    name="title"
                    placeholder="Example: How do I fix this React state update issue?"
                    type="text"
                    value={formData.title}
                    onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
                />
            </Surface>
            <Surface className="space-y-4">
                <div>
                    <Badge tone="brand">Details</Badge>
                    <Label className="mt-3 block text-base" htmlFor="content">
                        Question details
                    </Label>
                    <p className="mt-1 text-sm text-[hsl(var(--muted))]">
                        Explain the problem, what you tried, and what result you expected.
                    </p>
                </div>
                <RTE
                    value={formData.content}
                    onChange={value => setFormData(prev => ({ ...prev, content: value || "" }))}
                    data-color-mode="dark"
                />
            </Surface>
            <div className="grid gap-5 lg:grid-cols-[1fr_0.8fr]">
                <Surface className="space-y-4">
                    <div className="flex items-start gap-3">
                        <ImagePlus className="mt-1 size-5 text-[hsl(var(--brand))]" aria-hidden="true" />
                        <div>
                            <Label className="block text-base" htmlFor="image">
                                Add image
                            </Label>
                            <p className="mt-1 text-sm text-[hsl(var(--muted))]">
                                Upload an image if it helps explain your question.
                            </p>
                        </div>
                    </div>
                    <Input
                        id="image"
                        name="image"
                        accept="image/*"
                        type="file"
                        onChange={e => {
                            const files = e.target.files;
                            if (!files || files.length === 0) return;
                            setFormData(prev => ({
                                ...prev,
                                attachment: files[0],
                            }));
                        }}
                    />
                </Surface>
                <Surface className="space-y-4">
                    <div className="flex items-start gap-3">
                        <Tags className="mt-1 size-5 text-[hsl(var(--brand))]" aria-hidden="true" />
                        <div>
                            <Label className="block text-base" htmlFor="tag">
                                Tags
                            </Label>
                            <p className="mt-1 text-sm text-[hsl(var(--muted))]">
                                Add short labels such as react, nextjs, database, auth, or css.
                            </p>
                        </div>
                    </div>
                    <div className="flex w-full gap-2">
                        <Input
                            id="tag"
                            name="tag"
                            placeholder="Add a tag"
                            type="text"
                            value={tag}
                            onChange={e => setTag(() => e.target.value)}
                            onKeyDown={e => {
                                if (e.key === "Enter") {
                                    e.preventDefault();
                                    const next = tag.trim();
                                    if (!next) return;
                                    setFormData(prev => ({
                                        ...prev,
                                        tags: new Set([...Array.from(prev.tags), next.toLowerCase()]),
                                    }));
                                    setTag("");
                                }
                            }}
                        />
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => {
                                const next = tag.trim();
                                if (!next) return;
                                setFormData(prev => ({
                                    ...prev,
                                    tags: new Set([...Array.from(prev.tags), next.toLowerCase()]),
                                }));
                                setTag(() => "");
                            }}
                        >
                            Add
                        </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {Array.from(formData.tags).map((tag, index) => (
                            <span key={index} className="inline-flex items-center gap-2 rounded bg-[hsl(var(--brand)/0.12)] px-2 py-1 text-xs font-semibold text-[hsl(var(--brand-strong))]">
                                #{tag}
                                <button
                                    className="atlas-focus rounded"
                                    aria-label={`Remove ${tag} tag`}
                                    onClick={() => {
                                        setFormData(prev => ({
                                            ...prev,
                                            tags: new Set(Array.from(prev.tags).filter(t => t !== tag)),
                                        }));
                                    }}
                                    type="button"
                                >
                                    <IconX size={12} />
                                </button>
                            </span>
                        ))}
                    </div>
                </Surface>
            </div>
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <Button type="button" variant="secondary" onClick={() => router.back()}>
                    Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                    <Send className="size-4" aria-hidden="true" />
                    {loading ? "Publishing..." : question ? "Update question" : "Publish question"}
                </Button>
            </div>
        </form>
    );
};

export default QuestionForm;
