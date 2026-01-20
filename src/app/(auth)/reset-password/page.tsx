// src/app/(auth)/reset-password/page.tsx
import { Suspense } from "react";
import ResetPasswordClient from "./reset-password-client";

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div style={{ textAlign: "center" }}>Carregando...</div>}>
      <ResetPasswordClient />
    </Suspense>
  );
}



// "use client";

// import { useSearchParams, useRouter } from "next/navigation";
// import { useState, useEffect } from "react";
// import { toast } from "react-toastify";
// import styles from "@/styles/account/login/Login.module.scss";

// export default function ResetPasswordPage() {
//   const searchParams = useSearchParams();
//   const router = useRouter();

//   const [token, setToken] = useState<string | null>(null);
//   const [password, setPassword] = useState("");
//   const [confirm, setConfirm] = useState("");
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     const t = searchParams.get("token");
//     if (t) setToken(t);
//   }, [searchParams]);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (loading) return;

//     if (!token) {
//       toast.error("Token inválido ou ausente.");
//       return;
//     }

//     if (password !== confirm) {
//       toast.error("As senhas não coincidem.");
//       return;
//     }

//     setLoading(true);

//     try {
//       const res = await fetch("/api/auth/reset-password", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ token, password }),
//       });

//       const data = await res.json();

//       if (!res.ok) {
//         toast.error(data.error || "Erro ao redefinir senha.");
//         return;
//       }

//       toast.success("Senha redefinida com sucesso!");
//       router.push("/auth/login");
//     } catch (err) {
//       console.error("🔥 [RESET_PASSWORD_ERROR]", err);
//       toast.error("Erro inesperado.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (!token) {
//     return (
//       <div className={styles.loginPage}>
//         <div className={styles.loginCard}>
//           <h2 className={styles.loginSubtitle}>Token inválido ou ausente</h2>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className={styles.loginPage}>
//       <form onSubmit={handleSubmit} className={styles.loginCard}>
//         <h2 className={styles.loginSubtitle}>Redefinir senha</h2>

//         <div className={styles.field}>
//           <label>Nova senha</label>
//           <input
//             type="password"
//             required
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//           />
//         </div>

//         <div className={styles.field}>
//           <label>Confirmar senha</label>
//           <input
//             type="password"
//             required
//             value={confirm}
//             onChange={(e) => setConfirm(e.target.value)}
//           />
//         </div>

//         <button type="submit" className={styles.loginButton} disabled={loading}>
//           {loading ? "Processando..." : "Redefinir senha"}
//         </button>
//       </form>
//     </div>
//   );
// }
