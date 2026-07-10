"use client";

import { Moon, Search, Sun } from "lucide-react";
import React from "react";
import { Button } from "./design-system";

export function ThemeToggle() {
    const [dark, setDark] = React.useState(true);

    React.useEffect(() => {
        const stored = window.localStorage.getItem("atlasq-theme");
        const shouldUseDark = stored ? stored === "dark" : true;
        document.documentElement.classList.toggle("dark", shouldUseDark);
        setDark(shouldUseDark);
    }, []);

    const toggle = () => {
        const next = !dark;
        document.documentElement.classList.toggle("dark", next);
        window.localStorage.setItem("atlasq-theme", next ? "dark" : "light");
        setDark(next);
    };

    return (
        <Button type="button" variant="secondary" className="size-10 px-0" onClick={toggle} aria-label="Toggle theme">
            {dark ? <Sun className="size-4" /> : <Moon className="size-4" />}
        </Button>
    );
}

export function CommandHint() {
    return (
        <div className="hidden h-10 items-center gap-2 rounded-md border bg-[hsl(var(--panel))] px-3 text-sm text-[hsl(var(--muted))] lg:flex">
            <Search className="size-4" aria-hidden="true" />
            <span>Search knowledge</span>
            <kbd className="ml-6 rounded border bg-[hsl(var(--panel-strong))] px-1.5 py-0.5 text-[10px] font-semibold">/</kbd>
        </div>
    );
}
