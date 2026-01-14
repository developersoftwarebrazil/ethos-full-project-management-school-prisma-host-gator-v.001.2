import prisma from "@/lib/prisma";
import { ActionButtons } from "../src/app/(dashboard)/admin/contacts/ActionButtons";

export default async function AdminContactsPage() {
  const contacts = await prisma.contact.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">📬 Mensagens da Landing Page</h1>

      <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-slate-100 text-left">
            <tr>
              <th className="p-3">Nome</th>
              <th className="p-3">Email</th>
              <th className="p-3">Mensagem</th>
              <th className="p-3">Data</th>
              <th className="p-3"></th>
              <th className="p-3 text-right">Ações</th>
            </tr>
          </thead>

          <tbody>
            {contacts.map((c) => (
              <tr
                key={c.id}
                className={`border-t ${!c.isRead ? "bg-yellow-50" : ""}`}
              >
                <td className="p-3 font-medium">{c.name}</td>
                <td className="p-3">{c.email}</td>
                <td className="p-3 max-w-sm truncate">{c.message}</td>
                <td className="p-3">
                  {new Date(c.createdAt).toLocaleDateString("pt-BR")}
                </td>
                <td className="p-3 space-y-1">
                  {/* Status de leitura */}
                  {c.isRead ? (
                    <span className="block text-green-600 font-semibold">
                      Lida
                    </span>
                  ) : (
                    <span className="block text-yellow-600 font-semibold">
                      Nova
                    </span>
                  )}

                  {/* Status de resposta */}
                  <span
                    className={`inline-block text-xs font-medium px-2 py-1 rounded-full ${
                      c.repliedAt
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {c.repliedAt ? "Respondido" : "Pendente"}
                  </span>
                </td>

                <td className="p-3 text-right space-x-2">
                  <ActionButtons contact={c} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {contacts.length === 0 && (
          <p className="p-6 text-center text-gray-500">
            Nenhuma mensagem recebida.
          </p>
        )}
      </div>
    </div>
  );
}
