import { PageShell, Surface } from "@/components/design-system";

export default function Loading() {
    return (
        <PageShell>
            <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
                <Surface className="space-y-4">
                    <div className="h-8 w-2/3 animate-pulse rounded bg-[hsl(var(--panel-strong))]" />
                    <div className="h-4 w-1/2 animate-pulse rounded bg-[hsl(var(--panel-strong))]" />
                    <div className="grid gap-3 pt-4">
                        {[0, 1, 2].map(item => (
                            <div key={item} className="h-28 animate-pulse rounded-lg border bg-[hsl(var(--panel-strong))]" />
                        ))}
                    </div>
                </Surface>
                <Surface className="hidden h-80 animate-pulse lg:block">
                    <span className="sr-only">Loading supporting content</span>
                </Surface>
            </div>
        </PageShell>
    );
}
