import { answerCollection, db, questionCollection, voteCollection } from "@/models/name";
import { databases } from "@/models/server/config";
import { Query } from "node-appwrite";

/**
 * AtlasQ awards one point for each answer and +/- one point for each vote
 * received by a user's questions or answers. Calculating from source records
 * prevents stored preferences from drifting after a vote changes or is removed.
 */
export async function calculateReputation(userId: string) {
    const [questions, answers] = await Promise.all([
        databases.listDocuments(db, questionCollection, [Query.equal("authorId", userId), Query.select(["$id"]), Query.limit(5000)]),
        databases.listDocuments(db, answerCollection, [Query.equal("authorId", userId), Query.select(["$id"]), Query.limit(5000)]),
    ]);

    const getVoteTotals = async (type: "question" | "answer", ids: string[]) => {
        if (ids.length === 0) return { upvotes: 0, downvotes: 0 };
        const [upvotes, downvotes] = await Promise.all([
            databases.listDocuments(db, voteCollection, [Query.equal("type", type), Query.equal("typeId", ids), Query.equal("voteStatus", "upvoted"), Query.limit(1)]),
            databases.listDocuments(db, voteCollection, [Query.equal("type", type), Query.equal("typeId", ids), Query.equal("voteStatus", "downvoted"), Query.limit(1)]),
        ]);
        return { upvotes: upvotes.total, downvotes: downvotes.total };
    };

    const [questionVotes, answerVotes] = await Promise.all([
        getVoteTotals("question", questions.documents.map(question => question.$id)),
        getVoteTotals("answer", answers.documents.map(answer => answer.$id)),
    ]);

    return answers.total + questionVotes.upvotes - questionVotes.downvotes + answerVotes.upvotes - answerVotes.downvotes;
}
