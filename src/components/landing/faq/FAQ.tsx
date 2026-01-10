import styles from "./FAQ.module.scss";

export default function FAQ() {
  return (
    <section className={styles.faqSection}>
      <div className={styles.faqContainer}>
        <span className={styles.faqBadge}>Dúvidas comuns</span>

        <h2 className={styles.faqTitle}>Perguntas frequentes</h2>

        <p className={styles.faqSubtitle}>
          Reunimos aqui as principais dúvidas sobre a plataforma e os cursos do
          ETHOS.
        </p>

        <div className={styles.faqList}>
          <details className={styles.faqItem}>
            <summary>O sistema é seguro?</summary>
            <p>
              Sim. Utilizamos controle de acesso por perfil, criptografia de
              dados e boas práticas de segurança digital.
            </p>
          </details>

          <details className={styles.faqItem}>
            <summary>Funciona no celular?</summary>
            <p>
              Sim. A plataforma é totalmente responsiva e pode ser acessada em
              celulares, tablets e computadores.
            </p>
          </details>

          <details className={styles.faqItem}>
            <summary>Recebo certificado ao concluir o curso?</summary>
            <p>
              Sim. Após a conclusão do curso, o aluno recebe certificado de
              conclusão válido para cursos livres.
            </p>
          </details>

          <details className={styles.faqItem}>
            <summary>Psicanálise é reconhecida?</summary>
            <p>
              A Psicanálise é uma prática amparada pela legislação brasileira
              dentro da categoria de cursos livres.
            </p>
          </details>
        </div>
      </div>
    </section>
  );
}
