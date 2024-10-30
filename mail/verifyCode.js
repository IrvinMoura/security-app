import fs from "fs";
import crypto from "crypto";

export function decrypt(encryptedData, key, iv) {
    const algorithm = "aes-256-cbc";
    const decipher = crypto.createDecipheriv(algorithm, Buffer.from(key, "hex"), Buffer.from(iv, "hex"));
    
    let decrypted = decipher.update(encryptedData, "hex", "utf8");
    decrypted += decipher.final("utf8");
    
    return decrypted;
}

export function validateCode(userInput) {
    if (!fs.existsSync("codes.json")) {
        console.error("Arquivo codes.json não encontrado!");
        return false;
    }

    const fileData = fs.readFileSync("codes.json");
    const data = JSON.parse(fileData);

    const encryptedInfo = data[userInput];
    if (!encryptedInfo) {
        console.log("Código não encontrado!");
        return false;
    }

    const { encryptedData, key, iv, timestamp, validityDuration} = encryptedInfo;
    
    const currentTime = Date.now();
    if (currentTime > timestamp + validityDuration) {
        alert("Código expirado, lembre-se que eles tem validade de apenas 10 minutos")
        console.log("Código expirado.");
        return false;
    }

    const decryptedCode = decrypt(encryptedData, key, iv);
    if (decryptedCode === userInput) {
        console.log("Código validado com sucesso!");
        return true;
    } else {
        console.log("Código inválido.");
        return false;
    }
}
