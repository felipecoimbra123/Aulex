const API_URL = "http://localhost:3000";

const formTurma = document.querySelector(".form");

formTurma.addEventListener("submit", async (e) => {
    e.preventDefault();

    const turno = document.getElementById("turno").value;
    const ano = parseInt(document.getElementById("ano").value);
    const turma = document.getElementById("turma").value;

    try {
        const res = await fetch(`${API_URL}/turmas`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ turno, ano, nome:turma }),
        });

        const data = await res.json();
        if (res.ok) {
            alert("Turma cadastrada com sucesso!");
            formTurma.reset();
        } else {
            alert(`Erro: ${data.error}`);
        }
    } catch (err) {
        console.error(err);
        alert("Erro ao cadastrar turma.");
    }
});
