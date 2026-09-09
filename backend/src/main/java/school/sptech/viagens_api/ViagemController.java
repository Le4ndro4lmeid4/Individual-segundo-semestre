package school.sptech.viagens_api;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.List;

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
            Viagem viagem = new Viagem();
            viagem.setDestino(destino);
            viagem.setDataInicio(LocalDate.parse(dataInicio));
            viagem.setDataFim(dataFim != null && !dataFim.isBlank() ? LocalDate.parse(dataFim) : null);
            viagem.setDescricao(descricao);
            viagem.setImagem(imagem.getBytes());

            viagemDao.adicionar(viagem);

            return ResponseEntity.status(201).body("Viagem cadastrada com sucesso!");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Erro ao cadastrar viagem.");
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<String> editar(
            @PathVariable Integer id,
            @RequestParam String destino,
            @RequestParam String dataInicio,
            @RequestParam(required = false) String dataFim,
            @RequestParam(required = false) String descricao
    ) {
        try {
            Viagem viagem = new Viagem();
            viagem.setId(id);
            viagem.setDestino(destino);
            viagem.setDataInicio(LocalDate.parse(dataInicio));
            viagem.setDataFim(dataFim != null && !dataFim.isBlank() ? LocalDate.parse(dataFim) : null);
            viagem.setDescricao(descricao);

            if (viagemDao.atualizar(viagem) == 0) {
                return ResponseEntity.notFound().build();
            }

            return ResponseEntity.ok("Viagem atualizada com sucesso!");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Erro ao atualizar viagem.");
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> remover(@PathVariable Integer id) {
        if (viagemDao.remover(id) == 0) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/imagem")
    public ResponseEntity<byte[]> buscarImagem(
            @PathVariable Integer id
    ) {
        try {
            byte[] imagem = viagemDao.buscarImagemPorId(id);

            return ResponseEntity
                    .ok()
                    .contentType(MediaType.IMAGE_JPEG)
                    .body(imagem);

        } catch (Exception e) {
            return ResponseEntity
                    .notFound()
                    .build();
        }
    }
}
