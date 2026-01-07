"use client";

/**
 * ================================
 * 🔁 CLERK (DESATIVADO TEMPORARIAMENTE)
 * Quando voltar a usar Clerk:
 * 1) Descomente os imports abaixo
 * 2) Comente a lógica de auth local
 * ================================
 */

// import * as Clerk from "@clerk/elements/common";
// import * as SignIn from "@clerk/elements/sign-in";
// import { useUser } from "@clerk/nextjs";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

const LoginPage = () => {
  const router = useRouter();

  /**
   * ================================
   * 🔐 AUTH LOCAL (ATIVO)
   * ================================
   */
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data?.error || "Usuário ou senha inválidos");
        return;
      }

      /**
       * 🔐 Cookie de sessão já foi setado no backend
       * Backend retorna:
       * {
       *   id: string,
       *   username: string,
       *   role: "ADMIN" | "TEACHER" | "STUDENT" | "PARENT"
       * }
       */

      if (!data?.role) {
        setError("Role do usuário não encontrada");
        return;
      }

      // 🔑 NORMALIZA ROLE (regra única do projeto)
      const role = data.role.toLowerCase();

      // 🔁 Redirecionamento seguro (SEM loop)
      router.replace(`/${role}`);
    } catch (err) {
      console.error("🔥 [LOGIN_ERROR]", err);
      setError("Erro ao tentar fazer login");
    } finally {
      setLoading(false);
    }
  };

  /**
   * ================================
   * 🔁 CLERK REDIRECT (DESATIVADO)
   * ================================
   */
  /*
  const { isLoaded, isSignedIn, user } = useUser();

  useEffect(() => {
    if (!isLoaded) return;
    if (!isSignedIn) return;

    const role = user?.publicMetadata?.role;

    if (role) {
      router.replace(`/${role.toLowerCase()}`);
    } else {
      router.replace("/");
    }
  }, [isLoaded, isSignedIn, user, router]);
  */

  return (
    <div className="h-screen flex items-center justify-center bg-ethosSkyLight">
      {/* ================================
           🔐 LOGIN LOCAL (ATIVO)
         ================================ */}
      <form
        onSubmit={handleLogin}
        className="bg-white p-12 rounded-md shadow-2xl flex flex-col gap-4 w-[360px]"
      >
        <h1 className="text-xl font-bold flex items-center gap-2">
          <Image src="/logo-ETHOS.png" alt="Logo" width={24} height={24} />
          ETHOS CPAC
        </h1>

        <h2 className="text-gray-400">Entre com sua conta</h2>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <div className="flex flex-col gap-2">
          <label className="text-xs text-gray-500">Nome de usuário</label>
          <input
            type="text"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="p-2 rounded-md ring-1 ring-gray-300"
            placeholder="ex: admin"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs text-gray-500">Senha</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="p-2 rounded-md ring-1 ring-gray-300"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-500 disabled:bg-blue-300 text-white my-2 rounded-md text-sm p-[10px] uppercase"
        >
          {loading ? "Entrando..." : "Entrar"}
        </button>
      </form>

      {/* ================================
           🔁 CLERK UI (DESATIVADO)
         ================================ */}
      {/*
      <SignIn.Root>
        <SignIn.Step name="start">...</SignIn.Step>
      </SignIn.Root>
      */}
    </div>
  );
};

export default LoginPage;
