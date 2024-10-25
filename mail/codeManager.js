import fs from 'fs';
import crypto from 'crypto';
import { nanoid } from 'nanoid';

// Função para gerar um código aleatório seguro
export function generateSecureRandomCode() {
    return nanoid(6); // Gera um ID aleatório de 6 caracteres
}

// Função para criptografar o código
export function encrypt(text) {
    const algorithm = 'aes-256-cbc';
    const key = crypto.randomBytes(32); // Gera uma chave aleatória
    const iv = crypto.randomBytes(16); // Gera um vetor de inicialização

    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    // Retorna o código criptografado junto com a chave e o vetor de inicialização
    return {
        iv: iv.toString('hex'),
        key: key.toString('hex'),
        encryptedData: encrypted
    };
}

// Função para armazenar no arquivo JSON
export function storeCodeAndSendEmail(transporter, to, subject, text) {
    const code = generateSecureRandomCode(); // Gera o código aleatório
    const encryptedCode = encrypt(code); // Criptografa o código

    // Lê o arquivo JSON existente ou cria um novo
    let data = {};
    if (fs.existsSync('codes.json')) {
        const fileData = fs.readFileSync('codes.json');
        data = JSON.parse(fileData);
    }

    // Adiciona o código criptografado ao JSON
    data[code] = encryptedCode;

    // Salva os dados no arquivo JSON
    fs.writeFileSync('codes.json', JSON.stringify(data, null, 2));

    // Envia o código por e-mail
    const emailText = text.replace('{token}', code);
    
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: to,
        subject: subject,
        html: emailText,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Erro ao enviar e-mail:', error);
        } else {
            console.log('E-mail enviado:', info.response);
        }
    });
}
