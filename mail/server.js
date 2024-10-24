import { authMail } from "./mail.js";
import { sendMail } from "./sendMail.js";

// let html =
// `
// <p>Saudação, ${usuario}!</p>
// <p>Falta pouco para poder recuperar a senha, volte na nossa página e digite o token abaixo:</p>
// <p style="padding: 12px; border-left: 4px solid #d0d0d0; font-style: italic;">
//     <span style="font-size: 18pt;"><strong>${token}</strong></span>
// </p>
// <p><span style="font-size: 10pt;">Duração de 10 minutos.</span></p>
// `

authMail("Gmail", "trabalhosistemasdistribuidos5@gmail.com", "sistemasdistribuidos123");

sendMail("zjp500@gmail.com", "Teste de Assunto", "Corpo do e-mail");