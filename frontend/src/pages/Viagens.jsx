import ViagemCard from "../components/ViagemCard";
import { editarViagem, listarViagens, removerViagem } from "../services/viagemService";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Viagens.module.css";

function Viagens() {
  const navigate = useNavigate();
  const [viagens, setViagens] = useState([]);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const itensPorPagina = 6;

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

  const salvarViagem = async (id, dados) => {
    const salvou = await editarViagem(id, dados);

    if (salvou) {
      setViagens((viagensAtuais) => viagensAtuais.map((viagem) => (
        viagem.id === id ? { ...viagem, ...dados } : viagem
      )));
    }

    return salvou;
  };

  const apagarViagem = async (id) => {
    const apagou = await removerViagem(id);

    if (apagou) {
      setViagens((viagensAtuais) => viagensAtuais.filter((viagem) => viagem.id !== id));
    }

    return apagou;
  };

  return (
    <main className={styles.page} aria-label="Página de viagens">
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
              onSave={salvarViagem}
              onDelete={apagarViagem}
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
    </main>
  );
}

export default Viagens;
