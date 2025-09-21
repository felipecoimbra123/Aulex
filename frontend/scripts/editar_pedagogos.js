const API_URL = "http://localhost:3000";

// Carregar pedagogos
async function carregarPedagogos() {
    try {
        const res = await fetch(`${API_URL}/usuarios/pedagogo`);
        const pedagogos = await res.json();
        renderTable(pedagogos);
    } catch (err) {
        console.error("Erro ao carregar pedagogos:", err);
    }
}

// Renderiza a tabela
function renderTable(pedagogos) {
    const tbody = document.querySelector("#pedagogosTable tbody");
    tbody.innerHTML = "";

    pedagogos.forEach(pedagogo => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${pedagogo.id}</td>
            <td><input type="text" value="${pedagogo.nome}" data-id="${pedagogo.id}" class="edit-nome"></td>
            <td><input type="email" value="${pedagogo.email}" data-id="${pedagogo.id}" class="edit-email"></td>
            <td>
                <button class="save-btn" onclick="salvar(${pedagogo.id})">Salvar</button>
                <button class="delete-btn" onclick="excluir(${pedagogo.id})">Excluir</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// Salvar alterações
async function salvar(id) {
    const nome = document.querySelector(`.edit-nome[data-id='${id}']`).value;
    const email = document.querySelector(`.edit-email[data-id='${id}']`).value;

    try {
        await fetch(`${API_URL}/usuarios/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nome, email, senha: "senhaPadrao123" })
        });

        alert("Pedagogo atualizado com sucesso!");
        carregarPedagogos();
    } catch (err) {
        alert("Erro: " + err.message);
    }
}

// Excluir pedagogo
async function excluir(id) {
    if (!confirm("Deseja realmente excluir este pedagogo?")) return;
    try {
        const res = await fetch(`${API_URL}/usuarios/${id}`, {
            method: "DELETE"
        });
        if (!res.ok) throw new Error("Erro ao excluir");
        alert("Pedagogo excluído!");
        carregarPedagogos();
    } catch (err) {
        alert("Erro: " + err.message);
    }
}

// Carrega pedagogos ao abrir
carregarPedagogos();
