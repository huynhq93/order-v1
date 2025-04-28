"use server"

import { appendSheetRow } from "@/lib/google-sheets"

export async function addOrder(orderData, date = new Date()) {
  try {
    console.log('-------------order-action addOrder-------------------');
    // Format the data for Google Sheets based on the actual sheet structure
    const rowData = [
      date.toString(),
      orderData.customerName,
      orderData.productImage || "",
      orderData.productName,
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
