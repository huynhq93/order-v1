"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import OrdersTable from "@/components/orders-table"
import InventoryTable from "@/components/inventory-table"
import CollaboratorsTable from "@/components/collaborators-table"
import MonthSelector from "@/components/month-selector"
import { SHEET_TYPES } from "@/lib/sheet-config"

export default function Home() {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [ordersData, setOrdersData] = useState([])
  const [inventoryData, setInventoryData] = useState([])
  const [collaboratorsData, setCollaboratorsData] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true)
      try {
        const month = selectedDate.getMonth() + 1
        const year = selectedDate.getFullYear()

        const ordersResponse = await fetch(
          `/api/sheets?action=getData&type=${SHEET_TYPES.ORDERS}&month=${month}&year=${year}`,
        )
        const inventoryResponse = await fetch(
          `/api/sheets?action=getData&type=${SHEET_TYPES.INVENTORY}&month=${month}&year=${year}`,
        )
        const collaboratorsResponse = await fetch(
          `/api/sheets?action=getData&type=${SHEET_TYPES.COLLABORATORS}&month=${month}&year=${year}`,
        )

        const ordersJson = await ordersResponse.json()
        const inventoryJson = await inventoryResponse.json()
        const collaboratorsJson = await collaboratorsResponse.json()

        setOrdersData(ordersJson.data || [])
        setInventoryData(inventoryJson.data || [])
        setCollaboratorsData(collaboratorsJson.data || [])
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [selectedDate])

  const handleDateChange = (date) => {
    setSelectedDate(date)
  }

  return (
    <main className="container mx-auto py-10 space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold">Quản lý bán hàng</h1>
        <MonthSelector onChange={handleDateChange} initialDate={selectedDate} />
      </div>

      <Tabs defaultValue="orders">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="orders">Đơn hàng</TabsTrigger>
          <TabsTrigger value="inventory">Nhập hàng</TabsTrigger>
          <TabsTrigger value="collaborators">Cộng tác viên</TabsTrigger>
        </TabsList>
        <TabsContent value="orders" className="mt-6">
          {isLoading ? (
            <div className="flex justify-center py-10">Đang tải dữ liệu...</div>
          ) : (
            <OrdersTable initialData={ordersData} selectedDate={selectedDate} />
          )}
        </TabsContent>
        <TabsContent value="inventory" className="mt-6">
          {isLoading ? (
            <div className="flex justify-center py-10">Đang tải dữ liệu...</div>
          ) : (
            <InventoryTable initialData={inventoryData} selectedDate={selectedDate} />
          )}
        </TabsContent>
        <TabsContent value="collaborators" className="mt-6">
          {isLoading ? (
            <div className="flex justify-center py-10">Đang tải dữ liệu...</div>
          ) : (
            <CollaboratorsTable initialData={collaboratorsData} selectedDate={selectedDate} />
          )}
        </TabsContent>
      </Tabs>
    </main>
  )
}
