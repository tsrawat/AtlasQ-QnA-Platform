"use client";

import React from "react";

export const VOTE_COUNT_EVENT = "atlasq:vote-count";

type VoteCountDetail = {
    type: "question" | "answer";
    typeId: string;
    count: number;
};

export function publishVoteCount(detail: VoteCountDetail) {
    window.dispatchEvent(new CustomEvent<VoteCountDetail>(VOTE_COUNT_EVENT, { detail }));
}

export default function VoteCount({
    type,
    typeId,
    initialCount,
}: Omit<VoteCountDetail, "count"> & { initialCount: number }) {
    const [count, setCount] = React.useState(initialCount);

    React.useEffect(() => {
        const updateCount = (event: Event) => {
            const { detail } = event as CustomEvent<VoteCountDetail>;
            if (detail.type === type && detail.typeId === typeId) setCount(detail.count);
        };

        window.addEventListener(VOTE_COUNT_EVENT, updateCount);
        return () => window.removeEventListener(VOTE_COUNT_EVENT, updateCount);
    }, [type, typeId]);

    return count;
}
