import { NextResponse } from "next/server";
import crypto from "crypto";

import { sendResetPasswordEmail } from "@/lib/sendgrid";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    console.log("📨 [FORGOT-PASSWORD] Request recebida");

    const body = await req.json();
    const { email } = body;

    if (!email) {
      console.warn("⚠️ Email não informado");
      return NextResponse.json({ ok: true });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    // 🔐 Segurança: não revelar se usuário existe
    if (!user || !user.email) {
      return NextResponse.json({ ok: true });
    }

    /**
     * =====================================================
     * 🔐 TOKEN
     * =====================================================
     */
    const token = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const expires = new Date(Date.now() + 1000 * 60 * 60); // 1 hora

    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken: hashedToken,
        resetTokenExpires: expires,
      },
    });

    /**
     * =====================================================
     * 🌍 FRONTEND URL (AQUI É O PONTO IMPORTANTE)
     * =====================================================
     */
    const frontendUrl = process.env.NEXT_PUBLIC_FRONTEND_URL;

    if (!frontendUrl) {
      throw new Error("NEXT_PUBLIC_FRONTEND_URL não definida");
    }

    const resetUrl = `${frontendUrl}/reset-password?token=${token}`;

    console.log("🔗 Reset URL:", resetUrl);

    /**
     * =====================================================
     * 📧 ENVIO DO EMAIL
     * =====================================================
     */
    await sendResetPasswordEmail({
      to: user.email,
      name: user.name ?? "Usuário",
      resetUrl,
    });

    console.log("✅ [FORGOT-PASSWORD] Email enviado com sucesso");

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("🔥 ERRO FORGOT-PASSWORD:", error);
    return NextResponse.json(
      { error: "Erro interno" },
      { status: 500 }
    );
  }
}



// import { NextResponse } from "next/server";
// import crypto from "crypto";

// import { sendResetPasswordEmail } from "@/lib/sendgrid";
// import prisma from "@/lib/prisma";

// export async function POST(req: Request) {
//   try {
//     console.log("📨 [FORGOT-PASSWORD] Request recebida");

//     const body = await req.json();
//     console.log("📦 Body recebido:", body);

//     const { email } = body;

//     if (!email) {
//       console.warn("⚠️ Email não informado");
//       return NextResponse.json({ ok: true });
//     }

//     const user = await prisma.user.findUnique({
//       where: { email },
//     });

//     // ⚠️ Segurança: não revelar se existe ou não
//     if (!user || !user.email) {
//       console.warn("⚠️ Usuário não encontrado ou sem email:", email);
//       return NextResponse.json({ ok: true });
//     }

//     /**
//      * =====================================================
//      * 🔐 TOKEN
//      * =====================================================
//      */
//     const token = crypto.randomBytes(32).toString("hex");
//     const hashedToken = crypto
//       .createHash("sha256")
//       .update(token)
//       .digest("hex");

//     const expires = new Date(Date.now() + 1000 * 60 * 60); // 1 hora

//     await prisma.user.update({
//       where: { id: user.id },
//       data: {
//         resetToken: hashedToken,
//         resetTokenExpires: expires,
//       },
//     });

//     const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`;

//     console.log("🔗 Reset URL:", resetUrl);

//     await sendResetPasswordEmail({
//       to: user.email,
//       name: user.name ?? "Usuário",
//       resetUrl,
//     });

//     console.log("✅ [FORGOT-PASSWORD] Email enviado com sucesso");

//     return NextResponse.json({ ok: true });
//   } catch (error) {
//     console.error("🔥 ERRO FORGOT-PASSWORD:", error);
//     return NextResponse.json(
//       { error: "Erro interno" },
//       { status: 500 }
//     );
//   }
// }


// // import { NextResponse } from "next/server";
// // import crypto from "crypto";
// // import prisma from "@/lib/prisma";
// // import { sendResetPasswordEmail } from "@/lib/sendgrid";

// // export async function POST(req: Request) {
// //   const { email } = await req.json();

// //   if (!email) return NextResponse.json({ ok: true });

// //   const user = await prisma.user.findUnique({ where: { email } });
// //   if (!user) return NextResponse.json({ ok: true });

// //   const token = crypto.randomBytes(32).toString("hex");
// //   const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

// //   await prisma.user.update({
// //     where: { id: user.id },
// //     data: {
// //       resetToken: hashedToken,
// //       resetTokenExpires: new Date(Date.now() + 1000 * 60 * 60 * 2), // 2h
// //     },
// //   });

// //   // 🔹 Link atualizado para /auth/reset-password
// //   const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`;

// //   await sendResetPasswordEmail({ to: user.email!, name: user.name, resetUrl });

// //   return NextResponse.json({ ok: true });
// // }
