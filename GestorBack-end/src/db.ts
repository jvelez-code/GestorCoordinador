import { DataSource } from "typeorm"; 
import { Usuario } from "./entitie/usuario";
import { askEstadoExtension } from "./entitie/ask_estado_extension";
import { AuthUsuario } from "./entitie/auth_usuario"
import { Empresa } from "./entitie/empresa";
import { Usuarios } from "./entitie/usuariosMigra";
import { UsuariosRol } from "./entitie/usuario_rolMigra";
import { UsuariosGestor } from "./entitie/usuariosGestor";

export const DataSourceGestor = new DataSource({

    type: "postgres",
    host: "10.1.1.25",
    port: 5432,
    username: "postgres",
    password: "",
    database: "gestorclientes090323_25",
    synchronize: false,
    logging: true,
    entities: [ Usuario, AuthUsuario, Empresa, Usuarios, UsuariosRol, UsuariosGestor ],
    subscribers: [],
    migrations: []
    // type: "postgres",
    // host: "localhost",
    // port: 5432,
    // username: "postgres",
    // password: "",
    // database: "desarrolloPrueba",
    // synchronize: true,
    // logging: true,
    // entities: [Usuario ],
    // subscribers: [],
    // migrations: [],
})


export const DataSourceContact = new DataSource({

    type: "postgres",
    host: "10.1.1.25",
    port: 5432,
    username: "postgres",
    password: "",
    database: "contact_center030523_no_la_danen25",
    synchronize: false,
    logging: true,
    entities: [ askEstadoExtension ],
    subscribers: [],
    migrations: []
})