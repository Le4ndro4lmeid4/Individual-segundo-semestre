import ViagemCard from "../components/ViagemCard";
import { listarViagens } from "../services/viagemService";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Viagens.module.css";

function Viagens() {
  const navigate = useNavigate();
  const [viagens, setViagens] = useState([]);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const itensPorPagina = 4;

  useEffect(() => {
    async function buscarViagens() {
      const resultado = await listarViagens();
      setViagens(resultado || []);
      setPaginaAtual(1);
    }

    buscarViagens();
  }, []);

  const totalPaginas = Math.max(1, Math.ceil(viagens.length / itensPorPagina));
  const paginaSegura = Math.min(Math.max(paginaAtual, 1), totalPaginas);
  const indiceInicial = (paginaSegura - 1) * itensPorPagina;
  const viagensDaPagina = viagens.slice(indiceInicial, indiceInicial + itensPorPagina);

  const irParaPagina = (numero) => {
    const proximaPagina = Math.min(Math.max(numero, 1), totalPaginas);
    setPaginaAtual(proximaPagina);
  };

  return (
    <div className={styles.page}>
      <div className={styles.contentWrap}>
        <section className={styles.gallery} aria-label="Galeria de viagens">
          {viagensDaPagina.map((viagem) => (
            <ViagemCard
              key={viagem.id}
              id={viagem.id}
              destino={viagem.destino}
              dataInicio={viagem.dataInicio}
              dataFim={viagem.dataFim}
              descricao={viagem.descricao}
            />
          ))}
        </section>
      </div>

      <nav className={styles.pagination} aria-label="Paginação de viagens">
        <button
          type="button"
          className={styles.pageButton}
          aria-label="Página anterior"
          onClick={() => irParaPagina(paginaSegura - 1)}
          disabled={paginaSegura === 1}
        >
          ←
        </button>

        {Array.from({ length: totalPaginas }, (_, index) => index + 1).map((numero) => (
          <button
            key={numero}
            type="button"
            className={`${styles.pageButton} ${numero === paginaSegura ? styles.active : ""}`}
            aria-label={`Página ${numero}`}
            aria-current={numero === paginaSegura ? "page" : undefined}
            onClick={() => irParaPagina(numero)}
          >
            {numero}
          </button>
        ))}

        <button
          type="button"
          className={styles.pageButton}
          aria-label="Próxima página"
          onClick={() => irParaPagina(paginaSegura + 1)}
          disabled={paginaSegura === totalPaginas}
        >
          →
        </button>
      </nav>

      <button
        type="button"
        className={styles.backButton}
        aria-label="Voltar para a home"
        onClick={() => navigate("/")}
      >
        ←
      </button>
    </div>
  );
}

export default Viagens;
