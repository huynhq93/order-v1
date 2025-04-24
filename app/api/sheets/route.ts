import { type NextRequest, NextResponse } from "next/server"
import { google } from "googleapis"
import { getMonthlySheetName, SHEET_TYPES } from "@/lib/sheet-config"

// Initialize Google Sheets API
async function getGoogleSheetsClient() {
  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      },
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    })

    const sheets = google.sheets({ version: "v4", auth })
    return sheets
  } catch (error) {
    console.error("Error initializing Google Sheets client:", error)
    throw new Error("Failed to initialize Google Sheets")
  }
}

// Create a new monthly sheet if it doesn't exist
async function createMonthlySheetIfNotExists(baseSheetName: string, date = new Date()) {
  try {
    const sheetName = getMonthlySheetName(baseSheetName, date)
    const sheets = await getGoogleSheetsClient()
    const spreadsheetId = process.env.GOOGLE_SHEET_ID

    if (!spreadsheetId) {
      throw new Error("GOOGLE_SHEET_ID is not defined")
    }

    // Check if sheet already exists
    const response = await sheets.spreadsheets.get({
      spreadsheetId,
    })

    const sheetExists = response.data.sheets?.some((sheet) => sheet.properties?.title === sheetName)

    if (!sheetExists) {
      // Create new sheet
      await sheets.spreadsheets.batchUpdate({
        spreadsheetId,
        requestBody: {
          requests: [
            {
              addSheet: {
                properties: {
                  title: sheetName,
                },
              },
            },
          ],
        },
      })

      // Add headers based on sheet type
      let headers = []
      if (baseSheetName === SHEET_TYPES.ORDERS) {
        headers = [
          ["", "", "", "", "", "", "TỔNG", "0", "THÀNH CÔNG", "0 đ"],
          ["", "", "", "", "", "", "", "", "", "", "", ""],
          [
            "TÊN KH",
            "SẢN PHẨM",
            "SẢN PHẨM",
            "MÀU SẮC/PHÂN LOẠI",
            "SIZE",
            "SL",
            "TỔNG",
            "THÀNH CÔNG",
            "LINK FB",
            "SĐT+ĐỊA CHỈ",
            "NOTE",
          ],
        ]
      } else if (baseSheetName === SHEET_TYPES.INVENTORY) {
        headers = [["MÃ SP", "TÊN SP", "SỐ LƯỢNG", "GIÁ NHẬP", "NGÀY NHẬP", "NHÀ CUNG CẤP", "HÌNH ẢNH"]]
      } else if (baseSheetName === SHEET_TYPES.COLLABORATORS) {
        headers = [["TÊN CTV", "SĐT", "ĐỊA CHỈ", "SẢN PHẨM", "SỐ LƯỢNG", "HOA HỒNG", "TỔNG", "TRẠNG THÁI", "GHI CHÚ"]]
      }

      // Add headers to the new sheet
      if (headers.length > 0) {
        await sheets.spreadsheets.values.update({
          spreadsheetId,
          range: `${sheetName}!A1`,
          valueInputOption: "USER_ENTERED",
          resource: {
            values: headers,
          },
        })
      }
    }

    return sheetName
  } catch (error) {
    console.error(`Error creating sheet for ${baseSheetName}:`, error)
    throw new Error(`Failed to create sheet for ${baseSheetName}`)
  }
}

