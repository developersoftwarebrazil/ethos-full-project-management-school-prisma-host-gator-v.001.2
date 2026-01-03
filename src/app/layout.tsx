import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import localFont from "next/font/local";

const inter = localFont({
  src: [
    { path: "../fonts/Inter-Regular.woff2", weight: "400" },
    { path: "../fonts/Inter-Medium.woff2", weight: "500" },
    { path: "../fonts/Inter-SemiBold.woff2", weight: "600" },
    { path: "../fonts/Inter-Bold.woff2", weight: "700" },
  ],
  variable: "--font-inter",
  display: "swap",
});

// export const metadata: Metadata = {
//   title: "Plataforma Ethos CPAC Escola de Psícologia",
//   description: "Ethos CPAC Escola de psicologia",
// };
export const metadata: Metadata = {
  title: {
    default: "ETHOS CPAC – Gestão Escolar",
    template: "%s | ETHOS",
  },
  description:
    "Sistema de gestão escolar para administração de alunos, professores, turmas e comunicação institucional.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          {children} <ToastContainer position="bottom-right" theme="dark" />
        </body>
      </html>
    // </ClerkProvider>
  );
}
