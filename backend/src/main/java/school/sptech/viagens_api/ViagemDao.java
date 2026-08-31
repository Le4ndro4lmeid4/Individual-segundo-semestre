package school.sptech.viagens_api;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.sql.Date;
import java.util.List;

@Repository
public class ViagemDao {

    private final JdbcTemplate jdbcTemplate;

    public ViagemDao(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public void adicionar(Viagem viagem) {
        String sql = "INSERT INTO viagem (destino, data_inicio, data_fim, descricao, imagem) VALUES (?, ?, ?, ?, ?)";

        jdbcTemplate.update(
                sql,
                viagem.getDestino(),
                Date.valueOf(viagem.getDataInicio()),
                viagem.getDataFim() != null ? Date.valueOf(viagem.getDataFim()) : null,
                viagem.getDescricao(),
                viagem.getImagem()
        );
    }

    public List<Viagem> listar() {
        String sql = "SELECT * FROM viagem";

        return jdbcTemplate.query(sql, (rs, rowNum) -> {
            Viagem viagem = new Viagem();
            viagem.setId(rs.getInt("id"));
            viagem.setDestino(rs.getString("destino"));
            viagem.setDataInicio(rs.getDate("data_inicio").toLocalDate());

            Date dataFim = rs.getDate("data_fim");
            viagem.setDataFim(dataFim != null ? dataFim.toLocalDate() : null);

            viagem.setDescricao(rs.getString("descricao"));
            viagem.setImagem(rs.getBytes("imagem"));

            return viagem;
        });
    }

    public byte[] buscarImagemPorId(Integer id) {
        String sql = "SELECT imagem FROM viagem WHERE id = ?";

        return jdbcTemplate.queryForObject(
                sql,
                byte[].class,
                id
        );
    }
}
