import { HelpCircle, MessageSquare, Search, ThumbsUp } from "lucide-react";
import { LinkButton, PageShell, Surface } from "@/components/design-system";

const features = [
    { icon: HelpCircle, title: "Ask questions", text: "Post a question with details, tags, and an image so others can understand the problem." },
    { icon: MessageSquare, title: "Share answers", text: "Reply with clear solutions that help other students learn." },
    { icon: ThumbsUp, title: "Vote useful posts", text: "Upvote or downvote questions and answers to highlight helpful content." },
    { icon: Search, title: "Search topics", text: "Find questions by keyword or tag when you need help quickly." },
];

export default function Home() {
    return (
        <PageShell>
            <section className="relative overflow-hidden rounded-2xl border border-[hsl(var(--border)/0.85)] bg-[hsl(var(--panel))] px-6 py-12 shadow-[0_20px_50px_-35px_hsl(var(--background))] sm:px-10 sm:py-16">
                <div className="absolute -right-20 -top-24 size-72 rounded-full bg-[hsl(var(--brand)/0.12)] blur-3xl" aria-hidden="true" />
                <div className="relative max-w-3xl">
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[hsl(var(--brand))]">AtlasQ community</p>
                    <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
                        A simple place for students to ask, answer, and learn together.
                    </h1>
                    <p className="mt-5 max-w-2xl text-base leading-7 text-[hsl(var(--muted))]">
                        AtlasQ is a full-stack question and answer app with authentication, search, voting, and user profiles.
                    </p>
                    <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                        <LinkButton href="/questions">View questions</LinkButton>
                        <LinkButton href="/questions/ask" variant="secondary">Ask a question</LinkButton>
                    </div>
                </div>
            </section>

            <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {features.map(item => (
                    <Surface key={item.title} className="transition duration-200 hover:-translate-y-1 hover:border-[hsl(var(--brand)/0.45)]">
                        <item.icon className="size-5 text-[hsl(var(--brand))]" aria-hidden="true" />
                        <h2 className="mt-4 text-base font-semibold">{item.title}</h2>
                        <p className="mt-2 text-sm leading-6 text-[hsl(var(--muted))]">{item.text}</p>
                    </Surface>
                ))}
            </section>
        </PageShell>
    );
}
