"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import AddOrderForm from "./add-order-form"
import OrderDetails from "./order-details"
import { formatCurrency } from "@/lib/utils"
import { Copy, Edit, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function OrdersTable({ initialData, selectedDate }) {
  const { toast } = useToast()
  const [orders, setOrders] = useState(initialData || [])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [statusUpdating, setStatusUpdating] = useState<Record<string, boolean>>({})

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

  const tableRef = useRef(null);

  const scrollToBottom = () => {
    if (tableRef.current) {
      tableRef.current.scrollTop = tableRef.current.scrollHeight;
    }
  };

  const scrollToTop = () => {
    if (tableRef.current) {
      tableRef.current.scrollTop = 0;
    }
  };

  const handleStatusChange = async (rowIndex: number, newStatus: string) => {
    setStatusUpdating((prev) => ({ ...prev, [rowIndex]: true }))

    try {
      const response = await fetch("/api/orders/status", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ rowIndex, status: newStatus }),
      })

      if (!response.ok) {
        throw new Error("Không thể cập nhật trạng thái")
      }

      // Cập nhật state
      setOrders((prevOrders) =>
        prevOrders.map((order) => (order.rowIndex === rowIndex ? { ...order, status: newStatus } : order)),
      )

      toast({
        title: "Thành công",
        description: "Đã cập nhật trạng thái đơn hàng",
      })
    } catch (err) {
      toast({
        title: "Lỗi",
        description: err instanceof Error ? err.message : "Đã xảy ra lỗi khi cập nhật trạng thái",
        variant: "destructive",
      })
    } finally {
      setStatusUpdating((prev) => ({ ...prev, [rowIndex]: false }))
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

        <div className="rounded-md border">
          <div className="flex flex-col max-h-[450px]" ref={tableRef}>
            <Table className="">
              <TableHeader className="flex-grow overflow-auto">
                <TableRow>
                  <TableHead className="bg-gray-100 text-gray-700 uppercase text-sm sticky top-0 z-10">DATE</TableHead>
                  <TableHead className="bg-gray-100 text-gray-700 uppercase text-sm sticky top-0 z-10">TÊN KH</TableHead>
                  <TableHead className="bg-gray-100 text-gray-700 uppercase text-sm sticky top-0 z-10">HÌNH ẢNH</TableHead>
                  <TableHead className="bg-gray-100 text-gray-700 uppercase text-sm sticky top-0 z-10">SẢN PHẨM</TableHead>
                  <TableHead className="bg-gray-100 text-gray-700 uppercase text-sm sticky top-0 z-10">MÀU SẮC</TableHead>
                  <TableHead className="bg-gray-100 text-gray-700 uppercase text-sm sticky top-0 z-10">SIZE</TableHead>
                  <TableHead className="bg-gray-100 text-gray-700 uppercase text-sm sticky top-0 z-10">SL</TableHead>
                  <TableHead className="bg-gray-100 text-gray-700 uppercase text-sm sticky top-0 z-10">TỔNG</TableHead>
                  <TableHead className="bg-gray-100 text-gray-700 uppercase text-sm sticky top-0 z-10">TRẠNG THÁI</TableHead>
                  <TableHead className="bg-gray-100 text-gray-700 uppercase text-sm sticky top-0 z-10"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.length > 0 ? (
                  orders.map((order, index) => (
                    <TableRow key={index}>
                      <TableCell>{order.date}</TableCell>
                      <TableCell className="font-medium max-w-[250px] truncate cursor-pointer">{order.customerName}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {order.productImage && (
                            <img
                              src={order.productImage || "/placeholder.svg"}
                              alt={order.productName}
                              className="h-10 w-10 rounded-md object-cover"
                            />
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{order.productName}</TableCell>
                      <TableCell>{order.color}</TableCell>
                      <TableCell>{order.size}</TableCell>
                      <TableCell>{order.quantity}</TableCell>
                      <TableCell>{formatCurrency(order.total)}</TableCell>
                      <TableCell>
                        {statusUpdating[order.rowIndex] ? (
                          <div className="flex items-center">
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            Đang cập nhật...
                          </div>
                        ) : (
                          <Select
                            value={order.status}
                            onValueChange={(value) => handleStatusChange(order.rowIndex, value, selectedDate)}
                          >
                            <SelectTrigger className={`w-[140px] ${getStatusColor(order.status)}`}>
                              <SelectValue placeholder="Trạng thái" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="NHẬN ĐƠN">NHẬN ĐƠN</SelectItem>
                              <SelectItem value="ĐANG GIAO">ĐANG GIAO</SelectItem>
                              <SelectItem value="ĐANG CHỜ GIAO">ĐANG CHỜ GIAO</SelectItem>
                              <SelectItem value="Hủy">HUỶ</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      </TableCell>
                      {/* <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </TableCell> */}
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
        </div>
        

        {/* Nút cuộn */}
      <div className="flex justify-between p-2">
        <Button onClick={scrollToTop}>Lên trên</Button>
        <Button onClick={scrollToBottom}>Cuối</Button>
      </div>
      </CardContent>
    </Card>
  )
}
