"use server"

import { appendSheetRow } from "@/lib/google-sheets"

export async function addCollaborator(collaboratorData, date = new Date()) {
  try {
    // Format the data for Google Sheets
    const rowData = [
      collaboratorData.name,
      collaboratorData.phone,
      collaboratorData.address || "",
      collaboratorData.product,
      collaboratorData.quantity,
      collaboratorData.commission,
      collaboratorData.total,
      collaboratorData.status,
      collaboratorData.note || "",
    ]

    // Append to Google Sheet
    await appendSheetRow("CÔNG TÁC VIÊN", rowData, date)

    return { success: true }
  } catch (error) {
    console.error("Error adding collaborator:", error)
    throw new Error("Failed to add collaborator")
  }
}
