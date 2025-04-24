"use server"

import { appendSheetRow } from "@/lib/google-sheets"

export async function addInventory(inventoryData, date = new Date()) {
  try {
    // Format the data for Google Sheets
    const rowData = [
      inventoryData.productId,
      inventoryData.productName,
      inventoryData.quantity,
      inventoryData.price,
      inventoryData.date,
      inventoryData.supplier,
      inventoryData.imageUrl || "",
    ]

    // Append to Google Sheet
    await appendSheetRow("NHẬP HÀNG", rowData, date)

    return { success: true }
  } catch (error) {
    console.error("Error adding inventory:", error)
    throw new Error("Failed to add inventory")
  }
}
