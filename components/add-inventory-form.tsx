"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import ImageUpload from "./image-upload"
import { SHEET_TYPES } from "@/lib/sheet-config"

const formSchema = z.object({
  productName: z.string().min(2, { message: "Tên sản phẩm không được để trống" }),
  quantity: z.coerce.number().min(1, { message: "Số lượng phải lớn hơn 0" }),
  price: z.coerce.number().min(1, { message: "Giá phải lớn hơn 0" }),
  supplier: z.string().min(2, { message: "Nhà cung cấp không được để trống" }),
})

export default function AddInventoryForm({ onInventoryAdded, selectedDate }) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [imageUrl, setImageUrl] = useState("")

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      productName: "",
      quantity: 1,
      price: 0,
      supplier: "",
    },
  })

  async function onSubmit(values) {
    setIsSubmitting(true)
    try {
      const inventoryData = {
        ...values,
        date: new Date().toISOString(),
        imageUrl,
        productId: `SP-${Date.now().toString().slice(-6)}`,
      }

      // Format the data for Google Sheets
      const rowData = [
        inventoryData.productId,
        inventoryData.productName,
        inventoryData.quantity,
        inventoryData.price,
        inventoryData.date,
        inventoryData.supplier,
        inventoryData.imageUrl || "",
      ]

      const response = await fetch("/api/sheets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "addRow",
          sheetType: SHEET_TYPES.INVENTORY,
          data: rowData,
          date: selectedDate.toISOString(),
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to add inventory")
      }

      onInventoryAdded(inventoryData)
      form.reset()
      setImageUrl("")
    } catch (error) {
      console.error("Error adding inventory:", error)
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
          <FormField
            control={form.control}
            name="supplier"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nhà cung cấp</FormLabel>
                <FormControl>
                  <Input placeholder="Nhập tên nhà cung cấp" {...field} />
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
                <FormLabel>Giá nhập (VNĐ)</FormLabel>
                <FormControl>
                  <Input type="number" min="0" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

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
          {isSubmitting ? "Đang xử lý..." : "Thêm sản phẩm"}
        </Button>
      </form>
    </Form>
  )
}
