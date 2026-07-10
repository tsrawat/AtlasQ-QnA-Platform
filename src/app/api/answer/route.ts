import { answerCollection, db } from "@/models/name";
import { databases, users } from "@/models/server/config";
import { NextRequest, NextResponse } from "next/server";
import { ID } from "node-appwrite";
import {UserPrefs} from "@/store/Auth"
import { calculateReputation } from "@/lib/reputation";

export async function POST(request: NextRequest){
  try {
    const {questionId, answer, authorId} = await request.json();

    const response = await databases.createDocument(db, answerCollection, ID.unique(), {
      content: answer,
      authorId: authorId,
      questionId: questionId
    })

    // Recalculate from answers and received votes so the stored value remains accurate.
    const prefs = await users.getPrefs<UserPrefs>(authorId)
    await users.updatePrefs(authorId, {
      ...prefs,
      reputation: await calculateReputation(authorId)
    })

    return NextResponse.json(response, {
      status: 201
    })

  } catch (error: any) {
    return NextResponse.json(
      {
        error: error?.message || "Error creating answer"
      },
      {
        status: error?.status || error?.code || 500
      }
    )
  }
}

export async function DELETE(request: NextRequest){
  try {
    const {answerId} = await request.json()

    const answer = await databases.getDocument(db, answerCollection, answerId)

    const response = await databases.deleteDocument(db, answerCollection, answerId)

    // Recalculate after removing the answer rather than decrementing a stale value.
    const prefs = await users.getPrefs<UserPrefs>(answer.authorId)
    await users.updatePrefs(answer.authorId, {
      ...prefs,
      reputation: await calculateReputation(answer.authorId)
    })

    return NextResponse.json(
      {data: response},
      {status: 200}
  )



  } catch (error: any) {
    return NextResponse.json(
      {
        message: error?.message || "Error deleting the answer"
      },
      {
        status: error?.status || error?.code || 500
      }
    )
  }
}
