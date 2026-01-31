"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CldUploadWidget } from "next-cloudinary";

type VideoLessonFormProps = {
  type: "create" | "update";
  data?: any;
  relatedData: {
    classes: { id: number; name: string }[];
    subjects: { id: number; name: string }[];
  };
};

const VideoLessonForm = ({ type, data, relatedData }: VideoLessonFormProps) => {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [videoData, setVideoData] = useState<{
    secure_url: string;
    public_id: string;
    duration?: number;
  } | null>(
    data?.videoUrl
      ? {
          secure_url: data.videoUrl,
          public_id: data.publicId,
          duration: data.duration,
        }
      : null,
  );

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);

    try {
      if (type === "create" && !videoData) {
        throw new Error("Faça o upload do vídeo antes de salvar.");
      }

      const body = {
        title: formData.get("title"),
        description: formData.get("description"),
        classId: Number(formData.get("classId")),
        subjectId: Number(formData.get("subjectId")),
        videoUrl: videoData?.secure_url,
        publicId: videoData?.public_id,
        duration: videoData?.duration,
      };

      const res = await fetch(
        type === "create"
          ? "/api/teacher/video-lessons"
          : `/api/teacher/video-lessons/${data.id}`,
        {
          method: type === "create" ? "POST" : "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        },
      );

      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error || "Erro ao salvar aula");
      }

      router.refresh();
      router.back();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {/* TÍTULO */}
      <div>
        <label>Título</label>
        <input name="title" defaultValue={data?.title || ""} required />
      </div>

      {/* DESCRIÇÃO */}
      <div>
        <label>Descrição</label>
        <textarea name="description" defaultValue={data?.description || ""} />
      </div>

      {/* TURMA */}
      <div>
        <label>Turma</label>
        <select name="classId" defaultValue={data?.classId || ""} required>
          <option value="">Selecione</option>
          {relatedData.classes.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* DISCIPLINA */}
      <div>
        <label>Disciplina</label>
        <select name="subjectId" defaultValue={data?.subjectId || ""} required>
          <option value="">Selecione</option>
          {relatedData.subjects.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
      </div>

      {/* UPLOAD DE VÍDEO (Cloudinary Widget) */}
      <div className="flex flex-col gap-2">
        <label>Vídeo</label>

        {/* <CldUploadWidget
          options={{
            resourceType: "video",
            maxFiles: 1,
          }}
          onSuccess={(result: any, { widget }) => {
            const info = result.info;

            setVideoData({
              secure_url: info.secure_url,
              public_id: info.public_id,
              duration: info.duration,
            });

            widget.close();
          }}
          onError={() => {
            setError("Erro ao enviar vídeo");
          }}
        >
          {({ open }) => (
            <button type="button" onClick={() => open()}>
              {videoData ? "Trocar vídeo" : "Enviar vídeo"}
            </button>
          )}
        </CldUploadWidget> */}

        <CldUploadWidget
          uploadPreset="video_lessons"
          options={{ resourceType: "video" }}
          onSuccess={(res) => console.log("SUCESSO:", res)}
          onError={(err) => console.error("ERRO:", err)}
        >
          {({ open }) => (
            <button onClick={() => open()}>TESTAR UPLOAD DE VÍDEO</button>
          )}
        </CldUploadWidget>

        {videoData && (
          <p className="text-sm text-green-600">✅ Vídeo enviado com sucesso</p>
        )}
      </div>

      {error && <p className="text-red-500">{error}</p>}

      <button disabled={loading}>
        {loading
          ? "Salvando..."
          : type === "create"
            ? "Criar Aula"
            : "Atualizar Aula"}
      </button>
    </form>
  );
};

export default VideoLessonForm;
