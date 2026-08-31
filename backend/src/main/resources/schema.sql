CREATE DATABASE projetoindividual;
USE projetoindividual;

CREATE TABLE IF NOT EXISTS viagem (

    id INT AUTO_INCREMENT PRIMARY KEY,
    destino VARCHAR(100) NOT NULL,
    data_inicio DATE NOT NULL,
    data_fim DATE,
    descricao VARCHAR(500),
    imagem LONGBLOB
    );

SELECT * FROM viagem;