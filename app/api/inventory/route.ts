import { type NextRequest, NextResponse } from "next/server"
import { addInventory } from "@/app/actions/inventory-actions"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { inventoryData, date } = body

    const selectedDate = date ? new Date(date) : new Date()
    await addInventory(inventoryData, selectedDate)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error adding inventory:", error)
    return NextResponse.json({ error: "Failed to add inventory" }, { status: 500 })
  }
}
