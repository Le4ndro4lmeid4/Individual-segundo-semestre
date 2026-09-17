import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { adicionarViagem } from "../services/viagemService";
import Toast from "../components/Toast";
import styles from "./CadastroViagem.module.css";

function CadastroViagem() {
  const navigate = useNavigate();
  const [destino, setDestino] = useState("");
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");
  const [descricao, setDescricao] = useState("");
  const [imagem, setImagem] = useState(null);
  const [enviando, setEnviando] = useState(false);
  const [toast, setToast] = useState(null);

  async function handleSubmit(event) {
    event.preventDefault();

    if (!destino.trim() || destino.length > 30) {
      setToast({ type: "error", message: "O destino deve ter entre 1 e 30 caracteres." });
      return;
    }

    if (descricao.length > 30) {
      setToast({ type: "error", message: "A descrição deve ter no máximo 30 caracteres." });
      return;
    }

    if (dataFim && dataFim < dataInicio) {
      setToast({ type: "error", message: "A data de fim não pode ser anterior à data de início." });
      return;
    }

    setEnviando(true);

    const formData = new FormData();

    formData.append("destino", destino);
    formData.append("dataInicio", dataInicio);
    formData.append("dataFim", dataFim);
    formData.append("descricao", descricao);
    if (imagem) {
      formData.append("imagem", imagem);
    }

    try {
      await adicionarViagem(formData);
      setToast({ type: "success", message: "Viagem cadastrada com sucesso!" });
      setDestino("");
      setDataInicio("");
      setDataFim("");
      setDescricao("");
      setImagem(null);
      event.target.reset();
    } catch (error) {
      setToast({ type: "error", message: error.message || "Não foi possível cadastrar a viagem." });
    } finally {
      setEnviando(false);
    }
  }

  return (
    <main className={styles.page}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h1 id="titulo-cadastro" className={styles.titulo}>Cadastrar Viagem</h1>

        <div className={styles.campo}>
          <label htmlFor="destino">Destino</label>

          <input
            type="text"
            id="destino"
            value={destino}
            maxLength={30}
            onChange={(event) => setDestino(event.target.value)}
            required
          />
        </div>

        <div className={styles.campo}>
          <label htmlFor="dataInicio">Data de início</label>

          <input
            type="date"
            id="dataInicio"
            value={dataInicio}
            onChange={(event) => setDataInicio(event.target.value)}
            required
          />
        </div>

        <div className={styles.campo}>
          <label htmlFor="dataFim">Data de fim</label>

          <input
            type="date"
            id="dataFim"
            value={dataFim}
            min={dataInicio || undefined}
            onChange={(event) => setDataFim(event.target.value)}
          />
        </div>

        <div className={styles.campo}>
          <label htmlFor="descricao">Descrição</label>

          <textarea
            id="descricao"
            value={descricao}
            maxLength={30}
            onChange={(event) => setDescricao(event.target.value)}
          />
        </div>

        <div className={styles.campo}>
          <label htmlFor="imagem">Imagem</label>

          <input
            type="file"
            id="imagem"
            accept="image/jpeg,image/png,image/webp"
            onChange={(event) => setImagem(event.target.files[0])}
            required
          />
        </div>

        <button className={styles.botao} type="submit" disabled={enviando}>
          {enviando ? "Cadastrando..." : "Cadastrar"}
        </button>

      </form>

      <Toast message={toast?.message} type={toast?.type} onClose={() => setToast(null)} />

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

export default CadastroViagem;