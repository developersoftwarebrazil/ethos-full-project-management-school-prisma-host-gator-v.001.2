import Image from "next/image";
import styles from "./LandingFooter.module.scss";
import {
  Phone,
  Mail,
  MapPin,
  Instagram,
  Facebook,
  CreditCard,
  QrCode,
  Barcode,
} from "lucide-react";
import Link from "next/link";

export default function LandingFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContainer}>
        {/* BRAND + CONTATO */}
        <div className={styles.footerBrand}>
          <div className={styles.logoRow}>
            <Image
              src="/logo-ETHOS.png"
              alt="Ethos CPAC"
              width={40}
              height={40}
            />
            <span className={styles.brandName}>ETHOS CPAC</span>
          </div>

          <ul className={styles.contactList}>
            <li>
              <Phone size={16} />
              <span>
                <a href="tel:+5519992871931">(19) 99287-1931</a>
              </span>
            </li>
            <li>
              <Mail size={16} />
              <span>
                {" "}
                <a href="mailto:direthosadm@gmail.com">direthosadm@gmail.com</a>
              </span>
            </li>
            <li>
              <MapPin size={16} />
              <span>
                <a
                  href="https://www.google.com/maps/search/?api=1&query=Rua+João+Batista+Santanna,+215,+Bonfin+Paulista+Ribeirão+Preto,+SP"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Rua João Batista Santanna, 215
                  <br />
                  Reserva Sul Resort
                  <br />
                  Ribeirão Preto - SP
                  <br />
                  CEP 14022-320
                </a>
              </span>
            </li>
          </ul>
        </div>

        {/* MAPA DO SITE */}
        <div className={styles.footerLinks}>
          <h4>Mapa do site</h4>
          <a href="#inicio">Início</a>
          <a href="#cursos">Nossos cursos</a>
          <a href="#sobre">Quem somos</a>
          <a href="#contato">Fale conosco</a>
        </div>

        {/* REDES SOCIAIS */}
        <div className={styles.footerSocial}>
          <h4>Redes sociais</h4>
          <div className={styles.socialIcons}>
            <Link
              href="https://www.instagram.com/wagner_toledoofc?igsh=MTBraGdkOW54cnZxMA=="
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
            >
              <Instagram size={20} />
            </Link>

            <Link
              href="https://www.facebook.com/share/17zq9rDg5X/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
            >
              <Facebook size={20} />
            </Link>
          </div>
        </div>

        {/* PAGAMENTOS */}
        {/* PAGAMENTOS */}
        <div className={styles.footerPayment}>
          <h4>Formas de pagamento</h4>

          <div className={styles.paymentList}>
            <div className={styles.paymentItem}>
              <QrCode size={22} />
              <span>Pix</span>
            </div>

            <div className={styles.paymentItem}>
              <Barcode size={22} />
              <span>Boleto</span>
            </div>

            <div className={styles.paymentItem}>
              <CreditCard size={22} />
              <span>Cartão</span>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.footerBottom}>
        © 2026 ETHOS CURSOS INTEGRADOS CPAC · Todos os direitos reservados
      </div>
    </footer>
  );
}
