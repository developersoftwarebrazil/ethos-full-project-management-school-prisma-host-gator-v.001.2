import styles from "./Highlights.module.scss";

export default function Highlights() {
  return (
    <section className={styles.pricing}>
      <h2 className={styles.sectionTitle}>Planos de Acesso</h2>
      <p className={styles.sectionSubtitle}>
        Escolha o plano ideal para sua formação em Psicanálise ou em outro de nosso cursos<br /><span> Comece agora mesmo.</span> 
      </p>

      <div className={styles.pricingGrid}>
        {/* Plano Mensal */}
        <div className={styles.pricingCardMonth}>
          <h3>Mensal</h3>
          <ul>
            <li>1 mês de acesso ao curso que você escolher</li>
            <li>Suporte on-line</li>
            <li>Acesso aos materiais do curso</li>
            <li>Acesso as video aulas</li>
            <li>Certificado ao finalizar o curso</li>
          </ul>
          <span className={styles.price}>R$ 280 / mês</span>
          <button>Assinar mensal</button>
        </div>

        {/* Plano Vitalício */}
        <div className={`${styles.pricingCardFull} ${styles.featured}`}>
          <span className={styles.badge}>Mais popular</span>
          <h3>Vitalício</h3>
          <ul>
            <li>Acesso ilimitado</li>
            <li>Todos os cursos</li>
            <li>Suporte premium</li>
            <li>Acesso e download aos materiais do curso</li>
            <li>Acesso e download as video aulas</li>
            <li>Certificado ao finalizar o curso</li>
          </ul>
          <span className={styles.price}>R$ 4000</span>
          <p >à vista R$ 3200 no Pix</p>
          <p>ou em até 12 de R$ 330 no boleto</p>

          <button>Assinar vitalício</button>
        </div>

        {/* Plano Anual */}
        <div className={styles.pricingCardYear}>
          <h3>Anual</h3>
          <ul>
            <li>12 meses de acesso</li>
            <li>Todos os cursos</li>
            <li>Suporte on-line</li>
            <li>Acesso aos materiais do curso</li>
            <li>Acesso as video aulas</li>
            <li>Certificado ao finalizar o curso</li>
          </ul>
          <span className={styles.price}>R$ 190 / mês</span>
          <button>Assinar anual</button>
        </div>
      </div>
    </section>
  );
}
