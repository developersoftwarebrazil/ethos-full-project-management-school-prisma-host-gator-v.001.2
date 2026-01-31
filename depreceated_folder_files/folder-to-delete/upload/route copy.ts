import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { v2 as cloudinary } from "cloudinary";
import { IncomingForm } from "formidable";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req: Request) {
  try {
    const user = await getAuthUser();

    if (!user || user.role !== "teacher") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const form = new IncomingForm({
      keepExtensions: true,
    });

    const { files } = await new Promise<any>((resolve, reject) => {
      form.parse(req as any, (err, fields, files) => {
        if (err) reject(err);
        resolve({ fields, files });
      });
    });

    const videoFile = Array.isArray(files.video)
      ? files.video[0]
      : files.video;

    if (!videoFile) {
      return NextResponse.json(
        { error: "Vídeo não enviado" },
        { status: 400 }
      );
    }

    const result = await cloudinary.uploader.upload(videoFile.filepath, {
      resource_type: "video",
      upload_preset: "school", // pode manter
      folder: `video-lessons/teacher-${user.id}`,
    });

    return NextResponse.json({
      url: result.secure_url,
      publicId: result.public_id,
      duration: result.duration,
    });
  } catch (error) {
    console.error("Erro ao fazer upload do vídeo:", error);
    return NextResponse.json(
      { error: "Falha no upload do vídeo" },
      { status: 500 }
    );
  }
}
