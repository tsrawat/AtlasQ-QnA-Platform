import Link from "next/link";
import { type ComponentPropsWithoutRef, type ReactNode } from "react";
import { ArrowRight, Inbox } from "lucide-react";
import { cn } from "@/lib/utils";

type ButtonProps = ComponentPropsWithoutRef<"button"> & {
    variant?: "primary" | "secondary" | "ghost" | "danger";
};

export function Button({ className, variant = "primary", ...props }: ButtonProps) {
    return (
        <button
            className={cn(
                "atlas-focus inline-flex h-10 items-center justify-center gap-2 rounded-[10px] px-4 text-sm font-medium transition duration-200 disabled:pointer-events-none disabled:opacity-55",
                variant === "primary" &&
                    "bg-[hsl(var(--brand))] text-[hsl(var(--button-text))] shadow-[0_4px_12px_hsl(var(--foreground)/0.12)] hover:-translate-y-0.5 hover:bg-[hsl(var(--brand-hover))] hover:shadow-md",
                variant === "secondary" &&
                    "border border-[hsl(var(--border)/0.4)] bg-[hsl(var(--panel-strong))] text-[hsl(var(--foreground))] hover:-translate-y-0.5 hover:bg-[hsl(var(--accent)/0.78)]",
                variant === "ghost" && "text-[hsl(var(--muted))] hover:bg-[hsl(var(--panel-strong))] hover:text-[hsl(var(--foreground))]",
                variant === "danger" &&
                    "bg-[hsl(var(--danger))] text-[hsl(var(--background))] hover:bg-[hsl(var(--danger)/0.9)]",
                className
            )}
            {...props}
        />
    );
}

export function LinkButton({
    className,
    variant = "primary",
    children,
    ...props
}: ComponentPropsWithoutRef<typeof Link> & { variant?: ButtonProps["variant"] }) {
    return (
        <Link
            className={cn(
                "atlas-focus inline-flex h-10 items-center justify-center gap-2 rounded-[10px] px-4 text-sm font-medium transition duration-200",
                variant === "primary" &&
                    "bg-[hsl(var(--brand))] text-[hsl(var(--button-text))] shadow-[0_4px_12px_hsl(var(--foreground)/0.12)] hover:-translate-y-0.5 hover:bg-[hsl(var(--brand-hover))] hover:shadow-md",
                variant === "secondary" &&
                    "border border-[hsl(var(--border)/0.4)] bg-[hsl(var(--panel-strong))] text-[hsl(var(--foreground))] hover:bg-[hsl(var(--accent)/0.78)]",
                variant === "ghost" && "text-[hsl(var(--muted))] hover:bg-[hsl(var(--panel-strong))] hover:text-[hsl(var(--foreground))]",
                className
            )}
            {...props}
        >
            {children}
        </Link>
    );
}

export function PageShell({ children, className }: { children: ReactNode; className?: string }) {
    return <main className={cn("mx-auto w-full max-w-6xl px-4 pb-14 pt-24 sm:px-6 lg:px-8", className)}>{children}</main>;
}

export function Surface({ children, className }: { children: ReactNode; className?: string }) {
    return <section className={cn("atlas-panel rounded-2xl p-5", className)}>{children}</section>;
}

export function Eyebrow({ children }: { children: ReactNode }) {
    return (
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-[hsl(var(--brand))]">
            {children}
        </p>
    );
}

export function Badge({ children, tone = "neutral" }: { children: ReactNode; tone?: "neutral" | "brand" | "accent" | "success" }) {
    return (
        <span
            className={cn(
                "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold",
                tone === "neutral" && "border bg-[hsl(var(--panel-strong))] text-[hsl(var(--muted))]",
                tone === "brand" && "bg-[hsl(var(--brand)/0.13)] text-[hsl(var(--brand-strong))]",
                tone === "accent" && "bg-[hsl(var(--accent)/0.35)] text-[hsl(var(--brand-strong))]",
                tone === "success" && "bg-[hsl(var(--success)/0.14)] text-[hsl(var(--success))]"
            )}
        >
            {children}
        </span>
    );
}

export function StatCard({ label, value, detail }: { label: string; value: ReactNode; detail?: string }) {
    return (
        <div className="rounded-2xl border border-[hsl(var(--border)/0.18)] bg-[hsl(var(--panel))] p-5 shadow-[0_4px_12px_hsl(var(--foreground)/0.05)]">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[hsl(var(--muted))]">{label}</p>
            <p className="mt-3 text-3xl font-semibold tracking-tight">{value}</p>
            {detail && <p className="mt-2 text-sm text-[hsl(var(--muted))]">{detail}</p>}
        </div>
    );
}

export function EmptyState({
    title,
    description,
    actionHref,
    actionLabel,
}: {
    title: string;
    description: string;
    actionHref?: string;
    actionLabel?: string;
}) {
    return (
        <div className="rounded-lg border border-dashed bg-[hsl(var(--panel)/0.6)] p-10 text-center">
            <Inbox className="mx-auto size-10 text-[hsl(var(--muted-2))]" aria-hidden="true" />
            <h2 className="mt-4 text-lg font-semibold">{title}</h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[hsl(var(--muted))]">{description}</p>
            {actionHref && actionLabel && (
                <LinkButton href={actionHref} className="mt-6">
                    {actionLabel}
                    <ArrowRight className="size-4" aria-hidden="true" />
                </LinkButton>
            )}
        </div>
    );
}
