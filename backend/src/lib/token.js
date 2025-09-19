const jwt = require('jsonwebtoken')
require('dotenv/config')

const signJwt = (payload) => {
    const secret = process.env.JWT_SECRET || 'teste'

    try {
        return jwt.sign(payload, secret, {expiresIn: '1d'})
    }
    catch (err) {
        console.error('O login do JWT falhou!', error)
        return null
    }
}

const verifyJwt = (token) => {
    const secret = process.env.JWT_SECRET || 'teste'

    try {
        return jwt.verify(token, secret)
    }
    catch (err) {
        console.error('Verificação do JWT falhou!', err)
        return null
    }
}

module.exports = {
    signJwt,
    verifyJwt,
}