import ViagemCard from "../components/ViagemCard";
import { editarViagem, listarViagens, removerViagem } from "../services/viagemService";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Toast from "../components/Toast";
import styles from "./Viagens.module.css";

function Viagens() {
  const navigate = useNavigate();
  const [viagens, setViagens] = useState([]);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [carregando, setCarregando] = useState(true);
  const [mensagemErro, setMensagemErro] = useState("");
  const [toast, setToast] = useState(null);
  const itensPorPagina = 6;

  useEffect(() => {
    async function buscarViagens() {
      try {
        setCarregando(true);
        setMensagemErro("");
        const resultado = await listarViagens();
        setViagens(resultado || []);
        setPaginaAtual(1);
        setToast({ type: "success", message: "Viagens carregadas com sucesso!" });
      } catch (error) {
        setViagens([]);
        const mensagem = error.message || "Não foi possível carregar as viagens.";
        setMensagemErro(mensagem);
        setToast({ type: "error", message: mensagem });
      } finally {
        setCarregando(false);
      }
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
    const viagemAtual = viagens.find((viagem) => viagem.id === id);
    const destinoEfetivo = Object.prototype.hasOwnProperty.call(dados, "destino")
      ? dados.destino
      : viagemAtual?.destino;

    if (!destinoEfetivo?.trim() || destinoEfetivo.length > 30) {
      setToast({ type: "error", message: "O destino deve ter entre 1 e 30 caracteres." });
      return false;
    }

    if (dados.descricao?.length > 30) {
      setToast({ type: "error", message: "A descrição deve ter no máximo 30 caracteres." });
      return false;
    }

    const dataInicioEfetiva = dados.dataInicio || viagemAtual?.dataInicio;
    const dataFimFoiAlterada = Object.prototype.hasOwnProperty.call(dados, "dataFim");
    const dataFimEfetiva = dataFimFoiAlterada ? dados.dataFim : viagemAtual?.dataFim;

    if (dataFimEfetiva && dataInicioEfetiva && dataFimEfetiva < dataInicioEfetiva) {
      setToast({ type: "error", message: "A data de fim não pode ser anterior à data de início." });
      return false;
    }

    let salvou;
    try {
      salvou = await editarViagem(id, dados);
    } catch (error) {
      setToast({ type: "error", message: error.message || "Não foi possível editar a viagem." });
      return false;
    }

    if (salvou) {
      setViagens((viagensAtuais) => viagensAtuais.map((viagem) => (
        viagem.id === id ? { ...viagem, ...dados } : viagem
      )));
      setToast({ type: "success", message: "Viagem editada com sucesso!" });
    } else {
      setToast({ type: "error", message: "Não foi possível editar a viagem." });
    }

    return salvou;
  };

  const apagarViagem = async (id) => {
    let apagou;
    try {
      apagou = await removerViagem(id);
    } catch (error) {
      setToast({ type: "error", message: error.message || "Não foi possível excluir a viagem." });
      return false;
    }

    if (apagou) {
      setViagens((viagensAtuais) => viagensAtuais.filter((viagem) => viagem.id !== id));
      setToast({ type: "success", message: "Viagem excluída com sucesso!" });
    } else {
      setToast({ type: "error", message: "Não foi possível excluir a viagem." });
    }

    return apagou;
  };

  return (
    <main className={styles.page}>
      <Toast message={toast?.message} type={toast?.type} onClose={() => setToast(null)} />
      <div className={styles.contentWrap}>
        <section className={styles.gallery}>
          {carregando && <p>Carregando viagens...</p>}
          {!carregando && mensagemErro && <p>{mensagemErro}</p>}
          {!carregando && !mensagemErro && viagens.length === 0 && (
            <p className={styles.message}>Nenhuma viagem cadastrada.</p>
          )}
          {!carregando && !mensagemErro && viagensDaPagina.map((viagem) => (
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

      <nav className={styles.pagination}>
        <button
          type="button"
          className={styles.pageButton}
          title="Página anterior"
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
            title={`Página ${numero}`}
            onClick={() => irParaPagina(numero)}
          >
            {numero}
          </button>
        ))}

        <button
          type="button"
          className={styles.pageButton}
          title="Próxima página"
          onClick={() => irParaPagina(paginaSegura + 1)}
          disabled={paginaSegura === totalPaginas}
        >
          →
        </button>
      </nav>

      <button
        type="button"
        className={styles.backButton}
        title="Voltar para a home"
        onClick={() => navigate("/")}
      >
        ←
      </button>
    </main>
  );
}

export default Viagens;
