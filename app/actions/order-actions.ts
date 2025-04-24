"use server"

import { appendSheetRow } from "@/lib/google-sheets"

export async function addOrder(orderData, date = new Date()) {
  try {
    // Format the data for Google Sheets based on the actual sheet structure
    const rowData = [
      orderData.customerName,
      orderData.productImage || "",
      orderData.productName,
      "", // Empty column for SẢN PHẨM duplicate
      orderData.color || "",
      orderData.size || "",
      orderData.quantity,
      orderData.total,
      orderData.status,
      orderData.linkFb || "",
      orderData.contactInfo || "",
      orderData.note || "",
    ]

    // Append to Google Sheet
    await appendSheetRow("BÁN HÀNG", rowData, date)

    return { success: true }
  } catch (error) {
    console.error("Error adding order:", error)
    throw new Error("Failed to add order")
  }
}
