import { type NextRequest, NextResponse } from "next/server"
import { google } from "googleapis"
import { getMonthlySheetName, SHEET_TYPES } from "@/lib/sheet-config"

// Cấu hình Google Sheets API
// const auth = new google.auth.JWT(
//   process.env.GOOGLE_CLIENT_EMAIL,
//   undefined,
//   process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
//   ["https://www.googleapis.com/auth/spreadsheets"],
// )

const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  },
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
})

const sheets = google.sheets({ version: "v4", auth })
const spreadsheetId = process.env.GOOGLE_SHEET_ID

export async function PUT(request: NextRequest) {
  try {
    const data = await request.json()
    const { rowIndex, status, selectedDate } = data

    if (isNaN(rowIndex)) {
      return NextResponse.json({ error: "ID đơn hàng không hợp lệ" }, { status: 400 })
    }

    // Cập nhật trạng thái vào Google Sheets
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `${getMonthlySheetName(SHEET_TYPES.ORDERS, selectedDate)}!I${rowIndex + 4}`, // Cột I là cột trạng thái, +1 vì hàng đầu tiên là tiêu đề
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [[status]],
      },
    })

    return NextResponse.json({ success: true, message: "Cập nhật trạng thái thành công" })
  } catch (error) {
    console.error("Lỗi khi cập nhật trạng thái:", error)
    return NextResponse.json({ error: "Đã xảy ra lỗi khi cập nhật trạng thái" }, { status: 500 })
  }
}
