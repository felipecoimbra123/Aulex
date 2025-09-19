const express = require('express')
const cors = require('cors')
const connection = require('.lib/db_config')
const app = express()
const { encryptPassword, comparePassword } = require('./lib/bcrypt')
const { z } = require('zod')
const { signJwt } = require('./lib/token')
const {autenticarToken} = require('./middlewares/autenticarMiddleware')

app.use(cors())
app.use(express.json())

const port = 3000;


const usuarioSchema = z.object({
    nome: z.string().min(2),
    email: z.string().email(),
    senha: z.string().min(8),
    papel: z.enum(['aluno', 'professor', 'pedagogo']),
    materia: z.string().optional(),
    turma_id: z.number().optional(), 
});

const turmaSchema = z.object({
    nome: z.string().min(1),
    turno: z.string().min(3),
    ano: z.number().int().min(1) // ano obrigatório, inteiro
});



app.post('/usuarios', async (req, res) => {
    try {
        const { nome, email, senha, papel, materia, turma_id } = usuarioSchema.parse(req.body);
        const hashed = await encryptPassword(senha);

        connection.query(
            'INSERT INTO usuarios (nome, email, senha, papel) VALUES (?, ?, ?, ?)',
            [nome, email, hashed, papel],
            (err, result) => {
                if (err) return res.status(500).json({ error: err.message });
                const usuarioId = result.insertId;

                if (papel === 'aluno') {
                    connection.query(
                        'INSERT INTO alunos (usuario_id, turma_id) VALUES (?, ?)',
                        [usuarioId, turma_id || null],
                        (err2) => {
                            if (err2) return res.status(500).json({ error: err2.message });
                            res.json({ id: usuarioId, nome, email, papel, turma_id });
                        }
                    );
                } else if (papel === 'professor') {
                    connection.query(
                        'INSERT INTO professores (usuario_id, materia) VALUES (?, ?)',
                        [usuarioId, materia || null],
                        (err2) => {
                            if (err2) return res.status(500).json({ error: err2.message });
                            res.json({ id: usuarioId, nome, email, papel, materia });
                        }
                    );
                } else { // pedagogo
                    connection.query(
                        'INSERT INTO pedagogos (usuario_id) VALUES (?)',
                        [usuarioId],
                        (err2) => {
                            if (err2) return res.status(500).json({ error: err2.message });
                            res.json({ id: usuarioId, nome, email, papel });
                        }
                    );
                }
            }
        );
    } catch (e) {
        res.status(400).json({ error: e.message });
    }
});


app.get('/usuarios/:papel', autenticarToken, (req, res) => {
    const { papel } = req.params;
    connection.query(
        'SELECT u.id, u.nome, u.email, u.papel, a.turma_id, p.materia FROM usuarios u ' +
        'LEFT JOIN alunos a ON u.id = a.usuario_id ' +
        'LEFT JOIN professores p ON u.id = p.usuario_id ' +
        'WHERE u.papel = ?',
        [papel],
        (err, rows) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(rows);
        }
    );
});


app.put('/usuarios/:id', autenticarToken, async (req, res) => {
    try {
        const { nome, email, senha, papel, materia, turma_id } = usuarioSchema.parse(req.body);
        const hashed = await encryptPassword(senha);

        connection.query(
            'UPDATE usuarios SET nome=?, email=?, senha=?, papel=? WHERE id=?',
            [nome, email, hashed, papel, req.params.id],
            (err) => {
                if (err) return res.status(500).json({ error: err.message });

                if (papel === 'aluno') {
                    connection.query(
                        'UPDATE alunos SET turma_id=? WHERE usuario_id=?',
                        [turma_id || null, req.params.id],
                        (err2) => {
                            if (err2) return res.status(500).json({ error: err2.message });
                            res.json({ updatedID: req.params.id });
                        }
                    );
                } else if (papel === 'professor') {
                    connection.query(
                        'UPDATE professores SET materia=? WHERE usuario_id=?',
                        [materia || null, req.params.id],
                        (err2) => {
                            if (err2) return res.status(500).json({ error: err2.message });
                            res.json({ updatedID: req.params.id });
                        }
                    );
                } else { // pedagogo
                    res.json({ updatedID: req.params.id });
                }
            }
        );
    } catch (e) {
        res.status(400).json({ error: e.message });
    }
});


