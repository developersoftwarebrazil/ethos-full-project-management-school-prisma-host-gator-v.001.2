"use client";

import styles from "./landing.module.scss";

export default function Contact() {
  return (
    <section id="contato" className={styles.contactSection}>
      <div className={styles.contactContainer}>
        <span className={styles.contactBadge}>Contato</span>

        <h2 className={styles.contactTitle}>
          Entre em contato com a <span>Ethos CPAC</span>
        </h2>

        <p className={styles.contactSubtitle}>
          Tem dúvidas sobre nossos cursos, certificações ou sobre a plataforma
          ETHOS?
          <br />
          <strong>
            Envie sua mensagem e nossa equipe retornará o mais breve possível.
          </strong>
        </p>

        <form
          className={styles.contactForm}
          onSubmit={async (e) => {
            e.preventDefault();

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

            if (response.ok) {
              alert("Mensagem enviada com sucesso! Em breve entraremos em contato.");
              form.reset();
            } else {
              alert("Ocorreu um erro ao enviar sua mensagem. Tente novamente.");
            }
          }}
        >
          <div className={styles.formGrid}>
            <div className={styles.field}>
              <label htmlFor="name">Nome completo</label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Digite seu nome"
                required
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="email">E-mail</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="seuemail@exemplo.com"
                required
              />
            </div>
          </div>

          <div className={styles.field}>
            <label htmlFor="message">Mensagem</label>
            <textarea
              id="message"
              name="message"
              rows={5}
              placeholder="Conte-nos como podemos ajudar você"
              required
            />
          </div>

          <button type="submit" className={styles.contactButton}>
            Enviar mensagem
          </button>
        </form>
      </div>
    </section>
  );
}
