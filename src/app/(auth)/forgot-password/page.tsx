"use client";

import React from "react";
import Link from "next/link";
import { Mail } from "lucide-react";
import { account } from "@/models/client/config";
import { Button } from "@/components/design-system";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ForgotPasswordPage() {
    const [isLoading, setIsLoading] = React.useState(false);
    const [error, setError] = React.useState("");
    const [sent, setSent] = React.useState(false);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const email = new FormData(event.currentTarget).get("email")?.toString().trim();

        if (!email) {
            setError("Please enter your email address.");
            return;
        }

        setIsLoading(true);
        setError("");

        try {
            await account.createRecovery(email, `${window.location.origin}/reset-password`);
            setSent(true);
        } catch (error) {
            setError(error instanceof Error ? error.message : "Unable to send the recovery email.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <div className="mb-8">
                <p className="text-sm font-medium text-[hsl(var(--brand))]">Account recovery</p>
                <h1 className="mt-2 text-2xl font-semibold tracking-tight">Forgot your password?</h1>
                <p className="mt-3 text-sm leading-6 text-[hsl(var(--muted))]">
                    Enter your account email and we will send you a secure password-reset link.
                </p>
            </div>

            {sent ? (
                <div className="space-y-5">
                    <p className="rounded-md border border-[hsl(var(--brand)/0.35)] bg-[hsl(var(--brand)/0.08)] p-4 text-sm">
                        Recovery email sent. Check your inbox and spam folder, then open the link to choose a new password.
                    </p>
                    <Link href="/login" className="atlas-focus block rounded text-center font-semibold text-[hsl(var(--brand-strong))] hover:underline">
                        Return to sign in
                    </Link>
                </div>
            ) : (
                <form className="space-y-5" onSubmit={handleSubmit}>
                    {error && <p className="rounded-md border border-[hsl(var(--danger)/0.35)] bg-[hsl(var(--danger)/0.08)] p-3 text-sm text-[hsl(var(--danger))]">{error}</p>}
                    <div className="space-y-2">
                        <Label htmlFor="email">Email address</Label>
                        <Input id="email" name="email" type="email" autoComplete="email" placeholder="you@company.com" />
                    </div>
                    <Button className="w-full" type="submit" disabled={isLoading}>
                        <Mail className="size-4" aria-hidden="true" />
                        {isLoading ? "Sending..." : "Send reset link"}
                    </Button>
                    <Link href="/login" className="atlas-focus block rounded text-center text-sm font-semibold text-[hsl(var(--brand-strong))] hover:underline">
                        Back to sign in
                    </Link>
                </form>
            )}
        </div>
    );
}
