"use client";

import { CldUploadWidget } from "next-cloudinary";

export default function TestDashboardUpload() {
  return (
    <div style={{ padding: 40 }}>
      <h1>Teste upload NO DASHBOARD</h1>

      <CldUploadWidget
        uploadPreset="video_lessons"
        options={{ resourceType: "video" }}
        onSuccess={(r: any) => console.log("✅ OK", r.info)}
        onError={(e) => console.error("❌ ERRO", e)}
      >
        {({ open }) => (
          <button onClick={() => open()}>
            Abrir upload
          </button>
        )}
      </CldUploadWidget>
    </div>
  );
}
