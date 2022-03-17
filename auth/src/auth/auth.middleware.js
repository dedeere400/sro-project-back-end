import * as EmailValidator from 'email-validator';
import jwt from 'jsonwebtoken';
import { jwt_secret } from './auth.secrets.js';


/**
 * Validar que el email es correcto
 * ....
 * Si no es correcto, devolvemos un 400 (Bad Request)
 */
export const validateUser = (req, res, next) => {
    if (EmailValidator.validate(req.body.email) && req.body.age >= 18) {
        next();
    } else {
        res.status(400).json({ error: 'algun campo no es válido' });
    }
}

/**
 * Valida el token y si es valido añade a la request el email
 */
export const validateAuth = (req, res, next) => {
    try {
        // obtener el email --> lo tengo que obtener del token
        const auth = req.header('Authorization'); // me devuelve el valor de la header
        // ¿Que estructura tiene la header? --> Bearer _token_jwt_
        const token = auth.split(' ')[1]; // obtenemos el token
        const payload = jwt.verify(token, jwt_secret);
        // añadir a la request un atributo
        req.email = payload.email;
        next();
    } catch (err) {
        // el token NO es válido o no hay token
        console.error(err);
        res.sendStatus(401);
    }
}