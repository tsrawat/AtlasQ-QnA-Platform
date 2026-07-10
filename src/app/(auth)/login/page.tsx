"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button, LinkButton } from "@/components/design-system";
import { useAuthStore } from "@/store/Auth";
import Link from "next/link";
import { LogIn } from "lucide-react";

export default function Login() {
    const { login } = useAuthStore();
    const [isLoading, setIsLoading] = React.useState(false);
    const [error, setError] = React.useState("");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);
        const email = formData.get("email");
        const password = formData.get("password");

        if (!email || !password) {
            setError("Please enter your email and password.");
            return;
        }

        setIsLoading(true);
        setError("");

        const loginResponse = await login(email.toString(), password.toString());
        if (loginResponse.error) setError(loginResponse.error.message);

        setIsLoading(false);
    };

    return (
        <div>
            <div className="mb-8">
                <p className="text-sm font-medium text-[hsl(var(--brand))]">Welcome back</p>
                <h1 className="mt-2 text-2xl font-semibold tracking-tight">Login to your account</h1>
                <p className="mt-3 text-sm leading-6 text-[hsl(var(--muted))]">
                    Sign in to ask questions, answer posts, vote, and manage your profile.
                </p>
            </div>

            {error && <p className="mb-5 rounded-md border border-[hsl(var(--danger)/0.35)] bg-[hsl(var(--danger)/0.08)] p-3 text-sm text-[hsl(var(--danger))]">{error}</p>}

            <form className="space-y-5" onSubmit={handleSubmit}>
                <div className="space-y-2">
                    <Label htmlFor="email">Email address</Label>
                    <Input id="email" name="email" placeholder="you@company.com" type="email" autoComplete="email" />
                </div>
                <div className="space-y-2">
                    <div className="flex items-center justify-between gap-4">
                        <Label htmlFor="password">Password</Label>
                        <Link
                            href="/forgot-password"
                            className="atlas-focus rounded text-sm font-semibold text-[hsl(var(--brand-strong))] hover:underline"
                        >
                            Forgot password?
                        </Link>
                    </div>
                    <Input id="password" name="password" placeholder="Enter your password" type="password" autoComplete="current-password" />
                </div>
                <Button className="w-full" type="submit" disabled={isLoading}>
                    <LogIn className="size-4" aria-hidden="true" />
                    {isLoading ? "Signing in..." : "Sign in"}
                </Button>
            </form>

            <div className="mt-6 rounded-lg border bg-[hsl(var(--panel-strong))] p-4 text-sm text-[hsl(var(--muted))]">
                New here?{" "}
                <Link href="/register" className="atlas-focus rounded font-semibold text-[hsl(var(--brand-strong))] hover:underline">
                    Create an account
                </Link>
            </div>
            <LinkButton href="/questions" variant="ghost" className="mt-4 w-full">Browse public questions</LinkButton>
        </div>
    );
}
