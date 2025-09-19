const API_URL = "http://localhost:3000"; // ajuste para sua URL do backend

const formPedagogo = document.querySelector(".form");

formPedagogo.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nome = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const senha = document.getElementById("password").value;

    try {
        const res = await fetch(`${API_URL}/usuarios`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nome, email, senha, papel: "pedagogo" }),
        });

        const data = await res.json();

        if (res.ok) {
            alert("Pedagogo cadastrado com sucesso!");
            formPedagogo.reset();
        } else {
            alert(`Erro: ${data.error}`);
        }
    } catch (err) {
        console.error(err);
        alert("Erro ao cadastrar pedagogo.");
    }
});
