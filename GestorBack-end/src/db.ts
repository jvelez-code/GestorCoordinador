import { DataSource } from "typeorm"; 
import { Usuario } from "./entitie/usuario";
import { askEstadoExtension } from "./entitie/ask_estado_extension";
import { AuthUsuario } from "./entitie/auth_usuario"
import { Empresa } from "./entitie/empresa";
import { Usuarios } from "./entitie/usuariosMigra";
import { UsuariosRol } from "./entitie/usuario_rolMigra";
import { UsuariosGestor } from "./entitie/usuariosGestor";

import { encrypt, decrypt } from './config/aes';

//const decrypted = 'Velez2024*';
//const decrypted = decrypt('ySLP8tyF/6PElLqgY0OapYzgmbPmk1CEaRwdlRng7PU=');
const decrypted = 'Velez2024*';
console.log('Texto descifrado DB:', decrypted);

export const DataSourceGestor = new DataSource({

    

    type: "postgres",    
    port: 5432,
    password: decrypted,
    username: "jaime.velez",
    host: "10.1.1.25",
    database: "gestorclientes_apz12092024",
    synchronize: false,
    logging: true,
    entities: [ Usuario, AuthUsuario, Empresa, Usuarios, UsuariosRol, UsuariosGestor ],
    subscribers: [],
    migrations: []
})


export const DataSourceContact = new DataSource({

    type: "postgres",    
    host: "10.1.1.25",
    database: "contact_center_apz12092024",
    port: 5432,
    username: "jaime.velez",
    password: decrypted,    
    synchronize: false,
    logging: true,
    entities: [ askEstadoExtension ],
    subscribers: [],
    migrations: []
})