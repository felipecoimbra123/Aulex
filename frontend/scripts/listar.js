const API_URL = "http://localhost:3000"; // ajuste se a porta for diferente

async function carregarListas() {
    const token = localStorage.getItem('token');
    if (!token) {
        alert("Você precisa estar logado para ver as listas!");
        return;
    }

    const headers = { 'Authorization': `Bearer ${token}` };

    try {
        // ----------------------
        // Carregar Alunos
        // ----------------------
        const alunosRes = await fetch(`${API_URL}/usuarios/aluno`, { headers });
        if (!alunosRes.ok) throw new Error(`Erro ${alunosRes.status} ao carregar alunos`);
        const alunos = await alunosRes.json();
        const listaAlunos = document.getElementById("lista-alunos");
        if (listaAlunos) {
            listaAlunos.innerHTML = "";
            alunos.forEach(aluno => {
                const li = document.createElement("li");
                li.innerHTML = `<a href="editar_aluno.html?id=${aluno.id}">${aluno.nome}</a>`;
                listaAlunos.appendChild(li);
            });
        }

        // ----------------------
        // Carregar Professores
        // ----------------------
        const profsRes = await fetch(`${API_URL}/usuarios/professor`, { headers });
        if (!profsRes.ok) throw new Error(`Erro ${profsRes.status} ao carregar professores`);
        const professores = await profsRes.json();
        const listaProfessores = document.getElementById("lista-professores");
        if (listaProfessores) {
            listaProfessores.innerHTML = "";
            professores.forEach(prof => {
                const li = document.createElement("li");
                li.innerHTML = `<a href="editar_professor.html?id=${prof.id}">${prof.nome} - ${prof.materia || "Sem matéria"}</a>`;
                listaProfessores.appendChild(li);
            });
        }

        // ----------------------
        // Carregar Pedagogos
        // ----------------------
        const pedagRes = await fetch(`${API_URL}/usuarios/pedagogo`, { headers });
        if (!pedagRes.ok) throw new Error(`Erro ${pedagRes.status} ao carregar pedagogos`);
        const pedagogos = await pedagRes.json();
        const listaPedagogos = document.getElementById("lista-pedagogos");
        if (listaPedagogos) {
            listaPedagogos.innerHTML = "";
            pedagogos.forEach(ped => {
                const li = document.createElement("li");
                li.innerHTML = `<a href="editar_pedagogo.html?id=${ped.id}">${ped.nome}</a>`;
                listaPedagogos.appendChild(li);
            });
        }

        // ----------------------
        // Carregar Turmas
        // ----------------------
        const turmasRes = await fetch(`${API_URL}/turmas`, { headers });
        if (!turmasRes.ok) throw new Error(`Erro ${turmasRes.status} ao carregar turmas`);
        const turmas = await turmasRes.json();
        const listaTurmas = document.getElementById("lista-turmas");
        if (listaTurmas) {
            listaTurmas.innerHTML = "";
            turmas.forEach(turma => {
                const li = document.createElement("li");
                li.innerHTML = `<a href="editar_turma.html?id=${turma.id}">${turma.ano}º Ano ${turma.nome} - ${turma.turno}</a>`;
                listaTurmas.appendChild(li);
            });
        }

    } catch (error) {
        console.error("Erro ao carregar listas:", error);
        alert("Não foi possível carregar as listas. Verifique se você está logado e se o servidor está rodando.");
    }
}

// Carregar ao abrir a página
document.addEventListener("DOMContentLoaded", carregarListas);
