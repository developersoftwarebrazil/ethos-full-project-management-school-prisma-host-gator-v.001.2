import styles from "./About.module.scss";

export default function About() {
  return (
    <section id="about" className={styles.aboutSection}>
      <div className={styles.aboutContainer}>
        <span className={styles.aboutBadge}>Sobre a plataforma</span>

        <h2 className={styles.aboutTitle}>
          O que é o <span>ETHOS</span>?
        </h2>

        <p className={styles.aboutSubtitle}>
          Tecnologia educacional pensada para instituições que valorizam
          organização, clareza e evolução contínua.
        </p>

        <p className={styles.aboutText}>
          O <strong>ETHOS School Management</strong> é uma plataforma educacional
          desenvolvida para <span>centralizar processos</span>, fortalecer a
          gestão acadêmica e proporcionar uma experiência de ensino mais
          eficiente e acessível.
        </p>

        <p className={styles.aboutText}>
          Integrando recursos administrativos, pedagógicos e comunicacionais, o
          ETHOS permite que escolas, cursos e instituições EAD atuem com mais
          controle, transparência e foco no que realmente importa:
          <strong> o aprendizado</strong>.
        </p>

        <div className={styles.aboutGrid}>
          <div className={styles.aboutCard}>
            <span className={styles.aboutIcon}>📊</span>
            <h3>Gestão organizada</h3>
            <p>
              Controle acadêmico, administrativo e pedagógico reunidos em um
              único ambiente, com dados estruturados e seguros.
            </p>
          </div>

          <div className={styles.aboutCard}>
            <span className={styles.aboutIcon}>💬</span>
            <h3>Comunicação integrada</h3>
            <p>
              Alunos, professores e coordenação conectados por fluxos claros e
              eficientes, reduzindo ruídos e retrabalho.
            </p>
          </div>

          <div className={styles.aboutCard}>
            <span className={styles.aboutIcon}>🎓</span>
            <h3>Ensino acessível</h3>
            <p>
              Pensado para EAD, o ETHOS garante acesso aos conteúdos de qualquer
              lugar, com flexibilidade, estabilidade e qualidade.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
