const express = require('express')
const cors = require('cors')
const connection = require('./lib/db_config')
const app = express()
const { encryptPassword, comparePassword } = require('./lib/bcrypt')
const { z } = require('zod')
const { signJwt } = require('./lib/token')
const {autenticarToken} = require('./middlewares/autenticarMiddleware')

app.use(cors())
app.use(express.json())

const port = 3000

app.post('/usuario/login', (req, res) => {
    const loginUsuarioEsquema = z.object({
        email: z.string().max(320),
        senha: z.string().min(5).max(20) 
    })

    const validacao = loginUsuarioEsquema.safeParse(req.body)

    if(!validacao.success) {
        console.log(validacao)
        return res.status(400).json({ success: false, errors: validacao.error.errors })
    }

    const { email, senha } = validacao.data

    const query = 'SELECT * FROM usuarios WHERE email = ?'
    connection.query(query, [email], async (err, results) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Erro no servidor' })
        }

        if(results.length === 0) {
            return res.status(401).json({ success: false, message: 'Usuário ou senha incorretos!' })
        }

        const usuario = results[0]

        try {
            const senhaCerta = await comparePassword(senha, usuario.senha)

            if(senhaCerta) {
                const token = signJwt({ id: usuario.id })
                if(!token) {
                    res.status(500).json({ success: false })
                }

                res.json({ success: true, message: 'Sucesso no login!', data: usuario, token })

            } else {
                res.status(401).json({ success: false, message: 'Usuário ou senha incorretos!' })
            }
        } catch (err) {
            res.status(500).json({ success: false, message: 'Erro ao verificar senha' })
        }
    })
})

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