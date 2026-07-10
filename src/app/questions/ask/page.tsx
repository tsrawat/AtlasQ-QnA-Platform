import QuestionForm from "@/components/QuestionForm";
import { Badge, PageShell, Surface } from "@/components/design-system";
import { Lightbulb, ShieldCheck, Timer, type LucideIcon } from "lucide-react";

const guidance: Array<[LucideIcon, string, string]> = [
    [Lightbulb, "Use a clear title", "Describe the exact topic or problem you need help with."],
    [Timer, "Add useful details", "Mention what you tried and what result you expected."],
    [ShieldCheck, "Choose tags", "Tags help other students find and answer your question."],
];

export default function AskQuestionPage() {
    return (
        <PageShell>
            <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
                <div>
                    <Badge tone="brand">New question</Badge>
                    <h1 className="mt-4 text-3xl font-semibold tracking-tight">Ask a Question</h1>
                    <p className="mt-3 max-w-2xl text-sm leading-6 text-[hsl(var(--muted))]">
                        Add a clear title, details, tags, and an image so others can understand your question.
                    </p>
                    <div className="mt-8">
                        <QuestionForm />
                    </div>
                </div>
                <aside className="space-y-4">
                    {guidance.map(([Icon, title, text]) => (
                        <Surface key={title}>
                            <Icon className="size-5 text-[hsl(var(--brand))]" aria-hidden="true" />
                            <h2 className="mt-4 font-semibold">{title}</h2>
                            <p className="mt-2 text-sm leading-6 text-[hsl(var(--muted))]">{text}</p>
                        </Surface>
                    ))}
                </aside>
            </div>
        </PageShell>
    );
}
