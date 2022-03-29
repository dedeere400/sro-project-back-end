import { MongoClient } from 'mongodb';
// import MongoDB from "mongodb";



const URI = 'mongodb+srv://ddr400:ddr400@cluster0.gu7j0.mongodb.net/shield-project?retryWrites=true&w=majority';
const client = new MongoClient(URI);
const DATABASE_NAME = 'shield-project';
const COLLECTION_NAME = 'users';


export const createUser = async (user) => {
    try {
        await client.connect();
        const db = client.db(DATABASE_NAME);
        const users = db.collection(COLLECTION_NAME);
        return await users.insertOne(user);
    } catch (err) {
        console.error(err);
    } finally {
        client.close();
    }
}

// devuelve el usuario sin tener en cuenta el status o null si no existe
export const getUserByEmailNoStatus = async (email) => {
    try {
        await client.connect();
        const db = client.db(DATABASE_NAME);
        const users = db.collection(COLLECTION_NAME);
        return await users.findOne({ email });
    } catch (err) {
        console.error(err);
    } finally {
        client.close();
    }
}

// actualiza el usuario cambiando su estaso a success
export const validateUser = async (email) => {
    try {
        await client.connect();
        const db = client.db(DATABASE_NAME);
        const users = db.collection(COLLECTION_NAME);
        // create a document that sets the plot of the movie
        const updateDoc = {
            $set: {
                status: 'SUCCESS'
            },
        };
        return await users.updateOne({ email }, updateDoc);
    } catch (err) {
        console.error(err);
    } finally {
        client.close();
    }
}

// actualiza los datos del usuario
export const updateUser = async (payload) => {
    try {
        await client.connect();
        const db = client.db(DATABASE_NAME);
        const users = db.collection(COLLECTION_NAME);
        // create a document that sets the plot of the movie
        const updateDoc = {
            $set: payload,
        };
        return await users.updateOne({ email: payload.email }, updateDoc);
    } catch (err) {
        console.error(err);
    } finally {
        client.close();
    }
};

// elimina al usuario
export const deleteUser = async (email) => {
    try {
        await client.connect();
        const db = client.db(DATABASE_NAME);
        const users = db.collection(COLLECTION_NAME);

        return await users.deleteOne({ email });
    } catch (err) {
        console.error(err);
    } finally {
        client.close();
    }
};
//-----------------------------------------------------------------

// export const patchUserEmail = async (id, email) => {
//     try {
//         await client.connect();
//         const db = client.db(DATABASE_NAME);
//         const userCol = db.collection(COLLECTION_NAME);

//         const userEmail = await userCol.updateOne({ "_id": ObjectId(id) }, { $set: email });
//         return userEmail ?? undefined;
//     } catch (err) {
//         console.error('Retrieve users error: ', err);
//     } finally {
//         client.close();
//     }
// };
// export const updateEmailCtrl = async (req, res) => {
//     const { id } = req.params
//     const userNew = {
//         email: req.body.email,
//     }
//     const updatedEmail = await patchUserEmail(id, userNew)
//     res.json(updatedEmail)
// }



// devuelve el usuario de BBDDD que esté en estado succes y además coincida
// con el email y con password que me mandan. 
export const retrieveSuccessUserByEmailAndPassword = async (email, password) => {
    try {
        await client.connect();
        const db = client.db(DATABASE_NAME);
        const users = db.collection(COLLECTION_NAME);
        const query = {
            email,
            password
            // status: 'SUCCESS'
        }

        return await users.findOne(query);
    } catch (err) {
        console.error(err);
    } finally {
        client.close();
    }
}


export const retrieveUserInfoByEmail = async (email) => {
    try {
        await client.connect();
        const db = client.db(DATABASE_NAME);
        const users = db.collection(COLLECTION_NAME);
        const query = { email };
        const options = { projection: { _id: 0, password: 0, status: 0 } }
        return await users.findOne(query, options);
    } catch (err) {
        console.error(err);
    } finally {
        client.close();
    }
}



