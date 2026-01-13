import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

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
    const fromName = process.env.SENDGRID_FROM_NAME || "Equipe Ethos CPAC Cursos integrados";

    console.log("📨 SendGrid → Tentando enviar para:", to);
    console.log("📤 From:", fromEmail, fromName);

    await sgMail.send({
      to,
      from: {
        email: fromEmail,
        name: fromName,
      },
      subject: "Em resposta à sua mensagem",
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

    console.log("✅ SendGrid → Email enviado com sucesso!");
  } catch (error: any) {
    console.error("❌ ERRO SENDGRID:", error?.response?.body || error);
    throw error;
  }
}
