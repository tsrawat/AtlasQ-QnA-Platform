"use client";

import { Button, PageShell, Surface } from "@/components/design-system";
import { AlertTriangle } from "lucide-react";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
    return (
        <PageShell className="flex min-h-screen items-center justify-center">
            <Surface className="max-w-lg text-center">
                <AlertTriangle className="mx-auto size-10 text-[hsl(var(--danger))]" aria-hidden="true" />
                <h1 className="mt-4 text-2xl font-semibold">Something went wrong</h1>
                <p className="mt-3 text-sm leading-6 text-[hsl(var(--muted))]">
                    {error.message || "The page could not finish loading."}
                </p>
                <Button className="mt-6" type="button" onClick={reset}>Try again</Button>
            </Surface>
        </PageShell>
    );
}
