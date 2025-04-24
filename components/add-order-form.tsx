"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import ImageUpload from "./image-upload"
import { SHEET_TYPES } from "@/lib/sheet-config"

const formSchema = z.object({
  customerName: z.string().min(2, { message: "Tên khách hàng phải có ít nhất 2 ký tự" }),
  productName: z.string().min(2, { message: "Tên sản phẩm không được để trống" }),
  color: z.string().optional(),
  size: z.string().optional(),
  quantity: z.coerce.number().min(1, { message: "Số lượng phải lớn hơn 0" }),
  price: z.coerce.number().min(1, { message: "Giá phải lớn hơn 0" }),
  status: z.string(),
  linkFb: z.string().optional(),
  contactInfo: z.string().optional(),
  note: z.string().optional(),
})

export default function AddOrderForm({ onOrderAdded, selectedDate }) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [imageUrl, setImageUrl] = useState("")

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      customerName: "",
      productName: "",
      color: "",
      size: "",
      quantity: 1,
      price: 0,
      status: "NHẬN ĐƠN",
      linkFb: "",
      contactInfo: "",
      note: "",
    },
  })

  async function onSubmit(values) {
    setIsSubmitting(true)
    try {
      const orderData = {
        ...values,
        productImage: imageUrl,
        total: values.price * values.quantity,
      }

      // Format the data for Google Sheets
      const rowData = [
        orderData.customerName,
        orderData.productImage || "",
        orderData.productName,
        "", // Empty column for SẢN PHẨM duplicate
        orderData.color || "",
        orderData.size || "",
        orderData.quantity,
        orderData.total,
        orderData.status,
        orderData.linkFb || "",
        orderData.contactInfo || "",
        orderData.note || "",
      ]

      const response = await fetch("/api/sheets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "addRow",
          sheetType: SHEET_TYPES.ORDERS,
          data: rowData,
          date: selectedDate.toISOString(),
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to add order")
      }

      onOrderAdded(orderData)
      form.reset()
      setImageUrl("")
    } catch (error) {
      console.error("Error adding order:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="customerName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tên khách hàng</FormLabel>
                <FormControl>
                  <Input placeholder="Nhập tên khách hàng" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="productName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tên sản phẩm</FormLabel>
                <FormControl>
                  <Input placeholder="Nhập tên sản phẩm" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="color"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Màu sắc</FormLabel>
                <FormControl>
                  <Input placeholder="Nhập màu sắc" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="size"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Size</FormLabel>
                <FormControl>
                  <Input placeholder="Nhập size" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="quantity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Số lượng</FormLabel>
                <FormControl>
                  <Input type="number" min="1" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Giá (VNĐ)</FormLabel>
                <FormControl>
                  <Input type="number" min="0" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Trạng thái</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn trạng thái" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="NHẬN ĐƠN">NHẬN ĐƠN</SelectItem>
                  <SelectItem value="ĐANG GIAO">ĐANG GIAO</SelectItem>
                  <SelectItem value="ĐANG CHỜ GIAO">ĐANG CHỜ GIAO</SelectItem>
                  <SelectItem value="HOÀN THÀNH">HOÀN THÀNH</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="linkFb"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Link FB</FormLabel>
                <FormControl>
                  <Input placeholder="Nhập link Facebook" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="contactInfo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>SĐT + Địa chỉ</FormLabel>
                <FormControl>
                  <Input placeholder="Nhập SĐT và địa chỉ" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="note"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ghi chú</FormLabel>
              <FormControl>
                <Textarea placeholder="Nhập ghi chú (nếu có)" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div>
          <FormLabel>Hình ảnh sản phẩm</FormLabel>
          <ImageUpload onImageUploaded={setImageUrl} />
          {imageUrl && (
            <div className="mt-2">
              <img src={imageUrl || "/placeholder.svg"} alt="Product" className="h-24 w-auto object-cover rounded-md" />
            </div>
          )}
        </div>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Đang xử lý..." : "Thêm đơn hàng"}
        </Button>
      </form>
    </Form>
  )
}
