"use client";

type Props = {
  contact: {
    id: number | string;
    isRead: boolean;
  };
};

export function ActionButtons({ contact }: Props) {
  const toggleRead = async () => {
    await fetch("/api/admin/contact", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: contact.id,
        isRead: !contact.isRead,
      }),
    });

    location.reload();
  };

  const remove = async () => {
    if (!confirm("Deseja excluir esta mensagem?")) return;

    await fetch("/api/admin/contact", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: contact.id }),
    });

    location.reload();
  };

  return (
    <>
      <button
        onClick={toggleRead}
        className="text-blue-600 hover:underline"
      >
        {contact.isRead ? "Marcar como nova" : "Marcar como lida"}
      </button>

      <button
        onClick={remove}
        className="text-red-600 hover:underline"
      >
        Excluir
      </button>
    </>
  );
}
