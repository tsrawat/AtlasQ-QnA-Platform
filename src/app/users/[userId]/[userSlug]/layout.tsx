import { users } from "@/models/server/config";
import { UserPrefs } from "@/store/Auth";
import convertDateToRelativeTime from "@/utils/relativeTime";
import React from "react";
import EditButton from "./EditButton";
import Navbar from "./Navbar";
import { Badge, PageShell, Surface } from "@/components/design-system";
import { Clock3, Mail, UserRound } from "lucide-react";
import UserAvatar from "@/components/UserAvatar";

const Layout = async ({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ userId: string; userSlug: string }>;
}) => {
    const { userId } = await params;
    const user = await users.get<UserPrefs>(userId);

    return (
        <PageShell>
            <Surface className="mb-6">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                    <UserAvatar name={user.name} avatarId={user.prefs.avatarId} avatarVersion={user.prefs.avatarVersion} className="size-28 shrink-0 border-4 border-[hsl(var(--panel))] shadow-md" />
                    <div className="min-w-0 flex-1">
                        <Badge tone="brand">User profile</Badge>
                        <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                            <div>
                                <h1 className="text-4xl font-semibold tracking-tight">{user.name}</h1>
                                <p className="mt-2 flex items-center gap-2 text-sm text-[hsl(var(--muted))]">
                                    <Mail className="size-4" aria-hidden="true" />
                                    {user.email}
                                </p>
                            </div>
                            <EditButton />
                        </div>
                        <div className="mt-5 flex flex-wrap gap-3 text-sm text-[hsl(var(--muted))]">
                            <span className="flex items-center gap-2">
                                <UserRound className="size-4" aria-hidden="true" />
                                Joined {convertDateToRelativeTime(new Date(user.$createdAt))}
                            </span>
                            <span className="flex items-center gap-2">
                                <Clock3 className="size-4" aria-hidden="true" />
                                Last activity {convertDateToRelativeTime(new Date(user.$updatedAt))}
                            </span>
                        </div>
                    </div>
                </div>
            </Surface>
            <div className="flex flex-col gap-5 sm:flex-row">
                <Navbar />
                <div className="min-w-0 flex-1">{children}</div>
            </div>
        </PageShell>
    );
};

export default Layout;
