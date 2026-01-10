import Image from "next/image";
import styles from "./LandingFooter.module.scss";
import {
  Phone,
  Mail,
  MapPin,
  Instagram,
  Facebook,
  Linkedin,
} from "lucide-react";

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
              <span>(19) 99287-1931</span>
            </li>
            <li>
              <Mail size={16} />
              <span>direthosadm@gmail.com</span>
            </li>
            <li>
              <MapPin size={16} />
              <span>
                Avenida José Camargo Arruda, 270
                <br />
                Fernandópolis - SP
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
            <a href="#" aria-label="Instagram">
              <Instagram size={20} />
            </a>
            <a href="#" aria-label="Facebook">
              <Facebook size={20} />
            </a>
            <a href="#" aria-label="LinkedIn">
              <Linkedin size={20} />
            </a>
          </div>
        </div>

        {/* PAGAMENTOS */}
        <div className={styles.footerPayment}>
          <h4>Formas de pagamento</h4>
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
