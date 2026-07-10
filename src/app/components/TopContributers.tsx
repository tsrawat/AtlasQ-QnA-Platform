import { cn } from "@/lib/utils";

import { AnimatedList } from "@/components/magicui/animated-list";
import { users } from "@/models/server/config";
import { Models, Query } from "node-appwrite";
import { UserPrefs } from "@/store/Auth";
import convertDateToRelativeTime from "@/utils/relativeTime";
import UserAvatar from "@/components/UserAvatar";

const Notification = ({ user }: { user: Models.User<UserPrefs> }) => {
    return (
        <figure
            className={cn(
                "relative mx-auto min-h-fit w-full max-w-[400px] transform cursor-pointer overflow-hidden rounded-2xl p-4",
                // animation styles
                "transition-all duration-200 ease-in-out hover:scale-[103%]",
                // light styles
                "border bg-[hsl(var(--panel))] shadow-[0_12px_28px_-22px_hsl(var(--background))]",
                "transform-gpu"
            )}
        >
            <div className="flex flex-row items-center gap-3">
                <UserAvatar name={user.name} avatarId={user.prefs.avatarId} avatarVersion={user.prefs.avatarVersion} className="size-10 border border-[hsl(var(--accent))]" />
                <div className="flex flex-col overflow-hidden">
                    <figcaption className="flex flex-row items-center whitespace-pre text-lg font-medium text-[hsl(var(--foreground))]">
                        <span className="text-sm sm:text-lg">{user.name}</span>
                        <span className="mx-1">·</span>
                        <span className="text-xs text-gray-500">
                            {convertDateToRelativeTime(new Date(user.$updatedAt))}
                        </span>
                    </figcaption>
                    <p className="text-sm font-normal text-[hsl(var(--muted))]">
                        <span>Reputation</span>
                        <span className="mx-1">·</span>
                        <span className="text-xs text-gray-500">{user.prefs.reputation}</span>
                    </p>
                </div>
            </div>
        </figure>
    );
};

export default async function TopContributers() {
    const topUsers = await users.list<UserPrefs>([Query.limit(10)]);

    return (
        <div className="relative flex max-h-[400px] min-h-[400px] w-full max-w-[32rem] flex-col overflow-hidden rounded-lg border bg-[hsl(var(--panel))] p-6 shadow-lg">
            <AnimatedList>
                {topUsers.users.map(user => (
                    <Notification user={user} key={user.$id} />
                ))}
            </AnimatedList>
        </div>
    );
}
