package school.sptech.viagens_api;

import java.time.LocalDate;
import java.time.format.DateTimeParseException;
import java.util.List;

import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/viagens")
public class ViagemController {

    private final ViagemDao viagemDao;

    public ViagemController(ViagemDao viagemDao) {
        this.viagemDao = viagemDao;
    }

    @GetMapping
    public ResponseEntity<List<Viagem>> listar() {
        return ResponseEntity.status(200).body(viagemDao.listar());
    }

    @PostMapping
    public ResponseEntity<String> adicionar(
            @RequestParam String destino,
            @RequestParam String dataInicio,
            @RequestParam(required = false) String dataFim,
            @RequestParam(required = false) String descricao,
            @RequestParam("imagem") MultipartFile imagem
    ) {
        try {
            if (destino.isBlank() || destino.length() > 30) {
                return ResponseEntity.status(400).body("O destino deve ter entre 1 e 30 caracteres.");
            }
            if (descricao != null && descricao.length() > 30) {
                return ResponseEntity.status(400).body("A descrição deve ter no máximo 30 caracteres.");
            }
            if (imagem.isEmpty() || !tipoImagemPermitido(imagem)) {
                return ResponseEntity.status(400).body("Envie uma imagem válida.");
            }

            LocalDate inicio = LocalDate.parse(dataInicio);
            LocalDate fim = dataFim != null && !dataFim.isBlank() ? LocalDate.parse(dataFim) : null;

            if (fim != null && fim.isBefore(inicio)) {
                return ResponseEntity.status(400).body("A data de fim não pode ser anterior à data de início.");
            }

            Viagem viagem = new Viagem();
            viagem.setDestino(destino);
            viagem.setDataInicio(inicio);
            viagem.setDataFim(fim);
            viagem.setDescricao(descricao);
            viagem.setImagem(imagem.getBytes());
            viagem.setTipoImagem(imagem.getContentType());

            viagemDao.adicionar(viagem);

            return ResponseEntity.status(201).body("Viagem cadastrada com sucesso!");
        } catch (DateTimeParseException e) {
            return ResponseEntity.status(400).body("Informe datas válidas.");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Erro ao cadastrar viagem.");
        }
    }

    @PatchMapping("/{id}")
    public ResponseEntity<String> editar(
            @PathVariable Integer id,
            @RequestParam(required = false) String destino,
            @RequestParam(required = false) String dataInicio,
            @RequestParam(required = false) String dataFim,
            @RequestParam(required = false) String descricao,
            @RequestParam(required = false) MultipartFile imagem
    ) {
        try {
            if (destino != null && (destino.isBlank() || destino.length() > 30)) {
                return ResponseEntity.status(400).body("O destino deve ter entre 1 e 30 caracteres.");
            }
            if (descricao != null && descricao.length() > 30) {
                return ResponseEntity.status(400).body("A descrição deve ter no máximo 30 caracteres.");
            }
                if (imagem != null && !imagem.isEmpty()
                    && !tipoImagemPermitido(imagem)) {
                return ResponseEntity.status(400).body("Envie uma imagem válida.");
            }

            Viagem viagemAtual = viagemDao.buscarPorId(id);
            LocalDate inicio = dataInicio != null && !dataInicio.isBlank()
                ? LocalDate.parse(dataInicio)
                : viagemAtual.getDataInicio();
            LocalDate fim = dataFim != null
                ? (dataFim.isBlank() ? null : LocalDate.parse(dataFim))
                : viagemAtual.getDataFim();

            if (fim != null && fim.isBefore(inicio)) {
            return ResponseEntity.status(400).body("A data de fim não pode ser anterior à data de início.");
            }

            Viagem viagem = new Viagem();
            viagem.setId(id);
            viagem.setDestino(destino);
            viagem.setDataInicio(dataInicio != null && !dataInicio.isBlank() ? inicio : null);
            viagem.setDataFim(dataFim != null && !dataFim.isBlank() ? fim : null);
            viagem.setDescricao(descricao);
            if (imagem != null && !imagem.isEmpty()) {
                viagem.setImagem(imagem.getBytes());
                viagem.setTipoImagem(imagem.getContentType());
            }

            if (viagemDao.atualizar(viagem, dataFim != null, descricao != null) == 0) {
                return ResponseEntity.status(404).body("Viagem não encontrada.");
            }

            return ResponseEntity.status(200).body("Viagem atualizada com sucesso!");
        } catch (EmptyResultDataAccessException e) {
            return ResponseEntity.status(404).body("Viagem não encontrada.");
        } catch (DateTimeParseException e) {
            return ResponseEntity.status(400).body("Informe datas válidas.");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Erro ao atualizar viagem.");
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> remover(@PathVariable Integer id) {
        if (viagemDao.remover(id) == 0) {
            return ResponseEntity.status(404).build();
        }

        return ResponseEntity.status(204).build();
    }

    @GetMapping("/{id}/imagem")
    public ResponseEntity<byte[]> buscarImagem(
            @PathVariable Integer id
    ) {
        try {
            byte[] imagem = viagemDao.buscarImagemPorId(id);

                String tipoImagem = viagemDao.buscarPorId(id).getTipoImagem();
                MediaType contentType = tipoImagem != null
                    ? MediaType.parseMediaType(tipoImagem)
                    : MediaType.IMAGE_JPEG;

                return ResponseEntity.ok().contentType(contentType).body(imagem);

        } catch (Exception e) {
                return ResponseEntity.status(404).build();
        }
    }

    private boolean tipoImagemPermitido(MultipartFile imagem) {
        return imagem.getContentType() != null
                && (imagem.getContentType().equals("image/jpeg")
                || imagem.getContentType().equals("image/png")
                || imagem.getContentType().equals("image/webp"));
    }

}
