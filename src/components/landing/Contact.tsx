"use client";

import { useState } from "react";
import styles from "./landing.module.scss";

export default function Contact() {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const form = e.currentTarget;
    const formData = new FormData(form);

    const response = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: formData.get("name"),
        email: formData.get("email"),
        message: formData.get("message"),
      }),
    });

    setLoading(false);

    if (response.ok) {
      alert("Mensagem enviada com sucesso! Em breve entraremos em contato.");
      form.reset();
    } else {
      alert("Erro ao enviar mensagem. Tente novamente.");
    }
  }

  return (
    <section id="contato" className={styles.contactSection}>
      <div className={styles.contactContainer}>
        <span className={styles.contactBadge}>Contato</span>

        <h2 className={styles.contactTitle}>
          Entre em contato com a <span>ETHOS CPAC</span>
        </h2>

        <p className={styles.contactSubtitle}>
          Tem dúvidas sobre nossos cursos ou a plataforma?
          <br />
          <strong>Envie sua mensagem e responderemos em breve.</strong>
        </p>

        <form className={styles.contactForm} onSubmit={handleSubmit}>
          <div className={styles.formGrid}>
            <div className={styles.field}>
              <label>Nome completo</label>
              <input name="name" required />
            </div>

            <div className={styles.field}>
              <label>E-mail</label>
              <input type="email" name="email" required />
            </div>
          </div>

          <div className={styles.field}>
            <label>Mensagem</label>
            <textarea name="message" rows={5} required />
          </div>

          <button
            type="submit"
            className={styles.contactButton}
            disabled={loading}
          >
            {loading ? "Enviando..." : "Enviar mensagem"}
          </button>
        </form>
      </div>
    </section>
  );
}
