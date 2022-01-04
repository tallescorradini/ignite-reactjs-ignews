import styles from "./style.module.scss";

export function Header() {
  return (
    <header className={styles.headerContainer}>
      <div className={styles.headerContent}>
        <img src="/images/logo.svg" alt="Logo Ignews" />
        <nav>
          <ul>
            <li>
              <a className={styles.active}>Home</a>
            </li>
            <li>
              <a>News</a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
