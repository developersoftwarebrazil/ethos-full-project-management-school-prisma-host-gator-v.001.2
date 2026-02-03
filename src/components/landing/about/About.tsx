
import styles from "./About.module.scss";

export default function About() {
  return (
    <section id="about" className={styles.aboutSection}>
      <div className={styles.aboutContainer}>
        <span className={styles.aboutBadge}>Sobre a plataforma</span>

        <h2 className={styles.aboutTitle}>
          Quem <span>SOMOS</span>?
        </h2>

        <p className={styles.aboutSubtitle}>
          Acreditamos que o conhecimento transforma vidas. Somos uma escola
          que ministra cursos a distância em Psicanálise e afins <span>(EAD)</span>, 
          projetados para oferecer ensino de qualidade, flexível e acessível 
          para pessoas em qualquer lugar do mundo.
        </p>

        <p className={styles.aboutText}>
          Nossa metodologia educacional foi pensada para valorizar a organização,
          clareza e evolução contínua.
        </p>

        <p className={styles.aboutText}>
          O <strong>AVA/EAD ETHOS</strong> é uma plataforma educacional desenvolvida
          para <span>centralizar processos</span>, fortalecer a gestão acadêmica e
          proporcionar uma experiência de ensino mais eficiente e acessível.
        </p>

        <p className={styles.aboutText}>
          A <strong>Ethos Cursos Integrados CPAC</strong> contempla em seu escopo a base
          teórica de matriz Freudiana com propósito único: autorizar o alunato ao
          exercício da Psicanálise e Análises Clínicas. São 12 (meses) módulos envolvendo:
          Teoria, Discussão de Caso, Tripé Analítico (teoria, análise pessoal e supervisão)
          e Estágio probatório!
        </p>

        <p className={styles.aboutText}>
          Escolha aprender com a nossa escola e dê o próximo passo em direção ao seu futuro!
          Nosso compromisso é com o seu aprendizado. Por isso, oferecemos uma viagem imersiva
          que lhe permitirá conhecer novas dimensões de si mesmo!
        </p>

        {/* Grid com 4 colunas */}
        <div className={styles.aboutGridFour}>
          <div className={styles.aboutCard}>
            <span className={styles.aboutIcon}>📚</span>
            <h3>Base Teórica</h3>
            <p>Fundamentação sólida em Psicanálise de matriz Freudiana.</p>
          </div>

          <div className={styles.aboutCard}>
            <span className={styles.aboutIcon}>🧠</span>
            <h3>Análise Pessoal</h3>
            <p>Vivência prática que aprofunda o autoconhecimento.</p>
          </div>

          <div className={styles.aboutCard}>
            <span className={styles.aboutIcon}>👥</span>
            <h3>Supervisão</h3>
            <p>Acompanhamento contínuo para garantir evolução acadêmica e clínica.</p>
          </div>

          <div className={styles.aboutCard}>
            <span className={styles.aboutIcon}>📊</span>
            <h3>Estudo de Casos</h3>
            <p>Discussão prática e aplicada para consolidar o aprendizado.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

// import styles from "./About.module.scss";

// export default function About() {
//   return (
//     <section id="about" className={styles.aboutSection}>
//       <div className={styles.aboutContainer}>
//         <span className={styles.aboutBadge}>Sobre a plataforma</span>

//         <h2 className={styles.aboutTitle}>
//           Quem <span>SOMOS</span>?
//         </h2>

//         <p className={styles.aboutSubtitle}>
//           {/* Tecnologia educacional pensada para instituições que valorizam
//           organização, clareza e evolução contínua. */}
//           Acreditamos que o conhecimento transforma vidas. Somos uma escola que
//           ministra cursos a distância em Psicanálise e afins <span>(EAD)</span>{" "}
//           , projetados para oferecer ensino de qualidade, flexível e acessível
//           para pessoas em qualquer lugar do mundo.
//         </p>

//         <p className={styles.aboutText}>
//           O <strong>ETHOS School Management</strong> é uma plataforma
//           educacional desenvolvida para <span>centralizar processos</span>,
//           fortalecer a gestão acadêmica e proporcionar uma experiência de ensino
//           mais eficiente e acessível.
//         </p>

//         <p className={styles.aboutText}>
//           Integrando recursos administrativos, pedagógicos e comunicacionais, o
//           ETHOS permite que escolas, cursos e instituições EAD atuem com mais
//           controle, transparência e foco no que realmente importa:
//           <strong> o aprendizado</strong>.
//         </p>

//         <div className={styles.aboutGrid}>
//           <div className={styles.aboutCard}>
//             <span className={styles.aboutIcon}>📊</span>
//             <h3>Gestão organizada</h3>
//             <p>
//               Controle acadêmico, administrativo e pedagógico reunidos em um
//               único ambiente, com dados estruturados e seguros.
//             </p>
//           </div>

//           <div className={styles.aboutCard}>
//             <span className={styles.aboutIcon}>💬</span>
//             <h3>Comunicação integrada</h3>
//             <p>
//               Alunos, professores e coordenação conectados por fluxos claros e
//               eficientes, reduzindo ruídos e retrabalho.
//             </p>
//           </div>

//           <div className={styles.aboutCard}>
//             <span className={styles.aboutIcon}>🎓</span>
//             <h3>Ensino acessível</h3>
//             <p>
//               Pensado para EAD, o ETHOS garante acesso aos conteúdos de qualquer
//               lugar, com flexibilidade, estabilidade e qualidade.
//             </p>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }
