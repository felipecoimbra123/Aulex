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