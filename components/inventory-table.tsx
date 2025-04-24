"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import AddInventoryForm from "./add-inventory-form"
import { formatCurrency, formatDate } from "@/lib/utils"

export default function InventoryTable({ initialData, selectedDate }) {
  const [inventory, setInventory] = useState(initialData || [])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

  const handleInventoryAdded = (newItem) => {
    setInventory([...inventory, newItem])
    setIsAddDialogOpen(false)
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Quản lý nhập hàng</h2>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>Nhập hàng mới</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Nhập hàng mới</DialogTitle>
              </DialogHeader>
              <AddInventoryForm onInventoryAdded={handleInventoryAdded} selectedDate={selectedDate} />
            </DialogContent>
          </Dialog>
        </div>

        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mã sản phẩm</TableHead>
                <TableHead>Tên sản phẩm</TableHead>
                <TableHead>Số lượng</TableHead>
                <TableHead>Giá nhập</TableHead>
                <TableHead>Ngày nhập</TableHead>
                <TableHead>Nhà cung cấp</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inventory.length > 0 ? (
                inventory.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{item.productId}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {item.imageUrl && (
                          <img
                            src={item.imageUrl || "/placeholder.svg"}
                            alt={item.productName}
                            className="h-10 w-10 rounded-md object-cover"
                          />
                        )}
                        <span>{item.productName}</span>
                      </div>
                    </TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>{formatCurrency(item.price)}</TableCell>
                    <TableCell>{formatDate(item.date)}</TableCell>
                    <TableCell>{item.supplier}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4">
                    Không có dữ liệu nhập hàng trong tháng này
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
