const API_URL = "http://localhost:3000";

// Função para buscar professores
async function carregarProfessores() {
    try {
        const res = await fetch(`${API_URL}/usuarios/professor`);
        const professores = await res.json();
        renderTable(professores);
    } catch (err) {
        console.error("Erro ao carregar professores:", err);
    }
}

// Renderiza a tabela
function renderTable(professores) {
    const tbody = document.querySelector("#professoresTable tbody");
    tbody.innerHTML = "";

    professores.forEach(professor => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${professor.id}</td>
            <td><input type="text" value="${professor.nome}" data-id="${professor.id}" class="edit-nome"></td>
            <td><input type="email" value="${professor.email}" data-id="${professor.id}" class="edit-email"></td>
            <td><input type="text" value="${professor.materia || ''}" data-id="${professor.id}" class="edit-materia"></td>
            <td>
                <button class="save-btn" onclick="salvar(${professor.id})">Salvar</button>
                <button class="delete-btn" onclick="excluir(${professor.id})">Excluir</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// Salvar alterações via PUT
async function salvar(id) {
    const nome = document.querySelector(`.edit-nome[data-id='${id}']`).value;
    const email = document.querySelector(`.edit-email[data-id='${id}']`).value;
    const materia = document.querySelector(`.edit-materia[data-id='${id}']`).value || null;

    try {
        // Atualiza tabela de usuários
        await fetch(`${API_URL}/usuarios/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nome, email, senha: "senhaPadrao123" })
        });

        // Atualiza tabela de professores
        await fetch(`${API_URL}/professores/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ materia })
        });

        alert("Professor atualizado com sucesso!");
        carregarProfessores();
    } catch (err) {
        alert("Erro: " + err.message);
    }
}

// Excluir usuário
async function excluir(id) {
    if(!confirm("Deseja realmente excluir este professor?")) return;
    try {
        const res = await fetch(`${API_URL}/usuarios/${id}`, {
            method: "DELETE",
        });
        if (!res.ok) throw new Error("Erro ao excluir");
        alert("Professor excluído!");
        carregarProfessores();
    } catch (err) {
        alert("Erro: " + err.message);
    }
}

// Carrega professores ao abrir
carregarProfessores();
