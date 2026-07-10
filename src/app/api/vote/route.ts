import { calculateReputation } from "@/lib/reputation";
import { answerCollection, db, questionCollection, voteCollection } from "@/models/name";
import { databases, users } from "@/models/server/config";
import { UserPrefs } from "@/store/Auth";
import { NextRequest, NextResponse } from "next/server";
import { ID, Query } from "node-appwrite";

export async function POST(request: NextRequest) {
    try {
        const { votedById, voteStatus, type, typeId } = await request.json();
        if (!votedById || !typeId || !["question", "answer"].includes(type) || !["upvoted", "downvoted"].includes(voteStatus)) {
            return NextResponse.json({ message: "Invalid vote request" }, { status: 400 });
        }

        const existingVotes = await databases.listDocuments(db, voteCollection, [
            Query.equal("type", type),
            Query.equal("typeId", typeId),
            Query.equal("votedById", votedById),
            Query.limit(1),
        ]);
        const existingVote = existingVotes.documents[0];
        let document = null;

        if (existingVote) await databases.deleteDocument(db, voteCollection, existingVote.$id);
        if (existingVote?.voteStatus !== voteStatus) {
            document = await databases.createDocument(db, voteCollection, ID.unique(), { type, typeId, voteStatus, votedById });
        }

        const target = await databases.getDocument(db, type === "question" ? questionCollection : answerCollection, typeId);
        const [prefs, reputation, upvotes, downvotes] = await Promise.all([
            users.getPrefs<UserPrefs>(target.authorId),
            calculateReputation(target.authorId),
            databases.listDocuments(db, voteCollection, [Query.equal("type", type), Query.equal("typeId", typeId), Query.equal("voteStatus", "upvoted"), Query.limit(1)]),
            databases.listDocuments(db, voteCollection, [Query.equal("type", type), Query.equal("typeId", typeId), Query.equal("voteStatus", "downvoted"), Query.limit(1)]),
        ]);
        await users.updatePrefs<UserPrefs>(target.authorId, { ...prefs, reputation });

        return NextResponse.json({
            data: { document, voteResult: upvotes.total - downvotes.total },
            message: document ? (existingVote ? "Vote Status Updated" : "Voted") : "Vote Withdrawn",
        }, { status: document ? 201 : 200 });
    } catch (error: any) {
        return NextResponse.json({ message: error?.message || "Unable to update vote" }, { status: error?.status || error?.code || 500 });
    }
}
