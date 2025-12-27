/**
 * ================================
 * 🔁 CLERK (DESATIVADO TEMPORARIAMENTE)
 * Quando voltar a usar Clerk:
 * 1) Descomente os imports abaixo
 * 2) Comente a lógica de auth local
 * ================================
 */

// import { auth } from "@clerk/nextjs/server";

import prisma from "@/lib/prisma";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";

type Announcement = {
  id: string;
  title: string;
  description: string;
  date: Date;
  classId: string | null;
};

const Announcements = () => {
  const [role, setRole] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [data, setData] = useState<Announcement[]>([]);

  useEffect(() => {
    /**
     * 🔐 AUTH LOCAL
     * Lê cookie de sessão criado no login local
     */
    const session = Cookies.get("session");
    if (session) {
      try {
        const parsed = JSON.parse(session);
        setRole(parsed.role ?? "guest");
        setUserId(parsed.id ?? null);
      } catch (err) {
        console.error("Erro ao ler cookie de sessão:", err);
      }
    }

    /**
     * 🔁 CLERK (DESATIVADO)
     * const { userId, sessionClaims } = auth();
     * const role = sessionClaims?.metadata?.role;
     */
  }, []);

  useEffect(() => {
    if (!role) return;

    const fetchAnnouncements = async () => {
      try {
        const roleConditions: any = {
          teacher: { lessons: { some: { teacherId: userId! } } },
          student: { students: { some: { id: userId! } } },
          parent: { students: { some: { parentId: userId! } } },
        };

        const announcements = await prisma.announcement.findMany({
          take: 3,
          orderBy: { date: "desc" },
          where: {
            ...(role !== "admin" && {
              OR: [
                { classId: null },
                { class: roleConditions[role as keyof typeof roleConditions] || {} },
              ],
            }),
          },
        });

        // 🔁 Conversão de id e classId para string (Opção 1)
        const mappedAnnouncements = announcements.map((a) => ({
          ...a,
          id: a.id.toString(),
          classId: a.classId ? a.classId.toString() : null,
        }));

        setData(mappedAnnouncements);
      } catch (err) {
        console.error("Erro ao buscar anúncios:", err);
      }
    };

    fetchAnnouncements();
  }, [role, userId]);

  if (!role) return null;

  const colors = ["bg-lamaSkyLight", "bg-lamaPurpleLight", "bg-lamaYellowLight"];

  return (
    <div className="bg-white p-4 rounded-md">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Avisos</h1>
        <span className="text-xs text-gray-400">Ver Todos</span>
      </div>
      <div className="flex flex-col gap-4 mt-4">
        {data.map((item, idx) => (
          <div key={item.id} className={`${colors[idx % colors.length]} rounded-md p-4`}>
            <div className="flex items-center justify-between">
              <h2 className="font-medium">{item.title}</h2>
              <span className="text-xs text-gray-400 bg-white rounded-md px-1 py-1">
                {new Intl.DateTimeFormat("en-GB").format(new Date(item.date))}
              </span>
            </div>
            <p className="text-sm text-gray-400 mt-1">{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Announcements;
