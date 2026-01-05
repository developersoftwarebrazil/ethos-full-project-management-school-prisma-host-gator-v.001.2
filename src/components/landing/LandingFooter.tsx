import Image from "next/image";
import styles from "./landing.module.scss";

export default function LandingFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContainer}>
        <div className={styles.footerBrand}>
          <Image
            src="/logo-ETHOS.png"
            alt="Ethos CPAC"
            width={36}
            height={36}
          />
          <p>
            Telefone: (19) 99287-1931
            <br />
            E-mail: direitosadm@gmail.com
          </p>
        </div>

        <div className={styles.footerLinks}>
          <h4>Mapa do site</h4>
          <a href="#">Início</a>
          <a href="#">Nossos cursos</a>
          <a href="#">Quem somos</a>
          <a href="#">Fale conosco</a>
        </div>

        <div className={styles.footerPayment}>
          <h4>Pagamento</h4>
          <Image
            src="/payments.png"
            alt="Formas de pagamento"
            width={200}
            height={40}
          />
        </div>
      </div>

      <div className={styles.footerBottom}>
        © 2026 ETHOS CURSOS INTEGRADOS CPAC · Todos os direitos reservados
      </div>
    </footer>
  );
}
