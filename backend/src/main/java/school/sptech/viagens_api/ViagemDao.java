package school.sptech.viagens_api;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.sql.Date;
import java.util.ArrayList;
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

    public int atualizar(Viagem viagem, boolean atualizarDataFim, boolean atualizarDescricao) {
        List<Object> valores = new ArrayList<>();
        List<String> campos = new ArrayList<>();

        if (viagem.getDestino() != null) {
            campos.add("destino = ?");
            valores.add(viagem.getDestino());
        }
        if (viagem.getDataInicio() != null) {
            campos.add("data_inicio = ?");
            valores.add(Date.valueOf(viagem.getDataInicio()));
        }
        if (atualizarDataFim) {
            campos.add("data_fim = ?");
            valores.add(viagem.getDataFim() != null ? Date.valueOf(viagem.getDataFim()) : null);
        }
        if (atualizarDescricao) {
            campos.add("descricao = ?");
            valores.add(viagem.getDescricao());
        }
        if (viagem.getImagem() != null) {
            campos.add("imagem = ?");
            valores.add(viagem.getImagem());
        }

        if (campos.isEmpty()) {
            return 0;
        }

        valores.add(viagem.getId());
        String sql = "UPDATE viagem SET " + String.join(", ", campos) + " WHERE id = ?";
        return jdbcTemplate.update(sql, valores.toArray());
    }

    public int remover(Integer id) {
        String sql = "DELETE FROM viagem WHERE id = ?";
        return jdbcTemplate.update(sql, id);
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
