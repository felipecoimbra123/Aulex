// JS
const API_URL = "http://localhost:3000";

async function carregarListas() {
  try {
    // Alunos
    const alunosRes = await fetch(`${API_URL}/usuarios/aluno`);
    const alunos = await alunosRes.json();
    const tbodyAlunos = document.querySelector("#tabela-alunos tbody");
    tbodyAlunos.innerHTML = "";
    alunos.forEach(aluno => {
      const tr = document.createElement("tr");
      tr.innerHTML = `<td><a href="editar_aluno.html?id=${aluno.id}">${aluno.nome}</a></td>`;
      tbodyAlunos.appendChild(tr);
    });

    // Professores
    const profsRes = await fetch(`${API_URL}/usuarios/professor`);
    const professores = await profsRes.json();
    const tbodyProfs = document.querySelector("#tabela-professores tbody");
    tbodyProfs.innerHTML = "";
    professores.forEach(prof => {
      const tr = document.createElement("tr");
      tr.innerHTML = `<td><a href="editar_professor.html?id=${prof.id}">${prof.nome}</a></td><td>${prof.materia || "Sem matéria"}</td>`;
      tbodyProfs.appendChild(tr);
    });

    // Turmas
    const turmasRes = await fetch(`${API_URL}/turmas`);
    const turmas = await turmasRes.json();
    const tbodyTurmas = document.querySelector("#tabela-turmas tbody");
    tbodyTurmas.innerHTML = "";
    turmas.forEach(turma => {
      const tr = document.createElement("tr");
      tr.innerHTML = `<td>${turma.ano}º</td><td><a href="editar_turma.html?id=${turma.id}">${turma.nome}</a></td><td>${turma.turno}</td>`;
      tbodyTurmas.appendChild(tr);
    });

  } catch (error) {
    console.error("Erro ao carregar listas:", error);
    alert("Não foi possível carregar as listas. Verifique se o servidor está rodando.");
  }
}

document.addEventListener("DOMContentLoaded", carregarListas);
