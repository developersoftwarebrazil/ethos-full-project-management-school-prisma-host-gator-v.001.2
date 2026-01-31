"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import VideoUploadWidget from "@/components/dashboards/video-lessons/VideoUploadWidget";

export default function VideoLessonForm({ relatedData }: any) {
  const router = useRouter();

  const [videoData, setVideoData] = useState<{
    secure_url: string;
    public_id: string;
    duration?: number;
  } | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!videoData) {
      setError("Faça o upload do vídeo antes de salvar.");
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);

    const title = String(formData.get("title") || "");
    const description = String(formData.get("description") || "");
    const classId = Number(formData.get("classId") || 0);
    const subjectId = Number(formData.get("subjectId") || 0);

    // 🔒 Validação FINAL antes do fetch
    if (!title || !classId || !subjectId) {
      setError("Preencha todos os campos obrigatórios.");
      setLoading(false);
      return;
    }

    const body = {
      title,
      description,
      classId,
      subjectId,
      videoUrl: videoData.secure_url,
      publicId: videoData.public_id,
      duration: videoData.duration ?? null,
    };

    console.log("📦 BODY ENVIADO:", body);

    const res = await fetch("/api/teacher/video-lessons", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      setError("Erro ao salvar aula");
      setLoading(false);
      return;
    }

    router.refresh();
    router.back();
  }

  return (
    <div className="flex flex-col gap-6">
      {/* ⬆️ Upload isolado (Cloudinary) */}
      <VideoUploadWidget onUploaded={setVideoData} />

      {videoData && (
        <p className="text-sm text-green-600">
          ✅ Vídeo enviado com sucesso
        </p>
      )}

      {/* 📝 Formulário */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input name="title" placeholder="Título" required />

        <textarea name="description" placeholder="Descrição" />

        <select name="classId" required>
          <option value="">Selecione a turma</option>
          {relatedData.classes.map((c: any) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        <select name="subjectId" required>
          <option value="">Selecione a disciplina</option>
          {relatedData.subjects.map((s: any) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>

        <button disabled={loading}>
          {loading ? "Salvando..." : "Salvar aula"}
        </button>
      </form>

      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
}
