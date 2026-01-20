import sgMail from "@sendgrid/mail";

console.log("📦 [SENDGRID] Módulo carregado");

if (!process.env.SENDGRID_API_KEY) {
  console.error("❌ SENDGRID_API_KEY não definida");
} else {
  console.log("✅ SENDGRID_API_KEY encontrada");
}

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

/* =========================================================
   📩 EMAIL DE RESPOSTA (CONTATO)
========================================================= */
export async function sendReplyEmail({
  to,
  name,
  message,
  reply,
}: {
  to: string;
  name: string;
  message: string;
  reply: string;
}) {
  try {
    const fromEmail = process.env.SENDGRID_FROM_EMAIL!;
    const fromName =
      process.env.SENDGRID_FROM_NAME ||
      "Equipe Ethos CPAC Cursos Integrados";

    console.log("📨 [SENDGRID] Reply Email");
    console.log("➡️ To:", to);
    console.log("⬅️ From:", fromEmail, fromName);

    await sgMail.send({
      to,
      from: {
        email: fromEmail,
        name: fromName,
      },
      subject: "Resposta à sua mensagem",
      html: `
        <div style="font-family: Arial, sans-serif; line-height:1.6">
          <h2>Olá, ${name}!</h2>

          <p>Recebemos sua mensagem:</p>
          <blockquote style="border-left:4px solid #ccc;padding-left:12px;">
            ${message}
          </blockquote>

          <p><strong>Nossa resposta:</strong></p>
          <p>${reply}</p>

          <br />
          <p>Atenciosamente,<br/><strong>${fromName}</strong></p>
        </div>
      `,
    });

    console.log("✅ [SENDGRID] Reply enviado com sucesso");
  } catch (error: any) {
    console.error("🔥 [SENDGRID] ERRO REPLY");

    if (error.response) {
      console.error("📛 Status:", error.response.statusCode);
      console.error("📛 Body:", error.response.body);
    } else {
      console.error(error);
    }

    throw error;
  }
}

/* =========================================================
   🔐 EMAIL DE RESET DE SENHA
========================================================= */
export async function sendResetPasswordEmail({
  to,
  name,
  resetUrl,
}: {
  to: string;
  name: string;
  resetUrl: string;
}) {
  try {
    const fromEmail = process.env.SENDGRID_FROM_EMAIL!;
    const fromName =
      process.env.SENDGRID_FROM_NAME ||
      "Equipe Ethos CPAC Cursos Integrados";

    console.log("📨 [SENDGRID] Reset Password");
    console.log("➡️ To:", to);
    console.log("⬅️ From:", fromEmail, fromName);
    console.log("🔗 Reset URL:", resetUrl);

    await sgMail.send({
      to,
      from: {
        email: fromEmail,
        name: fromName,
      },
      subject: "Redefinição de senha - Ethos",
      html: `
        <p>Olá <strong>${name}</strong>,</p>

        <p>Recebemos uma solicitação para redefinir sua senha.</p>

        <p>
          <a href="${resetUrl}">
            Clique aqui para criar uma nova senha
          </a>
        </p>

        <p>Este link expira em 1 hora.</p>

        <p>Se você não solicitou isso, ignore este email.</p>
      `,
    });

    console.log("✅ [SENDGRID] Reset enviado com sucesso");
  } catch (error: any) {
    console.error("🔥 [SENDGRID] ERRO RESET PASSWORD");

    if (error.response) {
      console.error("📛 Status:", error.response.statusCode);
      console.error("📛 Body:", error.response.body);
    } else {
      console.error(error);
    }

    throw error;
  }
}


// import sgMail from "@sendgrid/mail";

// sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

// export async function sendReplyEmail({
//   to,
//   name,
//   message,
//   reply,
// }: {
//   to: string;
//   name: string;
//   message: string;
//   reply: string;
// }) {
//   try {
//     const fromEmail = process.env.SENDGRID_FROM_EMAIL!;
//     const fromName = process.env.SENDGRID_FROM_NAME || "Equipe Ethos CPAC Cursos integrados";

//     console.log("📨 SendGrid → Tentando enviar para:", to);
//     console.log("📤 From:", fromEmail, fromName);

//     await sgMail.send({
//       to,
//       from: {
//         email: fromEmail,
//         name: fromName,
//       },
//       subject: "Resposta à sua mensagem",
//       html: `
//         <div style="font-family: Arial, sans-serif; line-height:1.6">
//           <h2>Olá, ${name}!</h2>

//           <p>Recebemos sua mensagem:</p>
//           <blockquote style="border-left:4px solid #ccc;padding-left:12px;">
//             ${message}
//           </blockquote>

//           <p><strong>Nossa resposta:</strong></p>
//           <p>${reply}</p>

//           <br />
//           <p>Atenciosamente,<br/><strong>${fromName}</strong></p>
//         </div>
//       `,
//     });

//     console.log("✅ SendGrid → Email enviado com sucesso!");
//   } catch (error: any) {
//     console.error("❌ ERRO SENDGRID:", error?.response?.body || error);
//     throw error;
//   }
// }
// export async function sendResetPasswordEmail({
//   to,
//   name,
//   resetUrl,
// }: {
//   to: string;
//   name: string;
//   resetUrl: string;
// }) {
//   const fromEmail =
//     process.env.SENDGRID_FROM_EMAIL || "no-reply@ethos.com";

//   await sgMail.send({
//     to,
//     from: fromEmail,
//     subject: "Redefinição de senha - Ethos",
//     html: `
//       <p>Olá <strong>${name}</strong>,</p>

//       <p>Recebemos uma solicitação para redefinir sua senha.</p>

//       <p>
//         <a href="${resetUrl}">
//           Clique aqui para criar uma nova senha
//         </a>
//       </p>

//       <p>Este link expira em 1 hora.</p>

//       <p>Se você não solicitou isso, ignore este email.</p>
//     `,
//   });
// }
