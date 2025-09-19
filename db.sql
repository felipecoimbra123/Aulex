CREATE DATABASE aulex;
USE aulex;


CREATE TABLE usuarios (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    papel ENUM('aluno', 'professor', 'pedagogo') NOT NULL
);


CREATE TABLE alunos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT NOT NULL,
    turma_id INT,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    FOREIGN KEY (turma_id) REFERENCES turmas(id)
);


CREATE TABLE professores (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT NOT NULL,
    materia VARCHAR(100),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);


CREATE TABLE pedagogos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT NOT NULL,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);


CREATE TABLE turmas (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(255) NOT NULL,
    turno VARCHAR(255) NOT NULL,
    ano INT NOT NULL
);


CREATE TABLE presencas (
    id INT PRIMARY KEY AUTO_INCREMENT,
    status ENUM('presente','falta'),
    usuario_id INT NOT NULL,
    turma_id INT NOT NULL,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    FOREIGN KEY (turma_id) REFERENCES turmas(id)
);


CREATE TABLE notas (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT NOT NULL,
    nota DECIMAL(5,2),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);


drop database aulex;
select * from usuarios;
select * from alunos;
select * from professores;
select * from turmas