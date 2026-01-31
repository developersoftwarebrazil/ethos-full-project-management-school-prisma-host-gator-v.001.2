"use client";

import { CldUploadWidget } from "next-cloudinary";

type Props = {
  onUploaded: (data: {
    secure_url: string;
    public_id: string;
    duration?: number;
  }) => void;
};

export default function VideoUploadWidget({ onUploaded }: Props) {
  console.log("🚀 VideoUploadWidget MONTADO");

  return (
    
    <CldUploadWidget
      uploadPreset="video_lessons"
      options={{
        resourceType: "video",
        maxFiles: 1,
      }}
      onSuccess={(result: any, { widget }) => {
        const info = result.info;

        console.log("✅ CLOUDINARY OK:", info);

        onUploaded({
          secure_url: info.secure_url,
          public_id: info.public_id,
          duration: info.duration,
        });

        widget.close();
      }}
      onError={(error) => {
        console.error("❌ CLOUDINARY ERROR:", error);
      }}
    >
      {({ open }) => (
        <button
          type="button"
          onClick={() => {
             console.log("🟡 CLIQUEI NO BOTÃO");
            open()
          }}
          className="px-4 py-2 rounded-md bg-black text-white"
        >
          Enviar vídeo
        </button>
      )}
    </CldUploadWidget>
  );
}
