"use client";

import { useState } from "react";
import { MailCheck, MailOpen, Trash2, Reply } from "lucide-react";
import ContactReplyForm from "@/components/forms/ContactReplyForm";

type Props = {
  contact: {
    id: number;
    isRead: boolean;
    email: string;
    name: string;
    message: string;
  };
};

export default function ContactActionButtons({ contact }: Props) {
  const [loading, setLoading] = useState(false);
  const [replyOpen, setReplyOpen] = useState(false);

  async function toggleRead() {
    setLoading(true);
    await fetch("/api/admin/contact", {
      method: "PATCH",
      body: JSON.stringify({
        id: contact.id,
        isRead: !contact.isRead,
      }),
    });
    setLoading(false);
    location.reload();
  }

  async function remove() {
    if (!confirm("Deseja excluir esta mensagem?")) return;
    setLoading(true);

    await fetch("/api/admin/contact", {
      method: "DELETE",
      body: JSON.stringify({ id: contact.id }),
    });

    location.reload();
  }

  return (
    <div className="flex justify-end gap-3">
      {/* RESPONDER */}
      <button
        onClick={() => setReplyOpen(true)}
        className="text-blue-600 hover:text-blue-800 transition"
        title="Responder mensagem"
      >
        <Reply size={18} />
      </button>

      {/* LER / NÃO LER */}
      <button
        onClick={toggleRead}
        disabled={loading}
        className="text-slate-600 hover:text-slate-800 transition"
        title={contact.isRead ? "Marcar como nova" : "Marcar como lida"}
      >
        {contact.isRead ? (
          <MailOpen size={18} />
        ) : (
          <MailCheck size={18} />
        )}
      </button>

      {/* EXCLUIR */}
      <button
        onClick={remove}
        disabled={loading}
        className="text-red-600 hover:text-red-800 transition"
        title="Excluir mensagem"
      >
        <Trash2 size={18} />
      </button>

      {/* MODAL DE RESPOSTA */}
      {replyOpen && (
        <ContactReplyForm
          contact={contact}
          onClose={() => setReplyOpen(false)}
        />
      )}
    </div>
  );
}
