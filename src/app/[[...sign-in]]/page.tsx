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
import { useEffect, useState } from "react";

const LoginPage = () => {
  const router = useRouter();

  /**
   * ================================
   * 🔐 AUTH LOCAL (ATIVO)
   * ================================
   */
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      setError("Credenciais inválidas");
      return;
    }

    // Após login local, backend já seta cookie
    router.push("/");
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
      router.push(`/${role}`);
    } else {
      router.push("/home");
    }
  }, [isLoaded, isSignedIn, user, router]);
  */

  return (
    <div className="h-screen flex items-center justify-center bg-lamaSkyLight">
      {/* ================================
           🔐 LOGIN LOCAL (ATIVO)
         ================================ */}
      <form
        onSubmit={handleLogin}
        className="bg-white p-12 rounded-md shadow-2xl flex flex-col gap-3 w-[360px]"
      >
        <h1 className="text-xl font-bold flex items-center gap-2">
          <Image src="/logo-ETHOS.png" alt="Logo" width={24} height={24} />
          ETHOS CPAC
        </h1>

        <h2 className="text-gray-400">Entre com sua conta</h2>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <div className="flex flex-col gap-2">
          <label className="text-xs text-gray-500">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="p-2 rounded-md ring-1 ring-gray-300"
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
          className="bg-blue-500 text-white my-2 rounded-md text-sm p-[10px] uppercase"
        >
          Entrar
        </button>
      </form>

      {/* ================================
           🔁 CLERK UI (DESATIVADO)
         ================================ */}
      {/*
      <SignIn.Root>
        <SignIn.Step
          name="start"
          className="bg-white p-12 rounded-md shadow-2xl flex flex-col gap-2"
        >
          ...
        </SignIn.Step>
      </SignIn.Root>
      */}
    </div>
  );
};

export default LoginPage;
