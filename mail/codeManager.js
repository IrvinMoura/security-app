import fs from "fs";
import crypto from "crypto";
import { randomBytes } from "crypto";

export function generateSecureRandomCode() {
    const buffer = randomBytes(6);
    return buffer.toString("base64").replace(/[^a-zA-Z0-9]/g, "").slice(0, 6)
}

export function encrypt(text) {
    const algorithm = "aes-256-cbc";
    const key = crypto.randomBytes(32);
    const iv = crypto.randomBytes(16);

    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(text, "utf8", "hex");
    encrypted += cipher.final("hex");

    return {
        iv: iv.toString("hex"),
        key: key.toString("hex"),
        encryptedData: encrypted
    };
}

export function storeCodeAndSendEmail(transporter, to, subject, text) {
    const code = generateSecureRandomCode();
    const encryptedCode = encrypt(code);

    const timestamp = Date.now();
    const validityDuration = 10 * 60 * 1000; // 10 minutos em milissegundos

    let data = {};
    if (fs.existsSync("codes.json")) {
        const fileData = fs.readFileSync("codes.json");
        data = JSON.parse(fileData);
    }

    data[code] = {
        ...encryptedCode,
        timestamp,
        validityDuration
    }

    fs.writeFileSync("codes.json", JSON.stringify(data, null, 2));

    const emailText = text.replace("{token}", code);
    
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: to,
        subject: subject,
        html: emailText,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error("Erro ao enviar e-mail:", error);
        } else {
            console.log("E-mail enviado:", info.response);
        }
    });
}
