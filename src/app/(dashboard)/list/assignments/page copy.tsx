import FormModal from "@/components/FormModal";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { Assignment, Class, Prisma, Subject, Teacher } from "@prisma/client";
import Image from "next/image";
import { auth } from "@clerk/nextjs/server";

type AssignmentList = Assignment & {
  lesson: {
    id: number;
    name: string;
    subject: {
      id: number;
      name: string;
    } | null;
    class: {
      id: number;
      name: string;
    } | null;
    teacher: {
      id: string;
      name: string;
      surname: string;
    } | null;
  } | null;
};


const AssignmentListPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  const { userId, sessionClaims } = auth();
  const role = (sessionClaims?.metadata as { role?: string })?.role;
  const currentUserId = userId;

  // Logging (útil para debug)
  console.log("===== ASSIGNMENT PAGE =====");
  console.log("USER:", currentUserId);
  console.log("ROLE:", role);

  const { page, ...queryParams } = searchParams;
  const p = page ? parseInt(page) : 1;

  // base query for assignments
  const baseWhere: Prisma.AssignmentWhereInput = {};

  // role-based constraints
  if (role === "teacher") {
    baseWhere.lesson = { teacherId: currentUserId! };
  } else if (role === "student") {
    baseWhere.lesson = {
      class: {
        students: { some: { id: currentUserId! } },
      },
    };
  } else if (role === "parent") {
    baseWhere.lesson = {
      class: {
        students: { some: { parentId: currentUserId! } },
      },
    };
  } // admin sees all

  // apply URL filters (classId, teacherId, search)
  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (!value) continue;
      switch (key) {
        case "classId":
          baseWhere.lesson = {
            ...(baseWhere.lesson as object),
            classId: parseInt(value),
          } as any;
          break;
        case "teacherId":
          baseWhere.lesson = {
            ...(baseWhere.lesson as object),
            teacherId: value,
          } as any;
          break;
        case "search":
          baseWhere.lesson = {
            ...(baseWhere.lesson as object),
            subject: { name: { contains: value, mode: "insensitive" } },
          } as any;
          break;
      }
    }
  }

  // fetch assignments + count in a transaction
  const [data, count] = await prisma.$transaction([
    prisma.assignment.findMany({
      where: baseWhere,
      include: {
        lesson: {
          select: {
            id: true,
            name: true, // <<<<<< CORREÇÃO IMPORTANTE
            subject: {
              select: {
                id: true,
                name: true,
              },
            },
            teacher: {
              select: {
                id: true,
                name: true,
                surname: true,
              },
            },
            class: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },

      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
      orderBy: { id: "desc" },
    }),
    prisma.assignment.count({ where: baseWhere }),
  ]);

  console.log("Assignments encontrados:", data.length);

  // fetch lessons to populate select in the create/update modal
  // teachers only get their lessons, admins get all lessons
  const lessonWhere = role === "teacher" ? { teacherId: currentUserId! } : {};
  const lessons = await prisma.lesson.findMany({
    where: lessonWhere,
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });

  const columns = [
    {
      header: "Nome da Disciplina",
      accessor: "subject",
    },
    {
      header: "Aula",
      accessor: "lesson",
    },
    {
      header: "Professor",
      accessor: "teacher",
      className: "hidden md:table-cell",
    },
    {
      header: "Data de Entrega",
      accessor: "dueDate",
      className: "hidden md:table-cell",
    },
    ...(role === "admin" || role === "teacher"
      ? [
          {
            header: "Ações",
            accessor: "action",
          },
        ]
      : []),
  ];

  const renderRow = (item: AssignmentList) => (
    <tr
      key={item.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
    >
      <td className="flex items-center gap-4 p-4">
        {item.lesson?.subject?.name ?? "—"}
      </td>
      <td>{item.lesson?.name ?? "—"}</td>
      <td className="hidden md:table-cell">
        {item.lesson?.teacher
          ? `${item.lesson.teacher.name} ${item.lesson.teacher.surname}`
          : "—"}
      </td>
      <td className="hidden md:table-cell">
        {item.dueDate
          ? new Intl.DateTimeFormat("pt-BR").format(item.dueDate)
          : "—"}
      </td>
      <td>
        <div className="flex items-center gap-2">
          {(role === "admin" || role === "teacher") && (
            <>
              <FormModal
                table="assignment"
                type="update"
                data={item}
                relatedData={{ lessons }}
              />
              <FormModal table="assignment" type="delete" id={item.id} />
            </>
          )}
        </div>
      </td>
    </tr>
  );

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">
          Todas as Tarefas
        </h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/filter.png" alt="" width={14} height={14} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/sort.png" alt="" width={14} height={14} />
            </button>
            {(role === "admin" || role === "teacher") && (
              <FormModal
                table="assignment"
                type="create"
                relatedData={{ lessons }}
              />
            )}
          </div>
        </div>
      </div>

      {/* LIST */}
      <Table columns={columns} renderRow={renderRow} data={data} />

      {/* PAGINATION */}
      <Pagination page={p} count={count} />
    </div>
  );
};

export default AssignmentListPage;
