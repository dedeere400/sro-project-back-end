/**
 * 1- Autenticación vs Autorización
 *  - Autenticación => Es un proceso por el cual se valida que la persona que intenta entrar en un sistema, 
 *                     es quien dice ser. Se pueden aplicar MFA (Multiples factores de autenticación).
 *                     Una contraseña segura junta Algo que sabes (password), Algo que tienes (el móvil) y 
 *                     algo que eres (huella dactilar)
 * 
 *  - Autorización => Es el proceso por el cual un sistema una vez tiene un usuaio autenticado, distingue si el usuario
 *                    puede o no acceder a la operación que intenta realizar.
 * 
 * Los códigos HTTP para gestionar la autorización y la autenticación son:
 * 
 *      - 401 (Unauthorized) --> No estás autenticado, es decir no has indicado quien eres en el sistema
 *      - 403 (Forbidden)--> Cuando tienes usuario, pero el usuario intenta hacer una operación que no se le permite
 * 
 * 
 * 2. ¿Que mecanismos tenemos en el sistema para implementar el proceso de Autenticación?
 * 
 * 
 * - Autenticación Basic: Este proceso es el más sencillo y se implementa mandando en cada petición a nuestro back 
 *                        el usuario en la URL. http://_user_:_pass_@domain:port/path?query
 * 
 *      ¿Que problema tiene esto? (pros&cons)
 *          * PROS
 *              - facilidad y rapidez de implementación
 * 
 *          * CONS
 * 
 *              - El usuario y la pass son visibles, es decir, cualquier ordenador de la red hasta que llegamos al servidor destino
 *                puede obtener ese user, ese pass y la URL a la que acceder
 *              - Debo guardar en el front el user y la pass. XSS
 * 
 * 
 *      Mejora ==> Puedo meter la autenticación en una cabecera que se llama `Authorization`. El valor de esta cabecera es:
 *              `Basic _user:pass_base64` --> Ejemplo para alex:123456 --> `Basic YWxleDoxMjM0NTY=`
 * 
 * - Api Key: Consiste en que el usuario puede generar un token dentro de su panel de administración y 
 *           luego un cliente usando ese token, ya es suficiente para autenticarse y autorizarse en un sistema.
 *          
 *          ¿Como se manda ese API-Key?
 *              - Query param en la URL
 *              - Header custom: EJ_ `X-API-KEY`: `valor_api_key`
 *              - Authorization header: EJ: `Authorization`: `Apikey _nuestra_api_key`
 * 
 *          ¿Que problema tiene?
 * 
 *              - Si uso query string estará en texto plano el API KEY
 *              - Si me roban el API KEY tienen mi usuario (Session hijacking)
 * 
 * - Token JWT: Consiste en la generación de un token JWT una vez que he validado que el usuario es quien dice ser
 *              (https://jwt.io/). Este proceso se hace en el Login que devuelve lo que se concoe como access_token.
 * 
 *              Una vez que el cliente (reactJS) tiene el token, todas las sucesivas llamadas al backend tendrán que incluir 
 *              este token. EL CLIENTE NO ALMACENA PASSWORDS, SOLO GUARDA EL JWT
 * 
 *      ¿Como genero/verifico tokens JWT? --> Con una librería de NodeJS (jsonwebtoken o jose)
 *      ¿Como el cliente envía el JWT al backend? 
 *          - Authorization header: EJ: `Authorization`: `Bearer _nuestro_jwt`
 * 
 *      ¿Cual sería el proceso completo de autenticación?
 *          1- El backend (nodeJS) implementa un endpoint de tipos de login. 
 *              a. Se recupera el usuario y la password del body
 *              b. Se busca en la BBDD (debemos tener una entidad de usuarios) que ese usuario existe
 *                 y además tiene la misma password que el body
 *              c. Si la password o el username no son correctos devuelvo un 400
 *              d. Si todo esta ok, ejecutaríamos los siguientes factores de autenticación (si existiesen)
 *              e. Si no hay mas factores y hemos conseguido validar al usuario
 *                  - Generamos un JWT
 *                  - Devolvemos como respuesta ese JWT y un 200
 *          2- El cliente (NodeJS) tiene un formulario de login y envía una petición POST al endpoint de `login`
 *              a. Si el endpoint devuelve un 400 (si no nos da paso) debemos mostrar al usuario el error en la página
 *                 de login
 *              b Si el proceso de autenticación es correcto, acabo recibiendo un 200 y obtengo en el body de la respuesta
 *                el access_token, que debo guardar en el session storage y redirijimos a la home privada de react.
 * 
 *          3- El backend debe crear un middleware de validación de token en sus rutas protegidas
 *              a. Obtiene el token de la cabecera de autorización de la request (req.headers.authorization.split(' '))
 *              b. Ejecutamos la función de verify de la librería de jwt con el token.
 *              c. Si la función da error, devolvemos un 401 al usuario y no vamos al controller de la ruta
 *              d. Si el token es correcto, obtenemos del payload la info del usuario
 *              e. Si el usuario NO cumple los requisitos para realizar la operación, devolvemos un 403 y no vamos al controller
 *              f. Si el usuario puede hacer la operación, nuestro middleware ejecuta el next()
 *              g. añadir el middleware a las rutas privadas
 * 
 *          4- Cuando el cliente (reactJS) quiere operar con el backend
 *              a. En el fetch añadirá la cabecera de auth `Authorization`: `Bearer access_token_value`
 *              b. Si recibimos un 401, una redirección al login
 *              c. Si recibimos un 200, hacemos lo que tengamos que hacer despues de la operacion
 *              d. Usar esto en todas las peticiones privadas del cliente al backend
 *          
 *        ¿Como me registro?
 *          1. Debemmos crear en NodeJS un enpoint para crear usuario ('/register'). POST
 *              a. Recibe la información del usuario
 *              b. Si es valida, la guarda en BBDD(collection users)
 *              c. Podemos hacer segundas validaciones
 *                  1. Cuando guardamos el usuario, le pones un estado ('PENDING_EMAIL_VALIDATION')
 *                  2. Generar un token único
 *                  3. Enviar un email al usuario con un enlace de nuestra web para la validación que 
 *                      tenga ese token
 *          2. Debemos en el cliente (ReactJS) crear una página de validación de email 
 *             (Que es a donde irá la url de validación que hemos puesto en el mail)
 *              a. Recuperar el token
 *              b. Llamar a un endpoint de validate que expone el back, pasándole el token
 * 
 *          3. Debemos crear un endpoint en NodeJS '/validate', de tipo GET
 *              a. Recuperar el token
 *              b. Validar que es correcto y a quien pertenece
 *              c. Cambiar el estado el usuario a 'SUCCESS'
 *
 *          4. El cliente tiene que crear una página de Registro con los campos necesarios para el mismo
 * 
 * 
 * 
 * - oAuth 2.0 --> Este mecanismo se utiliza cuando quiero exponer mi proceso de login y registro a otras aplicaciones
 *          
 * 
 */
import express from 'express';
import cors from 'cors';
import authRouter from './auth/auth.router.js';
import usersRouter from './users/users.router.js';
import { validateAuth } from './auth/auth.middleware.js';

const app = express();
const port = 4000;

app.use(cors());
app.use(express.json());

app.get('/ping', (_req, res) => res.send('Pong'));
app.use('/auth', authRouter); // declaramos el router de autenticación
app.use('/users', validateAuth, usersRouter);

app.listen(port, () => console.log(`Servidor levantado en el puerto ${port}`));