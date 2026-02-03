import styles from "./Benefits.module.scss";

export default function Benefits() {
  return (
    <section className={styles.benefitsSection}>
      <div className={styles.benefitsContainer}>
        <span className={styles.benefitsBadge}>Vantagens do sistema</span>

        <h2 className={styles.benefitsTitle}>
          Por que usar o <span>ETHOS</span>?
        </h2>

        <p className={styles.benefitsSubtitle}>          
          Uma plataforma pensada para profissionais que buscam{" "}
          <strong>organização, eficiência e evolução digital</strong>.
        </p>

        <div className={styles.benefitsGrid}>
          <div className={styles.benefitCard}>
            <span className={styles.benefitIcon}>⚡</span>
            <h3>Interface moderna</h3>
            <p>
              Experiência intuitiva, fluida e responsiva, reduzindo o tempo de
              adaptação de alunos e professores.
            </p>
          </div>

          <div className={styles.benefitCard}>
            <span className={styles.benefitIcon}>📚</span>
            <h3>Centralização total</h3>
            <p>
              Cursos, materiais, avaliações e comunicação organizados em um
              único ambiente seguro.
            </p>
          </div>

          <div className={styles.benefitCard}>
            <span className={styles.benefitIcon}>🔒</span>
            <h3>Segurança e controle</h3>
            <p>
              Controle de acesso por perfil, proteção de dados e conformidade
              com boas práticas digitais.
            </p>
          </div>

          <div className={styles.benefitCard}>
            <span className={styles.benefitIcon}>💬</span>
            <h3>Comunicação eficiente</h3>
            <p>
              Interação clara entre alunos, docentes e coordenação, fortalecendo
              o processo educacional.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