// Get data from a specific sheet
async function getSheetData(baseSheetName: string, date = new Date()) {
  try {
    const sheetName = getMonthlySheetName(baseSheetName, date)

    // For demo purposes, we'll return mock data based on the actual sheet structure
    // In a real implementation, this would fetch from Google Sheets

    // if (baseSheetName === SHEET_TYPES.ORDERS) {
    //   return [
    //     {
    //       customerName: "THÁI QUỲNH NHƯ",
    //       productImage: "/placeholder.svg?height=200&width=200",
    //       productName: "Áo thun",
    //       color: "Đen",
    //       size: "6",
    //       quantity: 1,
    //       total: 99000,
    //       status: "NHẬN ĐƠN",
    //       linkFb: "",
    //       contactInfo: "",
    //       note: "",
    //       month: `${date.getMonth() + 1}/${date.getFullYear()}`,
    //     },
    //     {
    //       customerName: "NGUYEN NHO TUONG LINH",
    //       productImage: "/placeholder.svg?height=200&width=200",
    //       productName: "Áo thun",
    //       color: "",
    //       size: "7",
    //       quantity: 1,
    //       total: 119000,
    //       status: "NHẬN ĐƠN",
    //       linkFb: "",
    //       contactInfo: "",
    //       note: "",
    //       month: `${date.getMonth() + 1}/${date.getFullYear()}`,
    //     },
    //   ]
    // } else if (baseSheetName === SHEET_TYPES.INVENTORY) {
    //   return [
    //     {
    //       productId: "SP001",
    //       productName: "Áo thun",
    //       quantity: 10,
    //       price: 80000,
    //       date: "2023-04-10T08:30:00Z",
    //       supplier: "Nhà cung cấp A",
    //       imageUrl: "/placeholder.svg?height=200&width=200",
    //       month: `${date.getMonth() + 1}/${date.getFullYear()}`,
    //     },
    //     {
    //       productId: "SP002",
    //       productName: "Quần short",
    //       quantity: 5,
    //       price: 70000,
    //       date: "2023-04-12T10:15:00Z",
    //       supplier: "Nhà cung cấp B",
    //       imageUrl: "/placeholder.svg?height=200&width=200",
    //       month: `${date.getMonth() + 1}/${date.getFullYear()}`,
    //     },
    //   ]
    // } else if (baseSheetName === SHEET_TYPES.COLLABORATORS) {
    //   return [
    //     {
    //       name: "Nguyễn Văn A",
    //       phone: "0123456789",
    //       address: "Hà Nội",
    //       product: "Áo thun",
    //       quantity: 2,
    //       commission: 20000,
    //       total: 40000,
    //       status: "Đã thanh toán",
    //       note: "",
    //       month: `${date.getMonth() + 1}/${date.getFullYear()}`,
    //     },
    //     {
    //       name: "Trần Thị B",
    //       phone: "0987654321",
    //       address: "TP HCM",
    //       product: "Quần short",
    //       quantity: 1,
    //       commission: 15000,
    //       total: 15000,
    //       status: "Chưa thanh toán",
    //       note: "",
    //       month: `${date.getMonth() + 1}/${date.getFullYear()}`,
    //     },
    //   ]
    // }

    // // If we get here, return empty array
    // return []

    // In a real implementation, this would be:
    const sheets = await getGoogleSheetsClient()
    const spreadsheetId = process.env.GOOGLE_SHEET_ID
    console.log(spreadsheetId)
    
    if (!spreadsheetId) {
      throw new Error("GOOGLE_SHEET_ID is not defined")
    }
    
    // Create the sheet if it doesn't exist
    await createMonthlySheetIfNotExists(baseSheetName, date)
    
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `${sheetName}!A:Z`,
    })
    
    const rows = response.data.values || []
    
    // Map the data based on the sheet structure
    if (baseSheetName === SHEET_TYPES.ORDERS) {
      console.log('--------------------------------')
      console.log(response)
      // Skip the first 3 rows (headers)
      return rows.slice(3).map(row => {
        return {
          date: row[0] || '',
          customerName: row[1] || '',
          productImage: row[2] || '',
          productName: row[3] || '',
          color: row[4] || '',
          size: row[5] || '',
          quantity: row[6] || 0,
          total: row[7] || 0,
          status: row[8] || '',
          linkFb: row[9] || '',
          contactInfo: row[10] || '',
          note: row[11] || '',
          month: `${date.getMonth() + 1}/${date.getFullYear()}`,
        }
      }).filter(item => item.customerName); // Filter out empty rows
    } else if (baseSheetName === SHEET_TYPES.INVENTORY) {
      // Skip the first row (header)
      return rows.slice(1).map(row => {
        return {
          productId: row[0] || '',
          productName: row[1] || '',
          quantity: row[2] || 0,
          price: row[3] || 0,
          date: row[4] || '',
          supplier: row[5] || '',
          imageUrl: row[6] || '',
          month: `${date.getMonth() + 1}/${date.getFullYear()}`,
        }
      }).filter(item => item.productName); // Filter out empty rows
    } else if (baseSheetName === SHEET_TYPES.COLLABORATORS) {
      // Skip the first row (header)
      return rows.slice(1).map(row => {
        return {
          name: row[0] || '',
          phone: row[1] || '',
          address: row[2] || '',
          product: row[3] || '',
          quantity: row[4] || 0,
          commission: row[5] || 0,
          total: row[6] || 0,
          status: row[7] || '',
          note: row[8] || '',
          month: `${date.getMonth() + 1}/${date.getFullYear()}`,
        }
      }).filter(item => item.name); // Filter out empty rows
    }
    
    return []
  } catch (error) {
    console.error(`Error fetching ${baseSheetName} data:`, error)
    return []
  }
}

