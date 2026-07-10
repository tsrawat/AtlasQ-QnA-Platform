"use client";

import { avatars, storage } from "@/models/client/config";
import { questionAttachmentBucket } from "@/models/name";
import { cn } from "@/lib/utils";

export default function UserAvatar({ name, avatarId, avatarVersion, className }: { name: string; avatarId?: string; avatarVersion?: string; className?: string }) {
    const fallback = avatars.getInitials(name, 160, 160).href;
    const src = avatarId ? `${storage.getFileView(questionAttachmentBucket, avatarId).href}&avatar=${encodeURIComponent(`${avatarId}-${avatarVersion || "current"}`)}` : fallback;

    return (
      <img
        src={src}
        alt={`${name}'s profile`}
        className={cn(
          "rounded-full object-cover shadow-[0_3px_10px_hsl(var(--foreground)/0.16)]",
          className,
        )}
        style={{ border: "1.5px solid #978F66" }}
        onError={(event) => {
          event.currentTarget.src = fallback;
        }}
      />
    );
}
