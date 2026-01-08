import Image from "next/image";
import prisma from "@/lib/prisma";
import Table from "@/components/ui/tables/Table";
import TableSearch from "@/components/ui/tables/TableSearch";
import Pagination from "@/components/ui/tables/Pagination";
import FormModal from "@/components/forms/base/FormModal";
import AttendanceChartContainer from "@/components/dashboards/charts/AttendanceChartContainer";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { Attendance, Prisma } from "@prisma/client";
import { getAuthRole, getCurrentUserId } from "@/lib/auth";

// import { auth } from "@clerk/nextjs/server";

type AttendanceList = Attendance & {
  student: {
    id: string;
    name: string;
    surname: string;
  };
  lesson: {
    id: number;
    name: string;
  };
};

const AttendanceListPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  /**
   * ================================
   * 🔐 AUTH LOCAL (ATIVO)
   * ================================
   */
  const role = await getAuthRole();
  const currentUserId = await getCurrentUserId();

  /**
   * ================================
   * 🔁 CLERK (DESATIVADO)
   * ================================
   */
  // const { userId, sessionClaims } = auth();
  // const role = (sessionClaims?.metadata as { role?: string })?.role;
  // const currentUserId = userId;

  const { page, ...queryParams } = searchParams;
  const p = page ? parseInt(page) : 1;

  // BASE QUERY
  const baseWhere: Prisma.AttendanceWhereInput = {};

  // ROLE FILTERS
  if (role === "teacher") {
    baseWhere.lesson = { teacherId: currentUserId! };
  } else if (role === "student") {
    baseWhere.studentId = currentUserId!;
  } else if (role === "parent") {
    baseWhere.student = { parentId: currentUserId! };
  }

  // URL FILTERS
  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (!value) continue;

      switch (key) {
        case "lessonId":
          baseWhere.lessonId = parseInt(value);
          break;
        case "status":
          baseWhere.status = value as any;
          break;
        case "search":
          baseWhere.student = {
            ...(baseWhere.student as object),
            name: { contains: value, mode: "insensitive" },
          };
          break;
      }
    }
  }

  // FETCH DATA
  const [data, count] = await prisma.$transaction([
    prisma.attendance.findMany({
      where: baseWhere,
      include: {
        student: { select: { id: true, name: true, surname: true } },
        lesson: { select: { id: true, name: true } },
      },
      orderBy: { date: "desc" },
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
    }),
    prisma.attendance.count({
      where: baseWhere,
    }),
  ]);

  // LOAD LESSONS
  const lessons = await prisma.lesson.findMany({
    where: role === "teacher" ? { teacherId: currentUserId! } : {},
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });

  // LOAD STUDENTS (necessário para AttendanceForm)
  const students = await prisma.student.findMany({
    select: { id: true, name: true, surname: true },
    orderBy: { name: "asc" },
  });

  // COLUMNS
  const columns = [
    { header: "Aluno", accessor: "student" },
    { header: "Aula", accessor: "lesson" },
    { header: "Data", accessor: "date", className: "hidden md:table-cell" },
    { header: "Status", accessor: "status", className: "hidden md:table-cell" },
    ...(role === "admin" || role === "teacher"
      ? [{ header: "Ações", accessor: "action" }]
      : []),
  ];

  // RENDER ROW
  const renderRow = (item: AttendanceList) => (
    <tr
      key={item.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
    >
      <td className="p-4">
        {item.student.name} {item.student.surname}
      </td>

      <td>{item.lesson.name}</td>

      <td className="hidden md:table-cell">
        {new Intl.DateTimeFormat("pt-BR").format(item.date)}
      </td>

      <td className="hidden md:table-cell">{item.status}</td>

      <td>
        {(role === "admin" || role === "teacher") && (
          <div className="flex items-center gap-2">
            {/* UPDATE */}
            <FormModal
              table="attendance"
              type="update"
              data={item}
              relatedData={{ lessons, students }}
            />

            {/* DELETE */}
            <FormModal table="attendance" type="delete" id={item.id} />
          </div>
        )}
      </td>
    </tr>
  );

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">
          Todas as Presenças
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
                table="attendance"
                type="create"
                relatedData={{ lessons, students }}
              />
            )}
          </div>
        </div>
      </div>

      {/* CHART */}
      <div className="my-6">
        <AttendanceChartContainer />
      </div>

      {/* LIST */}
      <Table columns={columns} renderRow={renderRow} data={data} />

      {/* PAGINATION */}
      <Pagination page={p} count={count} />
    </div>
  );
};

export default AttendanceListPage;
