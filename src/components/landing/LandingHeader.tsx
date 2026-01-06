import Image from "next/image";
import Link from "next/link";
import styles from "./landing.module.scss";

export default function LandingHeader() {
  return (
    <header className={styles.landingHeader}>
      <div className={styles.headerContainer}>
        <div className={styles.logo}>
          <Image
            src="/logo-ETHOS.png"
            alt="Ethos CPAC"
            width={32}
            height={32}
          />
          <span>ETHOS CPAC</span>
        </div>

        <nav className={styles.nav}>
          <Link href="#">Categorias</Link>
          <Link href="#">Quem somos</Link>
          <Link href="#">Fale conosco</Link>
        </nav>
        <div className={styles.area}>
          <Link href="/auth/login" className={styles.areaAluno}>
            Área do aluno
          </Link>
          <Link href="/auth/login" className={styles.entrar}>
            Entrar
          </Link>
        </div>
      </div>
    </header>
  );
}
