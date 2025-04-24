"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import AddOrderForm from "./add-order-form"
import OrderDetails from "./order-details"
import { formatCurrency } from "@/lib/utils"

export default function OrdersTable({ initialData, selectedDate }) {
  const [orders, setOrders] = useState(initialData || [])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState(null)

  const handleOrderAdded = (newOrder) => {
    setOrders([...orders, newOrder])
    setIsAddDialogOpen(false)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "NHẬN ĐƠN":
        return "bg-blue-100 text-blue-800"
      case "ĐANG GIAO":
        return "bg-yellow-100 text-yellow-800"
      case "ĐANG CHỜ GIAO":
        return "bg-orange-100 text-orange-800"
      case "HOÀN THÀNH":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Danh sách đơn hàng</h2>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>Thêm đơn hàng</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Thêm đơn hàng mới</DialogTitle>
              </DialogHeader>
              <AddOrderForm onOrderAdded={handleOrderAdded} selectedDate={selectedDate} />
            </DialogContent>
          </Dialog>
        </div>

        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>DATE</TableHead>
                <TableHead>TÊN KH</TableHead>
                <TableHead>SẢN PHẨM</TableHead>
                <TableHead>HÌNH ẢNH</TableHead>
                <TableHead>MÀU SẮC</TableHead>
                <TableHead>SIZE</TableHead>
                <TableHead>SL</TableHead>
                <TableHead>TỔNG</TableHead>
                <TableHead>TRẠNG THÁI</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.length > 0 ? (
                orders.map((order, index) => (
                  <TableRow key={index}>
                    <TableCell>{order.date}</TableCell>
                    <TableCell className="font-medium">{order.customerName}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {order.productImage && (
                          <img
                            src={order.productImage || "/placeholder.svg"}
                            alt={order.productName}
                            className="h-10 w-10 rounded-md object-cover"
                          />
                        )}
                        <span>{order.productName}</span>
                      </div>
                    </TableCell>
                    <TableCell>{order.productName}</TableCell>
                    <TableCell>{order.color}</TableCell>
                    <TableCell>{order.size}</TableCell>
                    <TableCell>{order.quantity}</TableCell>
                    <TableCell>{formatCurrency(order.total)}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="sm" onClick={() => setSelectedOrder(order)}>
                            Chi tiết
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[600px]">
                          <DialogHeader>
                            <DialogTitle>Chi tiết đơn hàng</DialogTitle>
                          </DialogHeader>
                          {selectedOrder && <OrderDetails order={selectedOrder} />}
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-4">
                    Không có đơn hàng nào trong tháng này
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
