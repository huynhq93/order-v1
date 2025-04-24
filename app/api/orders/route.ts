import { type NextRequest, NextResponse } from "next/server"
import { addOrder } from "@/app/actions/order-actions"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { orderData, date } = body

    const selectedDate = date ? new Date(date) : new Date()
    await addOrder(orderData, selectedDate)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error adding order:", error)
    return NextResponse.json({ error: "Failed to add order" }, { status: 500 })
  }
}
