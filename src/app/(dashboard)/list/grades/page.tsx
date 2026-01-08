import FormContainer from "@/components/FormContainer";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { Grade, Prisma } from "@prisma/client";
import Image from "next/image";
import { auth } from "@clerk/nextjs/server";
import { getAuthRole } from "@/lib/auth";

const GradeListPage = async ({
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

  /**
   * ================================
   * 🔁 CLERK (DESATIVADO)
   * ================================
   */
  //
  // const { sessionClaims } = auth();
  // const role = (sessionClaims?.metadata as { role?: string })?.role;

  const columns = [
    {
      header: "Nível / Série / Semestre",
      accessor: "level",
    },
    {
      header: "Descrição",
      accessor: "description",
    },
    ...(role === "admin"
      ? [
          {
            header: "Ações",
            accessor: "action",
          },
        ]
      : []),
  ];

  const renderRow = (item: Grade) => (
    <tr
      key={item.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-ethosPurpleLight"
    >
      <td className="p-4">{item.level}</td>
      <td className="hidden md:table-cell">{item.description}</td>
      {role === "admin" && (
        <td>
          <div className="flex items-center gap-2">
            <FormContainer table="grade" type="update" data={item} />
            <FormContainer table="grade" type="delete" id={item.id} />
          </div>
        </td>
      )}
    </tr>
  );

  const { page, ...queryParams } = searchParams;
  const p = page ? parseInt(page) : 1;

  // 🔍 Filtros da URL
  const query: Prisma.GradeWhereInput = {};

  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value !== undefined) {
        switch (key) {
          case "search":
            const num = parseInt(value);
            if (!isNaN(num)) {
              query.level = { equals: num };
            }
            break;

          default:
            break;
        }
      }
    }
  }

  // 🔧 Busca dados e total
  const [data, count] = await prisma.$transaction([
    prisma.grade.findMany({
      where: query,
      take: ITEM_PER_PAGE,
      skip: ITEM_PER_PAGE * (p - 1),
      orderBy: { id: "asc" },
    }),
    prisma.grade.count({ where: query }),
  ]);

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOPO */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">
          Todas as Séries / Níveis
        </h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-ethosYellow">
              <Image src="/filter.png" alt="Filtrar" width={14} height={14} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-ethosYellow">
              <Image src="/sort.png" alt="Ordenar" width={14} height={14} />
            </button>
            {role === "admin" && <FormContainer table="grade" type="create" />}
          </div>
        </div>
      </div>

      {/* TABELA */}
      <Table columns={columns} renderRow={renderRow} data={data} />

      {/* PAGINAÇÃO */}
      <Pagination page={p} count={count} />
    </div>
  );
};

export default GradeListPage;
