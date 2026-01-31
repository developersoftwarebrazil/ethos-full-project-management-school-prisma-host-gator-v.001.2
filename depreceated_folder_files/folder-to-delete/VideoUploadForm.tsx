"use client";

import { useState } from "react";

type Props = {
  classId: number;
  subjectId: number;
};

export default function VideoUploadForm({ classId, subjectId }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file || !title) return;

    const formData = new FormData();
    formData.append("video", file);
    formData.append("title", title);
    formData.append("classId", String(classId));
    formData.append("subjectId", String(subjectId));

    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/teacher/video-lessons");

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        setProgress(Math.round((event.loaded / event.total) * 100));
      }
    };

    xhr.onload = () => {
      setLoading(false);
      setProgress(0);
      setFile(null);
      setTitle("");
      alert("Vídeo enviado com sucesso!");
    };

    xhr.onerror = () => {
      setLoading(false);
      alert("Erro ao enviar vídeo");
    };

    setLoading(true);
    xhr.send(formData);
  };

  return (
    <div className="bg-white p-4 rounded-md space-y-4">
      <h2 className="text-lg font-semibold">📤 Nova Videoaula</h2>

      {/* Drag & Drop */}
      <label
        className="border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50"
      >
        <input
          type="file"
          accept="video/*"
          hidden
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />
        <span className="text-sm text-gray-600">
          {file ? file.name : "Arraste o vídeo ou clique para selecionar"}
        </span>
      </label>

      {/* Título */}
      <input
        type="text"
        placeholder="Título da aula"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full border rounded-md p-2"
      />

      {/* Progress */}
      {loading && (
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-ethosPurple h-2 rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      <button
        onClick={handleUpload}
        disabled={!file || !title || loading}
        className="w-full bg-ethosPurple text-white py-2 rounded-md disabled:opacity-50"
      >
        {loading ? "Enviando..." : "Enviar vídeo"}
      </button>
    </div>
  );
}
