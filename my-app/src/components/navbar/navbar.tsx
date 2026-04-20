import { Link, NavLink } from "react-router-dom";
import logo from "../../logo.svg";
import styles from "./navbar.module.css";

export default function Navbar() {
  return (
    <nav className={styles.nav} aria-label="หลัก">
      <Link className={styles.brand} to="/">
        <img src={logo} className={styles.logo} alt="" width={32} height={32} />
        <span>My App</span>
      </Link>
      <ul className={styles.links}>
        <li>
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `${styles.link}${isActive ? ` ${styles.linkActive}` : ""}`
            }
          >
            หน้าแรก
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/about"
            className={({ isActive }) =>
              `${styles.link}${isActive ? ` ${styles.linkActive}` : ""}`
            }
          >
            เกี่ยวกับ
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}
