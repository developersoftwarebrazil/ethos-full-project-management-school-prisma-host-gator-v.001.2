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
import styles from "@/styles/account/register/Register.module.scss";

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

      router.push("/login");
    } catch {
      setError("Erro inesperado ao criar usuário");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className={styles.registerSection}>
      <div className={styles.registerContainer}>
        <div className={styles.card}>
          <header className={styles.header}>
            <Image
              src="/logo-ETHOS.png"
              alt="ETHOS"
              width={42}
              height={42}
              priority
            />
            <h1>
              Criar <span>Superusuário</span>
            </h1>
            <p>Acesso administrativo ao sistema</p>
          </header>

          {error && <p className={styles.error}>{error}</p>}

          <form onSubmit={handleRegister} className={styles.form}>
            <div className={styles.field}>
              <label>Nome completo</label>
              <input
                type="text"
                placeholder="Administrador"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className={styles.field}>
              <label>Usuário</label>
              <input
                type="text"
                placeholder="admin"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className={styles.field}>
              <label>Senha</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" disabled={loading}>
              {loading ? "Criando..." : "Criar usuário"}
            </button>
          </form>
        </div>
      </div>

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
    </section>
  );
};

export default RegisterPage;
