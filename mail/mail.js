require ('dotenv').config();
const nodemailer = require('nodemailer');

// Configuração do transportador (neste exemplo, usando o Gmail)
const transporter = nodemailer.createTransport({
  service: 'gmail', // Você pode usar outros serviços como 'hotmail', 'yahoo', etc.
  auth: {
    user: process.env.EMAIL_USER, // Seu e-mail
    pass: process.env.EMAIL_PASS // Senha do seu e-mail ou app password para maior segurança
  }
});

// Opções do e-mail
const mailOptions = {
  from: process.env.EMAIL_USER, // Endereço de e-mail do remetente
  to: 'lucascarvalhosantiago257@gmail.com', // Endereço de e-mail do destinatário
  subject: 'Assunto do e-mail',
  text: 'Conteúdo do e-mail em texto',
  html: '<h1>Conteúdo do e-mail em HTML</h1><p>Olá, esse é um e-mail de teste!</p>'
};

// Enviar o e-mail
transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    return console.log('Erro ao enviar o e-mail:', error);
  }
  console.log('E-mail enviado:', info.response);
});
