"use client";

import { databases } from "@/models/client/config";
import { db, voteCollection } from "@/models/name";
import { useAuthStore } from "@/store/Auth";
import { cn } from "@/lib/utils";
import { IconCaretUpFilled, IconCaretDownFilled } from "@tabler/icons-react";
import { ID, Models, Query } from "appwrite";
import { useRouter } from "next/navigation";
import React from "react";

const VoteButtons = ({
    type,
    id,
    upvotes,
    downvotes,
    className,
}: {
    type: "question" | "answer";
    id: string;
    upvotes: Models.DocumentList<Models.Document>;
    downvotes: Models.DocumentList<Models.Document>;
    className?: string;
}) => {
    const [votedDocument, setVotedDocument] = React.useState<Models.Document | null>(); // undefined means not fetched yet
    const [voteResult, setVoteResult] = React.useState<number>(upvotes.total - downvotes.total);

    const { user } = useAuthStore();
    const router = useRouter();

    React.useEffect(() => {
        (async () => {
            if (user) {
                const response = await databases.listDocuments(db, voteCollection, [
                    Query.equal("type", type),
                    Query.equal("typeId", id),
                    Query.equal("votedById", user.$id),
                ]);
                setVotedDocument(() => response.documents[0] || null);
            }
        })();
    }, [user, id, type]);

    const toggleUpvote = async () => {
        if (!user) return router.push("/login");

        if (votedDocument === undefined) return;

        try {
            const response = await fetch(`/api/vote`, {
                method: "POST",
                body: JSON.stringify({
                    votedById: user.$id,
                    voteStatus: "upvoted",
                    type,
                    typeId: id,
                }),
            });

            const data = await response.json();

            if (!response.ok) throw data;

            setVoteResult(() => data.data.voteResult);
            setVotedDocument(() => data.data.document);
        } catch (error: any) {
            window.alert(error?.message || "Something went wrong");
        }
    };

    const toggleDownvote = async () => {
        if (!user) return router.push("/login");

        if (votedDocument === undefined) return;

        try {
            const response = await fetch(`/api/vote`, {
                method: "POST",
                body: JSON.stringify({
                    votedById: user.$id,
                    voteStatus: "downvoted",
                    type,
                    typeId: id,
                }),
            });

            const data = await response.json();

            if (!response.ok) throw data;

            setVoteResult(() => data.data.voteResult);
            setVotedDocument(() => data.data.document);
        } catch (error: any) {
            window.alert(error?.message || "Something went wrong");
        }
    };

    return (
        <div className={cn("flex shrink-0 flex-col items-center justify-start gap-y-3", className)}>
            <button
                className={cn(
                    "atlas-focus flex h-10 w-10 items-center justify-center rounded-md border border-[#4C8C5A]/55 bg-[hsl(var(--panel))] p-1 text-[#3D7A4A] transition hover:-translate-y-0.5 hover:bg-[#4C8C5A]/12",
                    votedDocument && votedDocument.voteStatus === "upvoted"
                        ? "border-[#3D7A4A] bg-[#4C8C5A]/18 text-[#2F6B3A]"
                        : ""
                )}
                onClick={toggleUpvote}
                aria-label="Upvote"
            >
                <IconCaretUpFilled />
            </button>
            <span className="text-sm font-semibold">{voteResult}</span>
            <button
                className={cn(
                    "atlas-focus flex h-10 w-10 items-center justify-center rounded-md border border-[#6B2D3A]/55 bg-[hsl(var(--panel))] p-1 text-[#6B2D3A] transition hover:-translate-y-0.5 hover:bg-[#6B2D3A]/12",
                    votedDocument && votedDocument.voteStatus === "downvoted"
                        ? "border-[#6B2D3A] bg-[#6B2D3A]/18 text-[#54232E]"
                        : ""
                )}
                onClick={toggleDownvote}
                aria-label="Downvote"
            >
                <IconCaretDownFilled />
            </button>
        </div>
    );
};

export default VoteButtons;
