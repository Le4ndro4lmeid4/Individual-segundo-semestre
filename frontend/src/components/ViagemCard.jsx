import styles from "./ViagemCard.module.css";
import { useState } from "react";
import { createPortal } from "react-dom";
import { Pencil, Trash2 } from "lucide-react";

function formatarData(data) {
  if (!data) return "Sem data final";

  const [ano, mes, dia] = data.split("-");
  return `${dia}/${mes}/${ano}`;
}

function ViagemCard({ id, destino, dataInicio, dataFim, descricao, onSave, onDelete }) {
  const [modalAberto, setModalAberto] = useState(false);
  const [confirmacaoAberta, setConfirmacaoAberta] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [apagando, setApagando] = useState(false);
  const [versaoImagem, setVersaoImagem] = useState(0);
  const [dados, setDados] = useState({ destino, dataInicio, dataFim: dataFim || "", descricao: descricao || "", imagem: null });

  const alterarCampo = (campo, valor) => {
    setDados((dadosAtuais) => ({ ...dadosAtuais, [campo]: valor }));
  };

  const cancelarEdicao = () => {
    setDados({ destino, dataInicio, dataFim: dataFim || "", descricao: descricao || "", imagem: null });
    setModalAberto(false);
  };

  const salvarEdicao = async () => {
    const dadosOriginais = { destino, dataInicio, dataFim: dataFim || "", descricao: descricao || "" };
    const dadosAlterados = Object.fromEntries(
      Object.entries(dados).filter(([campo, valor]) => campo === "imagem" || valor !== dadosOriginais[campo])
    );

    if (Object.keys(dadosAlterados).length === 0) {
      setModalAberto(false);
      return;
    }

    setSalvando(true);
    const salvou = await onSave(id, dadosAlterados);
    setSalvando(false);

    if (salvou) {
      if (dados.imagem) {
        setVersaoImagem(Date.now());
      }
      setModalAberto(false);
    }
  };

  const apagarFoto = async () => {
    setApagando(true);
    await onDelete(id);
    setApagando(false);
    setConfirmacaoAberta(false);
  };

  return (
    <article className={styles.card}>
      <div className={styles.imageWrap}>
        <img
          src={`http://localhost:8080/viagens/${id}/imagem?v=${versaoImagem}`}
          alt={`${destino} - viagem`}
          className={styles.imagem}
        />
        <div className={styles.cardActions}>
          <button type="button" className={styles.iconButton} onClick={() => setModalAberto(true)} aria-label="Editar viagem" title="Editar viagem">
            <Pencil aria-hidden="true" />
          </button>
          <button type="button" className={`${styles.iconButton} ${styles.deleteButton}`} onClick={() => setConfirmacaoAberta(true)} disabled={apagando} aria-label="Apagar viagem" title="Apagar viagem">
            {apagando ? "..." : <Trash2 aria-hidden="true" />}
          </button>
        </div>
      </div>

      <div className={styles.content}>
        <h2 className={styles.destino}>{destino}</h2>
        <p className={styles.data}>{formatarData(dataInicio)} - {formatarData(dataFim)}</p>
        <p className={styles.descricao}>{descricao || "Sem descrição"}</p>
      </div>

      {modalAberto && (
        createPortal(<div className={styles.modalBackdrop} role="presentation" onMouseDown={(event) => event.target === event.currentTarget && !salvando && cancelarEdicao()}>
          <div className={styles.modal} role="dialog" aria-modal="true" aria-labelledby={`editar-viagem-${id}`}>
            <div className={styles.modalHeader}>
              <h2 id={`editar-viagem-${id}`}>Editar viagem</h2>
            </div>
            <input
              className={styles.input}
              value={dados.destino}
              onChange={(event) => alterarCampo("destino", event.target.value)}
              aria-label="Destino"
              placeholder="Destino"
            />
            <div className={styles.datas}>
              <input
                className={styles.input}
                type="date"
                value={dados.dataInicio}
                onChange={(event) => alterarCampo("dataInicio", event.target.value)}
                aria-label="Data de início"
              />
              <input
                className={styles.input}
                type="date"
                value={dados.dataFim}
                onChange={(event) => alterarCampo("dataFim", event.target.value)}
                aria-label="Data de fim"
              />
            </div>
            <textarea
              className={styles.input}
              value={dados.descricao}
              onChange={(event) => alterarCampo("descricao", event.target.value)}
              aria-label="Descrição"
              placeholder="Descrição"
              rows="4"
            />
            <label className={styles.fileInput}>
              Foto da viagem
              <input
                type="file"
                accept="image/*"
                onChange={(event) => alterarCampo("imagem", event.target.files[0] || null)}
              />
            </label>
            <div className={styles.actions}>
              <button type="button" onClick={salvarEdicao} disabled={salvando || !dados.destino || !dados.dataInicio}>
                {salvando ? "Salvando..." : "Salvar"}
              </button>
              <button type="button" onClick={cancelarEdicao} disabled={salvando}>
                Cancelar
              </button>
            </div>
          </div>
        </div>, document.body)
      )}

      {confirmacaoAberta && (
        createPortal(<div className={styles.modalBackdrop} role="presentation" onMouseDown={(event) => event.target === event.currentTarget && !apagando && setConfirmacaoAberta(false)}>
          <div className={styles.confirmationModal} role="dialog" aria-modal="true" aria-labelledby={`confirmar-exclusao-${id}`}>
            <h2 id={`confirmar-exclusao-${id}`}>Apagar viagem?</h2>
            <p>Essa ação não poderá ser desfeita.</p>
            <div className={styles.actions}>
              <button type="button" className={styles.confirmDeleteButton} onClick={apagarFoto} disabled={apagando}>
                {apagando ? "Apagando..." : "Apagar"}
              </button>
              <button type="button" onClick={() => setConfirmacaoAberta(false)} disabled={apagando}>
                Cancelar
              </button>
            </div>
          </div>
        </div>, document.body)
      )}
    </article>
  );
}

export default ViagemCard;