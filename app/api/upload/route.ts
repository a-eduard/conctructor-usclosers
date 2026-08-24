import { NextRequest, NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

// Initialize S3 Client using your specific AWS_ env variables
const s3Client = new S3Client({
  region: process.env.AWS_REGION || "us-east-1",
  endpoint: process.env.AWS_S3_ENDPOINT,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
  forcePathStyle: true, // Required for MinIO
});

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const folder = formData.get("folder") as string || "solutions";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    
    // Create a unique file name
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const extension = file.name.split(".").pop();
    const fileName = `${folder}/img-${uniqueSuffix}.${extension}`;

    const bucketName = process.env.AWS_S3_BUCKET || "usclosers-order";

    // Upload to S3/MinIO
    await s3Client.send(
      new PutObjectCommand({
        Bucket: bucketName,
        Key: fileName,
        Body: buffer,
        ContentType: file.type,
        // Removed ACL: "public-read" to prevent AccessDenied errors
      })
    );

    return NextResponse.json({ 
      success: true, 
      filePath: `/${fileName}` 
    });

  } catch (error) {
    console.error("Error uploading to S3:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}