// Append a row to a specific sheet
async function appendSheetRow(baseSheetName: string, rowData: any[], date = new Date()) {
  try {
    const sheetName = getMonthlySheetName(baseSheetName, date)

    // For demo purposes, we'll just log the data
    console.log(`Appending to ${sheetName}:`, rowData)

    // In a real implementation, this would append to Google Sheets
    const sheets = await getGoogleSheetsClient()
    const spreadsheetId = process.env.GOOGLE_SHEET_ID
    
    if (!spreadsheetId) {
      throw new Error("GOOGLE_SHEET_ID is not defined")
    }
    
    // Create the sheet if it doesn't exist
    await createMonthlySheetIfNotExists(baseSheetName, date)
    
    // Determine the next empty row
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `${sheetName}!A:A`,
    })
    
    const rows = response.data.values || []
    let nextRow = rows.length + 1
    
    // For BÁN HÀNG sheet, we need to start after the header rows
    if (baseSheetName === SHEET_TYPES.ORDERS) {
      nextRow = Math.max(nextRow, 4) // Start at row 4 (after headers)
    } else {
      nextRow = Math.max(nextRow, 2) // Start at row 2 (after header)
    }
    
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `${sheetName}!A${nextRow}`,
      valueInputOption: 'USER_ENTERED',
      resource: {
        values: [rowData]
      }
    })

    return true
  } catch (error) {
    console.error(`Error appending to ${baseSheetName}:`, error)
    throw new Error(`Failed to append to ${baseSheetName}`)
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const action = searchParams.get("action")
    const sheetType = searchParams.get("type")
    const month = searchParams.get("month")
    const year = searchParams.get("year")

    if (!action || !sheetType) {
      return NextResponse.json({ error: "Action and sheet type are required" }, { status: 400 })
    }

    let date = new Date()
    if (month && year) {
      date = new Date(Number.parseInt(year), Number.parseInt(month) - 1, 1)
    }

    if (action === "getData") {
      const data = await getSheetData(sheetType, date)
      return NextResponse.json({ data })
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  } catch (error) {
    console.error("Error processing request:", error)
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, sheetType, data, date: dateString } = body

    if (!action || !sheetType) {
      return NextResponse.json({ error: "Action and sheet type are required" }, { status: 400 })
    }

    const date = dateString ? new Date(dateString) : new Date()

    if (action === "addRow") {
      if (!data || !Array.isArray(data)) {
        return NextResponse.json({ error: "Data must be an array" }, { status: 400 })
      }

      await appendSheetRow(sheetType, data, date)
      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  } catch (error) {
    console.error("Error processing request:", error)
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 })
  }
}
