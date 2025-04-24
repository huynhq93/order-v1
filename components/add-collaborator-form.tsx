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
import { SHEET_TYPES } from "@/lib/sheet-config"

const formSchema = z.object({
  name: z.string().min(2, { message: "Tên cộng tác viên phải có ít nhất 2 ký tự" }),
  phone: z.string().min(10, { message: "Số điện thoại không hợp lệ" }),
  address: z.string().optional(),
  product: z.string().min(2, { message: "Tên sản phẩm không được để trống" }),
  quantity: z.coerce.number().min(1, { message: "Số lượng phải lớn hơn 0" }),
  commission: z.coerce.number().min(1, { message: "Hoa hồng phải lớn hơn 0" }),
  status: z.string(),
  note: z.string().optional(),
})

export default function AddCollaboratorForm({ onCollaboratorAdded, selectedDate }) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      phone: "",
      address: "",
      product: "",
      quantity: 1,
      commission: 0,
      status: "Chưa thanh toán",
      note: "",
    },
  })

  async function onSubmit(values) {
    setIsSubmitting(true)
    try {
      const collaboratorData = {
        ...values,
        total: values.quantity * values.commission,
      }

      // Format the data for Google Sheets
      const rowData = [
        collaboratorData.name,
        collaboratorData.phone,
        collaboratorData.address || "",
        collaboratorData.product,
        collaboratorData.quantity,
        collaboratorData.commission,
        collaboratorData.total,
        collaboratorData.status,
        collaboratorData.note || "",
      ]

      const response = await fetch("/api/sheets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "addRow",
          sheetType: SHEET_TYPES.COLLABORATORS,
          data: rowData,
          date: selectedDate.toISOString(),
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to add collaborator")
      }

      onCollaboratorAdded(collaboratorData)
      form.reset()
    } catch (error) {
      console.error("Error adding collaborator:", error)
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
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tên cộng tác viên</FormLabel>
                <FormControl>
                  <Input placeholder="Nhập tên cộng tác viên" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Số điện thoại</FormLabel>
                <FormControl>
                  <Input placeholder="Nhập số điện thoại" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Địa chỉ</FormLabel>
              <FormControl>
                <Input placeholder="Nhập địa chỉ" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="product"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sản phẩm</FormLabel>
                <FormControl>
                  <Input placeholder="Nhập tên sản phẩm" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="commission"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Hoa hồng (VNĐ)</FormLabel>
                <FormControl>
                  <Input type="number" min="0" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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
                    <SelectItem value="Chưa thanh toán">Chưa thanh toán</SelectItem>
                    <SelectItem value="Đã thanh toán">Đã thanh toán</SelectItem>
                  </SelectContent>
                </Select>
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

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Đang xử lý..." : "Thêm cộng tác viên"}
        </Button>
      </form>
    </Form>
  )
}
