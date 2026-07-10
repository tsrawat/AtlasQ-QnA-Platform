"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button, LinkButton } from "@/components/design-system";
import { useAuthStore } from "@/store/Auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { UserPlus } from "lucide-react";

export default function Register() {
    const { login, createAccount } = useAuthStore();
    const router = useRouter();
    const [isLoading, setIsLoading] = React.useState(false);
    const [error, setError] = React.useState("");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);
        const firstname = formData.get("firstname");
        const lastname = formData.get("lastname");
        const email = formData.get("email");
        const password = formData.get("password");

        if (!firstname || !lastname || !email || !password) {
            setError("Please complete every field.");
            return;
        }

        setIsLoading(true);
        setError("");

        const response = await createAccount(`${firstname} ${lastname}`, email.toString(), password.toString());

        if (response.error) {
            setError(response.error.message);
        } else {
            const loginResponse = await login(email.toString(), password.toString());
            if (loginResponse.error) {
                setError(loginResponse.error.message);
            } else {
                router.push("/questions");
                router.refresh();
            }
        }

        setIsLoading(false);
    };

    return (
        <div>
            <div className="mb-8">
                <p className="text-sm font-medium text-[hsl(var(--brand))]">Create account</p>
                <h1 className="mt-2 text-2xl font-semibold tracking-tight">Join AtlasQ</h1>
                <p className="mt-3 text-sm leading-6 text-[hsl(var(--muted))]">
                    Create an account to participate in questions, answers, and voting.
                </p>
            </div>

            {error && <p className="mb-5 rounded-md border border-[hsl(var(--danger)/0.35)] bg-[hsl(var(--danger)/0.08)] p-3 text-sm text-[hsl(var(--danger))]">{error}</p>}

            <form className="space-y-5" onSubmit={handleSubmit}>
                <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="firstname">First name</Label>
                        <Input id="firstname" name="firstname" placeholder="Ada" type="text" autoComplete="given-name" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="lastname">Last name</Label>
                        <Input id="lastname" name="lastname" placeholder="Lovelace" type="text" autoComplete="family-name" />
                    </div>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="email">Email address</Label>
                    <Input id="email" name="email" placeholder="you@company.com" type="email" autoComplete="email" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" name="password" placeholder="Create a strong password" type="password" autoComplete="new-password" />
                </div>
                <Button className="w-full" type="submit" disabled={isLoading}>
                    <UserPlus className="size-4" aria-hidden="true" />
                    {isLoading ? "Creating account..." : "Create account"}
                </Button>
            </form>

            <div className="mt-6 rounded-lg border bg-[hsl(var(--panel-strong))] p-4 text-sm text-[hsl(var(--muted))]">
                Already have an account?{" "}
                <Link href="/login" className="atlas-focus rounded font-semibold text-[hsl(var(--brand-strong))] hover:underline">
                    Sign in
                </Link>
            </div>
            <LinkButton href="/questions" variant="ghost" className="mt-4 w-full">Browse first</LinkButton>
        </div>
    );
}
