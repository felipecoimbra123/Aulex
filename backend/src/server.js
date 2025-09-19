const express = require('express');
const cors = require('cors');
const connection = require('./lib/db_config');
const { encryptPassword, comparePassword } = require('./lib/bcrypt');
const { z } = require('zod');
const { signJwt } = require('./lib/token');
const { autenticarToken } = require('./middlewares/autenticarMiddleware');

const app = express();
app.use(cors());
app.use(express.json());

const port = 3000;

