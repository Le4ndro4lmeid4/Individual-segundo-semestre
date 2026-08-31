import styles from "./ViagemCard.module.css";

function ViagemCard({ id, destino, dataInicio, dataFim, descricao }) {
  return (
    <article className={styles.card}>
      <div className={styles.imageWrap}>
        <img
          src={`http://localhost:8080/viagens/${id}/imagem`}
          alt={`${destino} - viagem`}
          className={styles.imagem}
        />
      </div>

      <div className={styles.content}>
        <h2 className={styles.destino}>{destino}</h2>
        <p className={styles.data}>{dataInicio} - {dataFim}</p>
        <p className={styles.descricao}>{descricao}</p>
      </div>
    </article>
  );
}

export default ViagemCard;