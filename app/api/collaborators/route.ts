import { type NextRequest, NextResponse } from "next/server"
import { addCollaborator } from "@/app/actions/collaborator-actions"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { collaboratorData, date } = body

    const selectedDate = date ? new Date(date) : new Date()
    await addCollaborator(collaboratorData, selectedDate)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error adding collaborator:", error)
    return NextResponse.json({ error: "Failed to add collaborator" }, { status: 500 })
  }
}
