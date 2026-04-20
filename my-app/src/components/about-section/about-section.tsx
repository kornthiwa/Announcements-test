import styles from "./about-section.module.css";

export default function AboutSection() {
  return (
    <section
      className={styles.section}
      id="about"
      aria-labelledby="about-heading"
    >
      <h2 id="about-heading" className={styles.title}>
        เกี่ยวกับ
      </h2>
      <p className={styles.text}>แอปตัวอย่างที่สร้างด้วย Create React App</p>
    </section>
  );
}
