import { storeCodeAndSendEmail } from "./codeManager.js";
import { validateCode } from "./verifyCode.js";
import express from "express";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

const app = express();

const PORT = process.env.PORT;
const service = process.env.EMAIL_SERVICE;
const userEmail = process.env.EMAIL_USER;
const password = process.env.EMAIL_PASSWORD;

const subject = "Email de validação para renovar senha"

const text = `
<p>Saudação</p>
<p>Falta pouco para poder recuperar a senha, volte na nossa página e digite o token abaixo:</p>
<p style="padding: 12px; border-left: 4px solid #d0d0d0; font-style: italic;">
    <span style="font-size: 18pt;"><strong>{token}</strong></span>
</p>
<p><span style="font-size: 10pt;">Duração de 10 minutos.</span></p>
`

app.use(express.json());

const transporter = nodemailer.createTransport({
    service: service,
    auth: {
        user: userEmail,
        pass: password,
    }
});

app.post("/send-mail", (req, res) => {
    const { to } = req.body;

    if (!to) {
        return res.status(400).json({ error: "Por favor, forneça um email para o envio do token"})
    }

    try {
        storeCodeAndSendEmail(transporter, to, subject, text);
        res.status(200).json({ message: "Email enviado com sucesso!" });
    } catch (error) {
        console.error("Erro ao configurar o email:", error);
        res.status(500).json({ error: "Erro ao enviar o email." });
    }
});

app.post("/validate-code", (req, res) => {
    const { code } = req.body;

    if (!code) {
        return res.status(400).json({ message: "Código não fornecido." });
    }

    const isValid = validateCode(code);

    if (isValid) {
        res.json({ message: "Código validado com sucesso!" });
    } else {
        res.status(401).json({ message: "Código inválido." });
    }
});

app.use(express.static(join(__dirname, "..", "views")));

app.get("/", (req, res) => {
    res.sendFile(join(__dirname, "views", "index.html"));
});

app.get("/newPassword", (req, res) => {
    res.sendFile(join(__dirname, "views", "newPassword.html"));
});

app.get("/verifyToken", (req, res) => {
    res.sendFile(join(__dirname, "views", "verifyToken.html"));
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});