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
            <summary>Todos os cursos pussuem vídeo aulas?</summary>
            <p>
              Sim! Todos os nossos cursos incluem videoaulas expositivas
              gravadas com objetivos claros afim de facilitar o seu aprendizado.
            </p>
          </details>

          <details className={styles.faqItem}>
            <summary>Recebo certificado ao concluir o curso?</summary>
            <p>
              Sim! Após finalizar todas as etapas e atingir o desempenho mínimo
              exigido, você recebe um certificado digital.
            </p>
          </details>

          <details className={styles.faqItem}>
            <summary>Tenho acesso a um suporte caso eu tenha dúvidas?</summary>
            <p>
              Sim! Nossa equipe está disponível para te ajudar sempre que você
              precisar. Caso tenha dúvidas ou precise de orientação, é só entrar
              em contato pelos nossos canais de suporte. Faremos o possível para
              responder o mais rápido possível e garantir que você tenha a
              melhor experiênci
            </p>
          </details>

          <details className={styles.faqItem}>
            <summary>Quem pode fazer o curso de Psicanálise?</summary>
            <p>
              O requisito mais comum para a formação de psicanalista é a
              conclusão do ensino médio. A Psicanálise é uma ocupação livre, ou
              seja, não é uma profissão regulamentada por um conselho de classe
              como a psicologia, mas é reconhecida e respeitada.
            </p>
          </details>

          <details className={styles.faqItem}>
            <summary>A Psicanálise é amparada lrgalmente?</summary>
            <p>
              Sim, pelo Ministério do Trabalho e Emprego - CBO 2515.50/2002,
              pelo Conselho Federal de Medicina (Consulta nº 4.048/97), pelo
              Ministério Público Federal (Parecer 309/88) e pelo Ministério da
              Saúde (Aviso 257/57) - LC 147/14 (art. 5-I, IV) e Lei 12.933/08.
            </p>
          </details>

          <details className={styles.faqItem}>
            <summary>A Psicanálise é reconhecida pelo MEC?</summary>
            <p>
              Não há graduação em Psicanálise, razão para não haver
              credenciamento junto ao MEC para nenhum curso. Nosso Curso Livre é
              amparado pela LDB (Lei n° 9394/96), pelo Decreto nº 2.494/98 e
              Decreto n° 2.208/97. Apenas Institutos, Sociedades e Escolas
              psicanalíticas como a ETHOS - CPAC podem formar novos
              profissionais, baseando-se no tripé psicanalítico: teoria,
              supervisão e análise.
            </p>
          </details>
          <details className={styles.faqItem}>
            <summary>Qual lei permite o exercício da Psicanálise?</summary>
            <p>
              No Brasil e no Mundo a psicanálise é exercida livremente e não é
              uma profissão regulamentada. Sendo assim, é uma profissão livre,
              reconhecida pelo Ministério do Trabalho e Emprego (CBO - código
              2515.50), amparada pelo Decreto nº 2.208 de 17/04/1997, que
              estabelece Diretrizes e Bases da Educação Nacional e pela
              Constituição Federal nos artigos 5º incisos II e XIII. Reprisando:
              pode ser exercida em todo o País.
            </p>
          </details>
        </div>
      </div>
    </section>
  );
}
