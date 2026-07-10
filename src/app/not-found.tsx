import { EmptyState, PageShell } from "@/components/design-system";

export default function NotFound() {
    return (
        <PageShell className="flex min-h-screen items-center justify-center">
            <EmptyState
                title="This page is outside the atlas"
                description="The route may have moved, the question may have been deleted, or the link may be incomplete."
                actionHref="/questions"
                actionLabel="Return to questions"
            />
        </PageShell>
    );
}
