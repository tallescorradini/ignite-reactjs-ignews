import styles from "./style.module.scss";
import { SignInButton } from "../SignInButton";
import { NavigationLink } from "../NavigationLink";

export function Header() {
  return (
    <header className={styles.headerContainer}>
      <div className={styles.headerContent}>
        <img src="/images/logo.svg" alt="Logo Ignews" />
        <nav>
          <ul>
            <li>
              <NavigationLink href="/" activeClassName={styles.active}>
                <a>Home</a>
              </NavigationLink>
            </li>
            <li>
              <NavigationLink href="/posts" activeClassName={styles.active}>
                <a>News</a>
              </NavigationLink>
            </li>
          </ul>
        </nav>

        <SignInButton />
      </div>
    </header>
  );
}