app.delete('/usuarios/:id', autenticarToken, (req, res) => {
    connection.query('DELETE FROM usuarios WHERE id=?', [req.params.id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ deletedID: req.params.id });
    });
});


app.post('/usuario/login', (req, res) => {
    const loginSchema = z.object({
        email: z.string().max(320),
        senha: z.string().min(5).max(20)
    });

    const validacao = loginSchema.safeParse(req.body);
    if(!validacao.success) return res.status(400).json({ success: false, errors: validacao.error.errors });

    const { email, senha } = validacao.data;

    connection.query('SELECT * FROM usuarios WHERE email = ?', [email], async (err, results) => {
        if (err) return res.status(500).json({ success: false, message: 'Erro no servidor' });
        if (results.length === 0) return res.status(401).json({ success: false, message: 'Usuário ou senha incorretos!' });

        const usuario = results[0];
        try {
            const senhaCerta = await comparePassword(senha, usuario.senha);
            if(senhaCerta) {
                const token = signJwt({ id: usuario.id });
                res.json({ success: true, message: 'Login efetuado!', data: usuario, token });
            } else {
                res.status(401).json({ success: false, message: 'Usuário ou senha incorretos!' });
            }
        } catch (err) {
            res.status(500).json({ success: false, message: 'Erro ao verificar senha' });
        }
    });
});

app.put('/usuario', autenticarToken, (req, res) => {
    const editarUsuarioEsquema = z.object({
        nome: z.string().max(20, { message: "O nome deve ter no máximo 20 caracteres" }),
        email: z.email({ message: "Formato de e-mail inválido" }),
        senha: z.string().min(5, { message: "A senha deve ter no mínimo 5 caracteres" }).max(20, { message: "A senha deve ter no máximo 20 caracteres" }),
    })

    const validacao = editarUsuarioEsquema.safeParse(req.body)

    if(!validacao.success) {
        return res.status(400).json({ success: false, error: validacao.error.issues[0].message })
    }

    const id = req.usuario.id
    const { nome, email, senha } = validacao.data

    const query = 'UPDATE usuarios SET nome = ?, email = ?, senha = ? WHERE id = ?'

    connection.query(query, [nome, email, senha, id], (err, result) => {
        if (err) {
            return res.status(500).json({ success: false, err, message: 'Erro ao editar usuário!' })
        }

        res.json({success: true, message: 'Usuário editado com sucesso!', data: result})
    })
})

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`)
})

app.post('/turmas', (req, res) => {
    try {
        const { nome, turno, ano } = turmaSchema.parse(req.body); // <-- aqui
        connection.query('INSERT INTO turmas (nome, turno, ano) VALUES (?, ?, ?)', [nome, turno, ano], (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ id: result.insertId, nome, turno, ano });
        });
    } catch (e) {
        res.status(400).json({ error: e.message });
    }
});


app.get('/turmas', autenticarToken, (req, res) => {
    connection.query('SELECT * FROM turmas', (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.put('/turmas/:id', autenticarToken, (req, res) => {
    try {
        const { nome, turno, ano } = turmaSchema.parse(req.body);
        connection.query('UPDATE turmas SET nome=?, turno=?, ano=? WHERE id=?', [nome, turno, ano, req.params.id], (err) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ updatedID: req.params.id });
        });
    } catch (e) {
        res.status(400).json({ error: e.message });
    }
});

app.delete('/turmas/:id', autenticarToken, (req, res) => {
    connection.query('DELETE FROM turmas WHERE id=?', [req.params.id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ deletedID: req.params.id });
    });
});

app.listen(port, () => console.log(`Servidor rodando em http://localhost:${port}`));
