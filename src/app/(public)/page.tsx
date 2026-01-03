// src/app/(public)/page.tsx
import Image from "next/image";
import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-lamaSkyLight flex flex-col">
      {/* ================= HEADER ================= */}
      <header className="flex items-center justify-between px-8 py-4 bg-white shadow">
        <div className="flex items-center gap-2">
          <Image
            src="/logo-ETHOS.png"
            alt="ETHOS"
            width={32}
            height={32}
          />
          <span className="font-bold text-lg">ETHOS CPAC</span>
        </div>

        <Link
          href="/auth/login"
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm uppercase"
        >
          Entrar
        </Link>
      </header>

      {/* ================= HERO ================= */}
      <section className="flex-1 flex items-center justify-center px-6">
        <div className="max-w-4xl text-center flex flex-col gap-6">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800">
            Gestão escolar simples, moderna e eficiente
          </h1>

          <p className="text-gray-600 text-lg">
            O <strong>ETHOS School Management</strong> centraliza alunos,
            professores, responsáveis e administração em um único sistema,
            seguro e fácil de usar.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-4">
            <Link
              href="/auth/login"
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-md uppercase text-sm font-semibold"
            >
              Acessar o sistema
            </Link>

            <a
              href="#features"
              className="bg-white border border-gray-300 hover:bg-gray-100 px-6 py-3 rounded-md uppercase text-sm font-semibold text-gray-700"
            >
              Conhecer recursos
            </a>
          </div>
        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <section
        id="features"
        className="bg-white py-16 px-6 border-t"
      >
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <Feature
            title="Administração"
            description="Controle total de turmas, professores, alunos e eventos acadêmicos."
          />
          <Feature
            title="Professores"
            description="Lançamento de notas, frequência e acompanhamento pedagógico."
          />
          <Feature
            title="Alunos & Responsáveis"
            description="Acesso rápido a desempenho, calendário e comunicados."
          />
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="bg-gray-100 text-center text-sm text-gray-500 py-6">
        © {new Date().getFullYear()} ETHOS CPAC — Sistema de Gestão Escolar
      </footer>
    </main>
  );
}

/**
 * ================= COMPONENTE AUXILIAR
 * =================
 */
function Feature({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="p-6 rounded-lg shadow-sm border flex flex-col gap-2">
      <h3 className="font-semibold text-lg text-gray-800">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  );
}
