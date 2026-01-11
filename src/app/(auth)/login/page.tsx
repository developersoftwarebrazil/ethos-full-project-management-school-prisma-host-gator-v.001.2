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

import styles from "@/styles/account/Login.module.scss";


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

<div className={styles.loginPage}>
  {/* ================================
       🔐 LOGIN LOCAL (ATIVO)
     ================================ */}
  <form onSubmit={handleLogin} className={styles.loginCard}>
    <h1 className={styles.loginHeader}>
      <Image src="/logo-ETHOS.png" alt="Logo" width={24} height={24} />
      ETHOS CPAC
    </h1>

    <h2 className={styles.loginSubtitle}>Entre com sua conta</h2>

    {error && <p className={styles.loginError}>{error}</p>}

    <div className={styles.field}>
      <label>Nome de usuário</label>
      <input
        type="text"
        required
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="ex: admin"
      />
    </div>

    <div className={styles.field}>
      <label>Senha</label>
      <input
        type="password"
        required
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
    </div>

    <button
      type="submit"
      disabled={loading}
      className={styles.loginButton}
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
