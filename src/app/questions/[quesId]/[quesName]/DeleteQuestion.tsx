"use client";

import { databases } from "@/models/client/config";
import { db, questionCollection } from "@/models/name";
import { useAuthStore } from "@/store/Auth";
import { IconTrash } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import React from "react";

const DeleteQuestion = ({ questionId, authorId }: { questionId: string; authorId: string }) => {
    const router = useRouter();
    const { user } = useAuthStore();

    const deleteQuestion = async () => {
        try {
            await databases.deleteDocument(db, questionCollection, questionId);

            router.push("/questions");
        } catch (error: any) {
            window.alert(error?.message || "Something went wrong");
        }
    };

    return user?.$id === authorId ? (
        <button
            className="atlas-focus flex h-10 w-10 items-center justify-center rounded-md border border-[#B54848]/45 bg-[hsl(var(--panel))] p-1 text-[#B54848] transition hover:-translate-y-0.5 hover:bg-[#B54848]/10"
            onClick={deleteQuestion}
            aria-label="Delete question"
        >
            <IconTrash className="h-4 w-4" />
        </button>
    ) : null;
};

export default DeleteQuestion;
