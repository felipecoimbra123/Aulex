const API_URL = "http://localhost:3000"; // ajuste se a porta for diferente

async function carregarListas() {
    try {
        // Buscar alunos
        const alunosRes = await fetch(`${API_URL}/alunos`);
        const alunos = await alunosRes.json();
        const listaAlunos = document.getElementById("lista-alunos");
        listaAlunos.innerHTML = "";
        alunos.forEach(aluno => {
            const li = document.createElement("li");
            li.innerHTML = `<a href="editar_aluno.html?id=${aluno.id}">${aluno.nome}</a>`;
            listaAlunos.appendChild(li);
        });

        // Buscar professores
        const profsRes = await fetch(`${API_URL}/professores`);
        const professores = await profsRes.json();
        const listaProfessores = document.getElementById("lista-professores");
        listaProfessores.innerHTML = "";
        professores.forEach(prof => {
            const li = document.createElement("li");
            li.innerHTML = `<a href="editar_professor.html?id=${prof.id}">${prof.nome} - ${prof.materia}</a>`;
            listaProfessores.appendChild(li);
        });

        // Buscar turmas
        const turmasRes = await fetch(`${API_URL}/turmas`);
        const turmas = await turmasRes.json();
        const listaTurmas = document.getElementById("lista-turmas");
        listaTurmas.innerHTML = "";
        turmas.forEach(turma => {
            const li = document.createElement("li");
            li.innerHTML = `<a href="editar_turma.html?id=${turma.id}">${turma.ano}º Ano ${turma.turma} - ${turma.turno}</a>`;
            listaTurmas.appendChild(li);
        });

    } catch (error) {
        console.error("Erro ao carregar listas:", error);
    }
}

// Carregar quando abrir a página
document.addEventListener("DOMContentLoaded", carregarListas);
