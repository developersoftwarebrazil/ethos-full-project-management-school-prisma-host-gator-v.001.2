"use client";

import { useState } from "react";

type Props = {
  contact: {
    id: number;
    name: string;
    email: string;
    message: string;
  };
  onClose: () => void;
};

export default function ContactReplyForm({ contact, onClose }: Props) {
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    setLoading(true);

    await fetch("/api/admin/contact/reply", {
      method: "POST",
      body: JSON.stringify({
        id: contact.id,
        reply,
      }),
    });

    setLoading(false);
    onClose();
    location.reload();
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <div className="bg-white rounded-xl w-full max-w-lg p-6 space-y-4 shadow-xl">
        <h2 className="text-lg font-semibold">
          Responder {contact.name}
        </h2>

        <div className="text-sm bg-slate-50 border rounded p-3">
          <p className="font-medium mb-1">Mensagem recebida:</p>
          <p className="text-slate-700">{contact.message}</p>
        </div>

        <textarea
          className="w-full border rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500"
          rows={5}
          placeholder="Digite sua resposta..."
          value={reply}
          onChange={(e) => setReply(e.target.value)}
        />

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm rounded border"
          >
            Cancelar
          </button>

          <button
            onClick={handleSubmit}
            disabled={!reply || loading}
            className="px-4 py-2 text-sm rounded bg-blue-600 text-white disabled:opacity-50"
          >
            {loading ? "Enviando..." : "Enviar resposta"}
          </button>
        </div>
      </div>
    </div>
  );
}
