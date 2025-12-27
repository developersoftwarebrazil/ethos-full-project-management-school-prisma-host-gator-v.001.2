/**
 * ================================
 * 🔐 SERVER COMPONENT
 * ================================
 */

import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

/**
 * ================================
 * 🔁 CLERK (DESATIVADO TEMPORARIAMENTE)
 * Quando voltar:
 * const { userId, sessionClaims } = auth();
 * ================================
 */

const Announcements = async () => {
  const { id: userId, role } = await requireAuth();

  const roleConditions: Record<string, any> = {
    teacher: { lessons: { some: { teacherId: userId } } },
    student: { students: { some: { id: userId } } },
    parent: { students: { some: { parentId: userId } } },
  };

  const announcements = await prisma.announcement.findMany({
    take: 3,
    orderBy: { date: "desc" },
    where: {
      ...(role !== "admin" && {
        OR: [
          { classId: null },
          {
            class: roleConditions[role] ?? {},
          },
        ],
      }),
    },
  });

  const colors = [
    "bg-lamaSkyLight",
    "bg-lamaPurpleLight",
    "bg-lamaYellowLight",
  ];

  return (
    <div className="bg-white p-4 rounded-md">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Avisos</h1>
        <span className="text-xs text-gray-400">Ver Todos</span>
      </div>

      <div className="flex flex-col gap-4 mt-4">
        {announcements.map((item, idx) => (
          <div
            key={item.id}
            className={`${colors[idx % colors.length]} rounded-md p-4`}
          >
            <div className="flex items-center justify-between">
              <h2 className="font-medium">{item.title}</h2>
              <span className="text-xs text-gray-400 bg-white rounded-md px-1 py-1">
                {new Intl.DateTimeFormat("en-GB").format(
                  new Date(item.date)
                )}
              </span>
            </div>
            <p className="text-sm text-gray-400 mt-1">
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Announcements;
