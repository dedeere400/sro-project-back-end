import { retrieveUserInfoByEmail, updateUser, deleteUser } from './users.model.js';

export const getUserInfo = async (req, res) => {
    // llamo al usuario
    try {
        const user = await retrieveUserInfoByEmail(req.email);
        res.json(user); // devuelvo la info del usuario
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
}

export const updateUserInfo = async (req, res) => {
    // llamo al usuario
    try {
        const user = await updateUser(req.body);
        res.json(user); // devuelvo la info del usuario
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
};

export const deleteUserInfo = async (req, res) => {
    try {
        const user = await deleteUser(req.email);
        res.json(user);
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
};