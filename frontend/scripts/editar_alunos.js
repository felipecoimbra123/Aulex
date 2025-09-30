const API_URL = "http://localhost:3000"; // Endereço do backend

// Função para buscar alunos do backend
async function carregarAlunos() {
    try {
        const res = await fetch(`${API_URL}/usuarios/aluno`);
        const alunos = await res.json();
        renderTable(alunos);
    } catch (err) {
        console.error("Erro ao carregar alunos:", err);
    }
}

// Renderiza a tabela
function renderTable(alunos) {
    const tbody = document.querySelector("#alunosTable tbody");
    tbody.innerHTML = "";

    alunos.forEach(aluno => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${aluno.id}</td>
            <td><input type="text" value="${aluno.nome}" data-id="${aluno.id}" class="edit-nome"></td>
            <td><input type="email" value="${aluno.email}" data-id="${aluno.id}" class="edit-email"></td>
            <td>
                <input type="number" value="${aluno.turma_id || ''}" data-id="${aluno.id}" class="edit-turma">
            </td>
            <td>
                <button class="save-btn" onclick="salvar(${aluno.id})">Salvar</button>
                <button class="delete-btn" onclick="excluir(${aluno.id})">Excluir</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// Salvar alterações via PUT
async function salvar(id) {
    const nome = document.querySelector(`.edit-nome[data-id='${id}']`).value;
    const email = document.querySelector(`.edit-email[data-id='${id}']`).value;
    const turma_id = document.querySelector(`.edit-turma[data-id='${id}']`).value || null;

    try {
       await fetch(`${API_URL}/usuarios/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nome, email, senha: "senhaPadrao123" })
});

// Atualiza turma
await fetch(`${API_URL}/alunos/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ turma_id })
});

        alert("Aluno atualizado com sucesso!");
        carregarAlunos();
    } catch (err) {
        alert("Erro: " + err.message);
    }
}

async function excluir(id) {
    if(!confirm("Deseja realmente excluir este aluno?")) return;
    try {
        const res = await fetch(`${API_URL}/usuarios/${id}`, {
            method: "DELETE"
        });
        if (!res.ok) throw new Error("Erro ao excluir");
        alert("Aluno excluído!");
        carregarAlunos();
    } catch (err) {
        alert("Erro: " + err.message);
    }
}

// Carrega alunos ao abrir
carregarAlunos();