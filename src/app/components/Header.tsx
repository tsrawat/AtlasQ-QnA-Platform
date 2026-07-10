"use client";
import React from "react";
import Link from "next/link";
import { LogIn, LogOut, Plus, UserRound } from "lucide-react";
import { useAuthStore } from "@/store/Auth";
import slugify from "@/utils/slugify";
import { BrandMark } from "@/components/brand";
import { Button, LinkButton } from "@/components/design-system";
import { cn } from "@/lib/utils";
import UserAvatar from "@/components/UserAvatar";
import { useRouter } from "next/navigation";

export default function Header() {
    const { user, hydrated, logout, refreshUser } = useAuthStore();
    const router = useRouter();

    React.useEffect(() => {
        const syncUser = async () => {
            await refreshUser();
            router.refresh();
        };
        const handleStorage = (event: StorageEvent) => {
            if (event.key === "auth") void syncUser();
        };

        window.addEventListener("storage", handleStorage);
        window.addEventListener("focus", syncUser);
        if (hydrated && useAuthStore.getState().user) void syncUser();
        return () => {
            window.removeEventListener("storage", handleStorage);
            window.removeEventListener("focus", syncUser);
        };
    }, [hydrated, refreshUser, router]);

    const navItems = [
        {
            name: "Home",
            link: "/",
        },
        {
            name: "Questions",
            link: "/questions",
        },
    ];

    return (
      <header className="fixed inset-x-0 top-0 z-50 border-b border-[hsl(var(--border)/0.14)] bg-[#E7D8CB] backdrop-blur-lg">
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-5 px-4 sm:px-6 lg:px-8">
          <BrandMark />
          <nav
            className="hidden items-center gap-2 md:flex"
            aria-label="Primary"
          >
            {navItems.map((item) => (
              <Link
                key={item.link}
                href={item.link}
                className={cn(
                  "atlas-focus rounded-[10px] px-3 py-2 text-sm font-medium text-[hsl(var(--muted))] transition duration-200 hover:bg-[hsl(var(--panel-strong))] hover:text-[hsl(var(--foreground))]",
                )}
              >
                {item.name}
              </Link>
            ))}
          </nav>
          <div className="ml-auto flex items-center justify-end gap-3">
            {user ? (
              <>
                <LinkButton href="/questions/ask">
                  <Plus className="size-4" aria-hidden="true" />
                  Ask
                </LinkButton>
                <Link
                  href={`/users/${user.$id}/${slugify(user.name)}`}
                  className="atlas-focus rounded-full"
                  aria-label="Open profile"
                >
                  <UserAvatar
                    name={user.name}
                    avatarId={user.prefs.avatarId}
                    avatarVersion={user.prefs.avatarVersion}
                    className="size-9 border-2 border-[hsl(var(--accent))]"
                  />
                </Link>
                <Button
                  type="button"
                  variant="ghost"
                  className="hidden size-10 px-0 text-[#B54848] hover:bg-[#B54848]/10 hover:text-[#B54848] sm:inline-flex"
                  onClick={() => logout()}
                  aria-label="Log out"
                >
                  <LogOut className="size-4" />
                </Button>
              </>
            ) : (
              <>
                <LinkButton href="/login" variant="secondary">
                  <LogIn className="size-4" aria-hidden="true" />
                  Sign in
                </LinkButton>
                <LinkButton href="/register" className="hidden sm:inline-flex">
                  <UserRound className="size-4" aria-hidden="true" />
                  Join
                </LinkButton>
              </>
            )}
          </div>
        </div>
      </header>
    );
}
