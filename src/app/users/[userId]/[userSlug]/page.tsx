import { databases, users } from "@/models/server/config";
import { UserPrefs } from "@/store/Auth";
import React from "react";
import NumberTicker from "@/components/magicui/number-ticker";
import { answerCollection, db, questionCollection } from "@/models/name";
import { Query } from "node-appwrite";
import { StatCard, Surface } from "@/components/design-system";
import { Award, MessageSquare, PenLine } from "lucide-react";
import { calculateReputation } from "@/lib/reputation";

const Page = async ({ params }: { params: Promise<{ userId: string; userSlug: string }> }) => {
    const { userId } = await params;
    const [user, questions, answers, reputation] = await Promise.all([
        users.get<UserPrefs>(userId),
        databases.listDocuments(db, questionCollection, [
            Query.equal("authorId", userId),
            Query.limit(1), // for optimization
        ]),
        databases.listDocuments(db, answerCollection, [
            Query.equal("authorId", userId),
            Query.limit(1), // for optimization
        ]),
        calculateReputation(userId),
    ]);

    return (
        <div className="space-y-5">
            <div className="grid gap-4 md:grid-cols-3">
                <StatCard label="Reputation" value={<NumberTicker value={reputation} />} detail="Answers and votes received" />
                <StatCard label="Questions" value={<NumberTicker value={questions.total} />} detail="Questions posted" />
                <StatCard label="Answers" value={<NumberTicker value={answers.total} />} detail="Answers submitted" />
            </div>
            <Surface>
                <h2 className="font-semibold">Profile summary</h2>
                <div className="mt-4 grid gap-3 md:grid-cols-3">
                    <p className="flex items-center gap-3 rounded-md border bg-[hsl(var(--panel-strong))] p-3 text-sm"><Award className="size-4 text-[hsl(var(--brand))]" /> Reputation shows user activity.</p>
                    <p className="flex items-center gap-3 rounded-md border bg-[hsl(var(--panel-strong))] p-3 text-sm"><PenLine className="size-4 text-[hsl(var(--brand))]" /> Questions posted by this user.</p>
                    <p className="flex items-center gap-3 rounded-md border bg-[hsl(var(--panel-strong))] p-3 text-sm"><MessageSquare className="size-4 text-[hsl(var(--brand))]" /> Answers submitted by this user.</p>
                </div>
            </Surface>
        </div>
    );
};

export default Page;
