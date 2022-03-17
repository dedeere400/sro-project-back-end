import crypto from 'crypto';


// creamos una clave para la codificación
const salt= 'demo_secret_bootcamp';

/**
 * Esta función codifica la password que recibe como parámetro y la devuelve
 */
export const encodePassword = (pass) => {
    // utilizamos la librería crypto para codificarla haciendo uso de 1000 iteraciiones
    return crypto.pbkdf2Sync(pass, salt,1000, 64, `sha512`).toString(`hex`);
}

/**
 * Generamos un token aleatorio de 128 bytes en hexadecimal
 */
export const generateValidationToken = () => {
    return crypto.randomBytes(128).toString('hex');
}