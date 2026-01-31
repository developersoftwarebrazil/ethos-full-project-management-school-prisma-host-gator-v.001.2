import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Upload de vídeo grande para Cloudinary (SEM limite 100MB)
 */
export async function saveVideoFile(file: File, classId: number) {
  const buffer = Buffer.from(await file.arrayBuffer());

  const folder = `school/class-${classId}`;

  const result = await new Promise<any>((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      {
        resource_type: "video",
        folder,
        chunk_size: 6_000_000, // 6MB
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    ).end(buffer);
  });

  return {
    secure_url: result.secure_url,
    public_id: result.public_id,
    duration: result.duration,
  };
}



// import { v2 as cloudinary } from "cloudinary";

// // Configurações do Cloudinary (use as mesmas do upload de fotos)
// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// /**
//  * Upload de vídeo para Cloudinary
//  * @param file File do formData
//  * @param classId number opcional para organizar pastas
//  * @returns URL pública do vídeo
//  */
// export async function saveVideoFile(file: File, classId: number) {
//   const buffer = Buffer.from(await file.arrayBuffer());

//   // Converte o vídeo para base64, que o Cloudinary aceita
//   const base64 = `data:${file.type};base64,${buffer.toString("base64")}`;

//   // Pasta no Cloudinary (opcional)
//   const folder = `school/class-${classId}`;

//   const result = await cloudinary.uploader.upload(base64, {
//     resource_type: "video",
//     folder,
//     chunk_size: 6000000, // upload em partes
//   });

//   // Retorna a URL pública do vídeo
//   return result.secure_url;
// }
