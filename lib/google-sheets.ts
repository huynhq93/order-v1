"use server"

import { google } from "googleapis"

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

// Get sheet name with month and year
export async function getMonthlySheetName(baseSheetName, date = new Date()) {
  const month = date.getMonth() + 1 // getMonth() returns 0-11
  const year = date.getFullYear()
  return `${baseSheetName}_${month}_${year}`
}

// Get all available monthly sheets
export async function getAvailableMonthlySheets(baseSheetName) {
  try {
    const sheets = await getGoogleSheetsClient()
    const spreadsheetId = process.env.GOOGLE_SHEET_ID

    const response = await sheets.spreadsheets.get({
      spreadsheetId,
    })

    const sheetList = response.data.sheets || []
    return sheetList
      .map((sheet) => sheet.properties?.title || "")
      .filter((title) => title.startsWith(`${baseSheetName}_`))
  } catch (error) {
    console.error(`Error fetching sheets for ${baseSheetName}:`, error)
    return []
  }
}

// Create a new monthly sheet if it doesn't exist
export async function createMonthlySheetIfNotExists(baseSheetName, date = new Date()) {
  try {
    const sheetName = getMonthlySheetName(baseSheetName, date)
    const sheets = await getGoogleSheetsClient()
    const spreadsheetId = process.env.GOOGLE_SHEET_ID

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
      if (baseSheetName === "BÁN HÀNG") {
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
      } else if (baseSheetName === "NHẬP HÀNG") {
        headers = [["MÃ SP", "TÊN SP", "SỐ LƯỢNG", "GIÁ NHẬP", "NGÀY NHẬP", "NHÀ CUNG CẤP", "HÌNH ẢNH"]]
      } else if (baseSheetName === "CÔNG TÁC VIÊN") {
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
export async function getSheetData(baseSheetName, date = new Date()) {
  try {

    // In a real implementation, this would be:
    /*
    const sheets = await getGoogleSheetsClient()
    const spreadsheetId = process.env.GOOGLE_SHEET_ID
    
    // Create the sheet if it doesn't exist
    await createMonthlySheetIfNotExists(baseSheetName, date)
    
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `${sheetName}!A:Z`,
    })
    
    const rows = response.data.values || []
    
    // Map the data based on the sheet structure
    if (baseSheetName === "BÁN HÀNG") {
      // Skip the first 3 rows (headers)
      return rows.slice(3).map(row => {
        return {
          customerName: row[0] || '',
          productImage: row[1] || '',
          productName: row[2] || '',
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
    } else if (baseSheetName === "NHẬP HÀNG") {
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
    } else if (baseSheetName === "CÔNG TÁC VIÊN") {
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
    */
  } catch (error) {
    console.error(`Error fetching ${baseSheetName} data:`, error)
    return []
  }
}

// Append a row to a specific sheet
export async function appendSheetRow(baseSheetName, rowData, date = new Date()) {
  try {
    const sheetName = getMonthlySheetName(baseSheetName, date)
    console.log('-------------gg sheet appendSheetRow-------------------');
    // For demo purposes, we'll just log the data
    console.log(`Appending to ${sheetName}:`, rowData)

    // In a real implementation, this would append to Google Sheets
    /*
    const sheets = await getGoogleSheetsClient()
    const spreadsheetId = process.env.GOOGLE_SHEET_ID
    
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
    if (baseSheetName === "BÁN HÀNG") {
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
    */

    return true
  } catch (error) {
    console.error(`Error appending to ${baseSheetName}:`, error)
    throw new Error(`Failed to append to ${baseSheetName}`)
  }
}
