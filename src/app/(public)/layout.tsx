// src/app/(public)/layout.tsx  OU  src/app/layout.tsx
import type { Metadata } from "next";
import { chathura, openSans, roboto } from "@/functions/fonts";

export const metadata: Metadata = {
  title: "ETHOS – Cursos Integrados",
  description: "Plataforma de gestão educacional ETHOS",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${chathura.variable} ${openSans.variable} ${roboto.variable}`}
      >
        <div className="App">
          {/* <Header /> */}

          <main className="AppBody">
            <div className="AppContent">{children}</div>
          </main>
        </div>
      </body>
    </html>
  );
}
