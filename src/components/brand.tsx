import Link from "next/link";

export function BrandMark({ compact = false }: { compact?: boolean }) {
    return (
        <Link href="/" className="atlas-focus group inline-flex items-center gap-2.5 rounded-[10px] px-1 py-1 transition duration-200 hover:bg-[hsl(var(--panel-strong)/0.55)]">
            <span className="grid size-9 place-items-center rounded-[10px] bg-[hsl(var(--foreground))] text-sm font-bold text-[hsl(var(--button-text))] shadow-sm">
                Q
            </span>
            {!compact && (
                <span className="leading-none text-[hsl(var(--foreground))]">
                    <span className="block text-base font-semibold tracking-tight">AtlasQ</span>
                    <span className="mt-1 block text-xs leading-none text-[hsl(var(--muted))]">
                        Student Q&A forum
                    </span>
                </span>
            )}
        </Link>
    );
}
