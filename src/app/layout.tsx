import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

import { ClerkProvider } from "@clerk/nextjs";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const inter = localFont({
  src: [
    { path: "../fonts/Inter_18pt-Regular.woff2", weight: "400" },
    { path: "../fonts/Inter-Medium.woff2", weight: "500" },
    { path: "../fonts/Inter_24pt-SemiBold.woff2", weight: "600" },
    { path: "../fonts/Inter_18pt-Bold.woff2", weight: "800" },
  ],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Plataforma Ethos CPAC Escola de Psicologia",
  description: "Ethos CPAC Escola de psicologia",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="pt-BR">
        <body className={inter.className}>
          {children}
          <ToastContainer position="bottom-right" theme="dark" />
        </body>
      </html>
    </ClerkProvider>
  );
}
