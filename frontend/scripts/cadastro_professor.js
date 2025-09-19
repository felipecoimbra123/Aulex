const API_URL = "http://localhost:3000";

const formProfessor = document.querySelector(".form");

formProfessor.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nome = document.getElementById("name").value;
    const materia = document.getElementById("subject").value;
    const email = document.getElementById("email").value;
    const senha = document.getElementById("password").value;

    try {
        const res = await fetch(`${API_URL}/usuarios`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nome, materia, email, senha, papel: "professor" }),
        });

        const data = await res.json();
        if (res.ok) {
            alert("Professor cadastrado com sucesso!");
            formProfessor.reset();
        } else {
            alert(`Erro: ${data.error}`);
        }
    } catch (err) {
        console.error(err);
        alert("Erro ao cadastrar professor.");
    }
});
