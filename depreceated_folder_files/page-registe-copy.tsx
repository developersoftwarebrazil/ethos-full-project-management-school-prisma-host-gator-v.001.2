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
// import * as SignUp from "@clerk/elements/sign-up";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

const RegisterPage = () => {
  const router = useRouter();

  /**
   * ================================
   * 🔐 AUTH LOCAL (ATIVO)
   * ================================
   */
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          username,
          password,
          role: "admin", // 🔥 SUPERUSUÁRIO
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data?.message || "Erro ao criar usuário");
        return;
      }

      // Usuário criado com sucesso
      router.push("/login");
    } catch (err) {
      setError("Erro inesperado ao criar usuário");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-ethosSkyLight">
      {/* ================================
           🔐 REGISTRO LOCAL (ATIVO)
         ================================ */}
      <form
        onSubmit={handleRegister}
        className="bg-white p-12 rounded-md shadow-2xl flex flex-col gap-3 w-[360px]"
      >
        <h1 className="text-xl font-bold flex items-center gap-2">
          <Image src="/logo-ETHOS.png" alt="Logo" width={24} height={24} />
          ETHOS CPAC
        </h1>

        <h2 className="text-gray-400">Criar superusuário</h2>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <div className="flex flex-col gap-2">
          <label className="text-xs text-gray-500">Nome completo</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="p-2 rounded-md ring-1 ring-gray-300"
            placeholder="Administrador"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs text-gray-500">Nome de usuário</label>
          <input
            type="text"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="p-2 rounded-md ring-1 ring-gray-300"
            placeholder="admin"
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
          {loading ? "Criando..." : "Criar usuário"}
        </button>
      </form>

      {/* ================================
           🔁 CLERK SIGN-UP (DESATIVADO)
         ================================ */}
      {/*
      <SignUp.Root>
        <SignUp.Step name="start">
          ...
        </SignUp.Step>
      </SignUp.Root>
      */}
    </div>
  );
};

export default RegisterPage;
