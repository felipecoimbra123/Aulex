const API_URL = "http://localhost:3000";

// Carregar turmas
async function carregarTurmas() {
    try {
        const res = await fetch(`${API_URL}/turmas`);
        const turmas = await res.json();
        renderTable(turmas);
    } catch (err) {
        console.error("Erro ao carregar turmas:", err);
    }
}

// Renderiza a tabela
function renderTable(turmas) {
    const tbody = document.querySelector("#turmasTable tbody");
    tbody.innerHTML = "";

    turmas.forEach(turma => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${turma.id}</td>
            <td><input type="text" value="${turma.nome}" data-id="${turma.id}" class="edit-nome"></td>
            <td><input type="text" value="${turma.turno}" data-id="${turma.id}" class="edit-turno"></td>
            <td><input type="number" value="${turma.ano}" data-id="${turma.id}" class="edit-ano"></td>
            <td>
                <button class="save-btn" onclick="salvar(${turma.id})">Salvar</button>
                <button class="delete-btn" onclick="excluir(${turma.id})">Excluir</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// Salvar alterações
async function salvar(id) {
    const nome = document.querySelector(`.edit-nome[data-id='${id}']`).value;
    const turno = document.querySelector(`.edit-turno[data-id='${id}']`).value;
    const ano = parseInt(document.querySelector(`.edit-ano[data-id='${id}']`).value);

    try {
        await fetch(`${API_URL}/turmas/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nome, turno, ano })
        });

        alert("Turma atualizada com sucesso!");
        carregarTurmas();
    } catch (err) {
        alert("Erro: " + err.message);
    }
}

// Excluir turma
async function excluir(id) {
    if (!confirm("Deseja realmente excluir esta turma?")) return;
    try {
        const res = await fetch(`${API_URL}/turmas/${id}`, {
            method: "DELETE"
        });
        if (!res.ok) throw new Error("Erro ao excluir");
        alert("Turma excluída!");
        carregarTurmas();
    } catch (err) {
        alert("Erro: " + err.message);
    }
}

// Carrega turmas ao abrir
carregarTurmas();
