import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const user = await getAuthUser();

    if (!user || user.role !== "teacher") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const contentType = req.headers.get("content-type") || "";

    if (!contentType.includes("application/json")) {
      return NextResponse.json(
        { error: "Content-Type inválido" },
        { status: 415 }
      );
    }

    let body: any;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { error: "JSON inválido no body" },
        { status: 400 }
      );
    }

    const title = String(body.title || "").trim();
    const description = body.description ?? null;
    const videoUrl = String(body.videoUrl || "").trim();
    const publicId = String(body.publicId || "").trim();

    const classId = Number(body.classId);
    const subjectId = Number(body.subjectId);
    const duration =
      body.duration !== undefined ? Number(body.duration) : null;

    if (
      !title ||
      !videoUrl ||
      !publicId ||
      Number.isNaN(classId) ||
      Number.isNaN(subjectId)
    ) {
      return NextResponse.json(
        { error: "Dados obrigatórios ausentes ou inválidos" },
        { status: 400 }
      );
    }

    const videoLesson = await prisma.videoLesson.create({
      data: {
        title,
        description,
        videoUrl,
        publicId,
        duration,

        teacher: {
          connect: { id: user.id },
        },

        class: {
          connect: { id: classId },
        },

        subject: {
          connect: { id: subjectId },
        },
      },
    });

    return NextResponse.json(videoLesson);
  } catch (error) {
    console.error("Erro ao criar video lesson:", error);
    return NextResponse.json(
      { error: "Erro ao criar video lesson" },
      { status: 500 }
    );
  }
}





// import prisma from "@/lib/prisma";
// import { NextResponse } from "next/server";
// import { getAuthUser } from "@/lib/auth";

// export async function POST(req: Request) {
//   try {
//     const user = await getAuthUser();

//     if (!user || user.role !== "teacher") {
//       return NextResponse.json(
//         { error: "Unauthorized" },
//         { status: 403 }
//       );
//     }

//     const body = await req.json();

//     const {
//       title,
//       description,
//       videoUrl,
//       publicId,
//       duration,
//       classId,
//       subjectId,
//     } = body;

//     if (!title || !videoUrl || !publicId || !classId || !subjectId) {
//       return NextResponse.json(
//         { error: "Dados obrigatórios ausentes" },
//         { status: 400 }
//       );
//     }

//     const videoLesson = await prisma.videoLesson.create({
//       data: {
//         title,
//         description,
//         videoUrl,
//         publicId,
//         duration,

//         teacher: {
//           connect: { id: user.id },
//         },

//         class: {
//           connect: { id: Number(classId) },
//         },

//         subject: {
//           connect: { id: Number(subjectId) },
//         },
//       },
//     });

//     return NextResponse.json(videoLesson);
//   } catch (error) {
//     console.error("Erro ao criar video lesson:", error);
//     return NextResponse.json(
//       { error: "Erro ao criar video lesson" },
//       { status: 500 }
//     );
//   }
// }
