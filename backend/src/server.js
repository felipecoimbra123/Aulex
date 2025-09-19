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