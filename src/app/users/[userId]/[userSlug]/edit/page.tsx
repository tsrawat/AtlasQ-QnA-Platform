"use client";

import { account } from "@/models/client/config";
import { useAuthStore, UserPrefs } from "@/store/Auth";
import slugify from "@/utils/slugify";
import { Button, Surface } from "@/components/design-system";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Save, UserRound } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React from "react";

const Page = () => {
    const router = useRouter();
    const { userId } = useParams<{ userId: string }>();
    const { user, hydrated, updateUser } = useAuthStore();
    const [name, setName] = React.useState("");
    const [error, setError] = React.useState("");
    const [saving, setSaving] = React.useState(false);

    React.useEffect(() => {
        if (user) setName(user.name);
    }, [user]);

    React.useEffect(() => {
        if (!hydrated) return;
        if (!user) router.replace("/login");
        else if (user.$id !== userId) router.replace(`/users/${user.$id}/${slugify(user.name)}`);
    }, [hydrated, router, user, userId]);

    const submit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const nextName = name.trim();

        if (!nextName) {
            setError("Please enter your display name.");
            return;
        }
        if (!user) return;

        setSaving(true);
        setError("");
        try {
            await account.updateName(nextName);
            const updatedUser = await account.get<UserPrefs>();
            updateUser(updatedUser);
            router.replace(`/users/${updatedUser.$id}/${slugify(updatedUser.name)}`);
            router.refresh();
        } catch (cause: unknown) {
            setError(cause instanceof Error ? cause.message : "Unable to update your profile.");
        } finally {
            setSaving(false);
        }
    };

    if (!hydrated || !user || user.$id !== userId) return null;

    return (
        <Surface className="max-w-xl">
            <div className="flex items-start gap-3">
                <UserRound className="mt-1 size-5 text-[hsl(var(--brand))]" aria-hidden="true" />
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">Edit profile</h1>
                    <p className="mt-1 text-sm text-[hsl(var(--muted))]">Update the name shown on your questions, answers, and profile.</p>
                </div>
            </div>

            <form className="mt-6 space-y-5" onSubmit={submit}>
                {error && <p role="alert" className="rounded-md border border-[hsl(var(--danger)/0.35)] bg-[hsl(var(--danger)/0.08)] p-3 text-sm text-[hsl(var(--danger))]">{error}</p>}
                <div className="space-y-2">
                    <Label htmlFor="name">Display name</Label>
                    <Input id="name" value={name} onChange={event => setName(event.target.value)} autoComplete="name" maxLength={128} required />
                    <p className="text-sm text-[hsl(var(--muted))]">Your email address cannot be changed here.</p>
                </div>
                <div className="flex justify-end gap-3">
                    <Button type="button" variant="secondary" onClick={() => router.back()}>Cancel</Button>
                    <Button type="submit" disabled={saving}>
                        <Save className="size-4" aria-hidden="true" />
                        {saving ? "Saving..." : "Save changes"}
                    </Button>
                </div>
            </form>
        </Surface>
    );
};

export default Page;
