import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { adicionarViagem } from "../services/viagemService";
import styles from "./CadastroViagem.module.css";

function CadastroViagem() {
  const navigate = useNavigate();
  const [destino, setDestino] = useState("");
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");
  const [descricao, setDescricao] = useState("");
  const [imagem, setImagem] = useState(null);

  async function handleSubmit(event) {
    event.preventDefault();

    const formData = new FormData();

    formData.append("destino", destino);
    formData.append("dataInicio", dataInicio);
    formData.append("dataFim", dataFim);
    formData.append("descricao", descricao);
    formData.append("imagem", imagem);

    const resultado = await adicionarViagem(formData);

    console.log(resultado);
  }

  return (
    <main className={styles.page}>
      <form className={styles.form} onSubmit={handleSubmit} aria-labelledby="titulo-cadastro">
        <h1 id="titulo-cadastro" className={styles.titulo}>Cadastrar Viagem</h1>

        <div className={styles.campo}>
          <label htmlFor="destino">Destino</label>

          <input
            type="text"
            id="destino"
            value={destino}
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
            onChange={(event) => setDataFim(event.target.value)}
          />
        </div>

        <div className={styles.campo}>
          <label htmlFor="descricao">Descrição</label>

          <textarea
            id="descricao"
            value={descricao}
            onChange={(event) => setDescricao(event.target.value)}
          />
        </div>

        <div className={styles.campo}>
          <label htmlFor="imagem">Imagem</label>

          <input
            type="file"
            id="imagem"
            accept="image/*"
            onChange={(event) => setImagem(event.target.files[0])}
            required
          />
        </div>

        <button className={styles.botao} type="submit">
          Cadastrar
        </button>

      </form>

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

export default CadastroViagem;