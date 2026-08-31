package school.sptech.viagens_api;

import java.time.LocalDate;

public class Viagem {

    private Integer id;
    private String destino;
    private LocalDate dataInicio;
    private LocalDate dataFim;
    private String descricao;
    private byte[] imagem;

    public Viagem() {
    }

    public Viagem(Integer id, String destino, LocalDate dataInicio, LocalDate dataFim, String descricao, byte[] imagem) {
        this.id = id;
        this.destino = destino;
        this.dataInicio = dataInicio;
        this.dataFim = dataFim;
        this.descricao = descricao;
        this.imagem = imagem;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getDestino() {
        return destino;
    }

    public void setDestino(String destino) {
        this.destino = destino;
    }

    public LocalDate getDataInicio() {
        return dataInicio;
    }

    public void setDataInicio(LocalDate dataInicio) {
        this.dataInicio = dataInicio;
    }

    public LocalDate getDataFim() {
        return dataFim;
    }

    public void setDataFim(LocalDate dataFim) {
        this.dataFim = dataFim;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public byte[] getImagem() {
        return imagem;
    }

    public void setImagem(byte[] imagem) {
        this.imagem = imagem;
    }
}