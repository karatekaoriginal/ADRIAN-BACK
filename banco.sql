CREATE TYPE LINGUAGEM AS ENUM 
('Python', 'HTML', 'CSS', 'JavaScript');


CREATE TABLE if not exists Usuario (
    id_usuario SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    senha  VARCHAR(128) NOT NULL,
    ativo BOOLEAN DEFAULT true
);

CREATE TABLE if not exists Arquivo (
    id_arquivo SERIAL PRIMARY KEY,
    Nome VARCHAR (255) NOT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ultima_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    LingProg LINGUAGEM,
    codigo text
);

CREATE TABLE if not exists Arquivo_Usuario(
	id_usuario INTEGER,
	id_arquivo INTEGER,
    PRIMARY KEY (id_usuario, id_arquivo),
    FOREIGN KEY (id_usuario) REFERENCES Usuario(id_usuario),
    FOREIGN KEY (id_arquivo) REFERENCES Arquivo(id_arquivo)
);

CREATE FUNCTION atualiza_timestamp()
RETURNS TRIGGER AS $$
BEGIN
   NEW.ultima_atualizacao = NOW();
   RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER trg_atualizar_tabela
BEFORE UPDATE ON Arquivo
FOR EACH ROW
EXECUTE PROCEDURE atualiza_timestamp();