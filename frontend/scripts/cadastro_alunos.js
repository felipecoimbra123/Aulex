const API_URL = "http://localhost:3000";

const formAluno = document.querySelector(".form");

formAluno.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nome = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const senha = document.getElementById("password").value;
    const turma = document.getElementById("class").value;

    try {
        const res = await fetch(`${API_URL}/usuarios`, { 
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nome, email, senha, turma, papel: "aluno" }),
        });

        const data = await res.json();
        if (res.ok) {
            alert("Aluno cadastrado com sucesso!");
            formAluno.reset();
        } else {
            alert(`Erro: ${data.error}`);
        }
    } catch (err) {
        console.error(err);
        alert("Erro ao cadastrar aluno.");
    }
});
