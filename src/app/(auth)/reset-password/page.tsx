"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { KeyRound } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { account } from "@/models/client/config";
import { Button } from "@/components/design-system";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function ResetPasswordForm() {
    const searchParams = useSearchParams();
    const userId = searchParams.get("userId");
    const secret = searchParams.get("secret");
    const [isLoading, setIsLoading] = React.useState(false);
    const [error, setError] = React.useState("");
    const [complete, setComplete] = React.useState(false);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const password = formData.get("password")?.toString() || "";
        const confirmation = formData.get("confirmation")?.toString() || "";

        if (!userId || !secret) {
            setError("This recovery link is invalid or incomplete. Request a new link.");
            return;
        }
        if (password.length < 8) {
            setError("Password must contain at least 8 characters.");
            return;
        }
        if (password !== confirmation) {
            setError("Passwords do not match.");
            return;
        }

        setIsLoading(true);
        setError("");
        try {
            await account.updateRecovery(userId, secret, password);
            setComplete(true);
        } catch (error) {
            setError(error instanceof Error ? error.message : "Unable to reset the password.");
        } finally {
            setIsLoading(false);
        }
    };

    if (complete) {
        return (
            <div className="space-y-5">
                <h1 className="text-2xl font-semibold tracking-tight">Password updated</h1>
                <p className="rounded-md border border-[hsl(var(--brand)/0.35)] bg-[hsl(var(--brand)/0.08)] p-4 text-sm">
                    Your password has been changed successfully. You can now sign in with the new password.
                </p>
                <Link href="/login" className="atlas-focus block rounded text-center font-semibold text-[hsl(var(--brand-strong))] hover:underline">Sign in</Link>
            </div>
        );
    }

    return (
        <div>
            <div className="mb-8">
                <p className="text-sm font-medium text-[hsl(var(--brand))]">Account recovery</p>
                <h1 className="mt-2 text-2xl font-semibold tracking-tight">Choose a new password</h1>
                <p className="mt-3 text-sm leading-6 text-[hsl(var(--muted))]">Use at least 8 characters and do not reuse an old password.</p>
            </div>
            <form className="space-y-5" onSubmit={handleSubmit}>
                {error && <p className="rounded-md border border-[hsl(var(--danger)/0.35)] bg-[hsl(var(--danger)/0.08)] p-3 text-sm text-[hsl(var(--danger))]">{error}</p>}
                <div className="space-y-2">
                    <Label htmlFor="password">New password</Label>
                    <Input id="password" name="password" type="password" autoComplete="new-password" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="confirmation">Confirm new password</Label>
                    <Input id="confirmation" name="confirmation" type="password" autoComplete="new-password" />
                </div>
                <Button className="w-full" type="submit" disabled={isLoading || !userId || !secret}>
                    <KeyRound className="size-4" aria-hidden="true" />
                    {isLoading ? "Updating..." : "Update password"}
                </Button>
                {(!userId || !secret) && (
                    <Link href="/forgot-password" className="atlas-focus block rounded text-center text-sm font-semibold text-[hsl(var(--brand-strong))] hover:underline">Request a new recovery link</Link>
                )}
            </form>
        </div>
    );
}

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={<p className="text-sm text-[hsl(var(--muted))]">Loading recovery form...</p>}>
            <ResetPasswordForm />
        </Suspense>
    );
}
