export const SHEET_TYPES = {
  ORDERS: "BÁN HÀNG",
  INVENTORY: "NHẬP HÀNG",
  COLLABORATORS: "CÔNG TÁC VIÊN",
}

export function getMonthlySheetName(baseSheetName: string, date = new Date()) {
  const month = date.getMonth() + 1 // getMonth() returns 0-11
  const year = date.getFullYear()
  return `${baseSheetName}_${month}_${year}`
}

export function formatMonthYear(date = new Date()) {
  return `${date.getMonth() + 1}/${date.getFullYear()}`
}
