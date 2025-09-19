create database aulex;
use aulex;

create table usuarios(
	id int primary key auto_increment,
    nome varchar(255) not null,
    email varchar(255) not null unique,
    cpf varchar(11) not null unique,
    senha varchar(255) not null,
    papel enum('aluno', 'professor', 'pedagogo') not null
);

create table usuario_has_turma(
	id int primary key auto_increment,
    usuario_id int not null,
    turma_id int not null,
    foreign key (usuario_id) references usuarios(id),
    foreign key (turma_id) references turmas(id)
);

create table turmas(
	id int primary key auto_increment,
    nome varchar(255) not null,
    turno varchar(255) not null
);

create table presencas(
	id int primary key auto_increment,
    status enum('presente', 'falta'),
	usuario_id int not null,
    turma_id int not null,
    foreign key (usuario_id) references usuarios(id),
    foreign key (turma_id) references turmas(id)
);

create table notas(
	id int primary key auto_increment,
	usuario_id int not null,
    foreign key (usuario_id) references usuarios(id)
);