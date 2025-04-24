"use server"

import { put } from "@vercel/blob"
import { revalidatePath } from "next/cache"

export async function uploadImage(file) {
  try {
    const filename = `${Date.now()}-${file.name}`

    const blob = await put(filename, file, {
      access: "public",
    })

    revalidatePath("/")
    return blob.url
  } catch (error) {
    console.error("Error uploading to Vercel Blob:", error)
    throw new Error("Failed to upload image")
  }
}
