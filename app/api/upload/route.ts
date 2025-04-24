import { type NextRequest, NextResponse } from "next/server"
import { put } from "@vercel/blob"
import { v2 as cloudinary } from 'cloudinary';
import streamifier from "streamifier"

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // const filename = `${Date.now()}-${file.name}`
    // const blob = await put(filename, file, {
    //   access: "public",
    // })
    // Convert file to base64
    // const base64Data = await new Promise((resolve, reject) => {
    //   const reader = new FileReader();
    //   reader.readAsDataURL(file);
    //   reader.onload = () => resolve(reader.result);
    //   reader.onerror = (error) => reject(error);
    // });
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Upload to Cloudinary
    // const result = await new Promise((resolve, reject) => {
    //   cloudinary.uploader.upload(
    //     base64Data as string,
    //     {
    //       folder: 'orders', // Thư mục lưu trữ ảnh trên Cloudinary
    //     },
    //     (error, result) => {
    //       if (error) reject(error);
    //       resolve(result);
    //     }
    //   );
    // });
    const result: any = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "orders",
        },
        (error, result) => {
          if (error) return reject(error)
          resolve(result)
        }
      )
      streamifier.createReadStream(buffer).pipe(uploadStream)
    })

    // return (result as any).secure_url;

    return NextResponse.json({ url: (result as any).secure_url })
  } catch (error) {
    console.error("Error uploading file:", error)
    return NextResponse.json({ error: "Failed to upload file" }, { status: 500 })
  }
}
