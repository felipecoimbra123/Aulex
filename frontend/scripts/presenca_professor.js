function gerarAttendance() {
    const attendanceTable = document.getElementById("attendanceTable");

    // Lista de alunos
    const alunos = Array.from(attendanceTable.tBodies[0].rows)
                        .map(row => row.cells[0].textContent);

    // Limpa o cabeçalho e deixa só "Aluno"
    const theadRow = attendanceTable.tHead.rows[0];
    theadRow.innerHTML = "<th>Aluno</th>";

    // Limpa o corpo da tabela
    const tbody = attendanceTable.tBodies[0];
    tbody.innerHTML = "";

    const hoje = new Date();
    const mesAtual = hoje.getMonth();
    const anoAtual = hoje.getFullYear();
    const diasNoMes = new Date(anoAtual, mesAtual + 1, 0).getDate();

    // Cabeçalho com todos os dias do mês
    for (let d = 1; d <= diasNoMes; d++) {
        const th = document.createElement("th");
        th.textContent = d;
        theadRow.appendChild(th);
    }

    // Linhas para cada aluno
    for (let aluno of alunos) {
        const tr = document.createElement("tr");

        // Coluna do nome do aluno
        const tdAluno = document.createElement("td");
        tdAluno.textContent = aluno;
        tr.appendChild(tdAluno);

        // Colunas de checkboxes
        for (let d = 1; d <= diasNoMes; d++) {
            const td = document.createElement("td");
            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.disabled = (d !== hoje.getDate()); // apenas hoje editável
            td.appendChild(checkbox);
            tr.appendChild(td);
        }

        tbody.appendChild(tr);
    }
}

// Gera tabela ao carregar a página
gerarAttendance();