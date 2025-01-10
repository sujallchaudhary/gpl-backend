import express from "express";
import {join} from "path";
import { validateToken } from './controllers/auth-controller.js';
import verifyJWT from "./middlewares/verify-jwt-middleware.js";
import dotenv from "dotenv";
dotenv.config();

const { HOST, PORT } = process.env

const app = express()
app.use(express.json({ type: 'application/json' }))
app.use(express.urlencoded({ extended: true }))

// Routes
app.post('/auth', validateToken)
app.get('/', verifyJWT)

app.get('/login', (req, res) => {
    res.sendFile(join(process.cwd(), "googleSignIn.html"))
})

app.listen(PORT, HOST, () => {
    console.log(`Server is running on ${HOST}:${PORT}`)
})