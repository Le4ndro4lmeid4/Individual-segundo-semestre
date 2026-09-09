import styles from "./Home.module.css";
import { useNavigate } from "react-router-dom";

const coverImage =
  "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=80";

function Home() {
  const navigate = useNavigate();

  return (
    <main className={styles.container}>
      <section className={styles.album} aria-labelledby="titulo-home">
        <img
          className={styles.coverImage}
          src={coverImage}
          alt="Paisagem de viagem"
        />

        <div className={styles.content}>
          <h1 id="titulo-home" className={styles.title}>Minhas Viagens</h1>

          <div className={styles.actions}>
            <button
              className={styles.primaryButton}
              onClick={() => navigate("/viagens")}
            >
              Ver viagens
            </button>

            <button
              className={styles.secondaryButton}
              onClick={() => navigate("/cadastro-viagem")}
            >
              Nova viagem
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Home;