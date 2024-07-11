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
    
    port: 5432,
    password: "pgsql",
    username: "postgres", 
    // host: "10.1.1.7", 
    // database: "gestorclientes",
    host: "10.1.1.25",
    database: "gestorclientes_200524",
    synchronize: false,
    logging: true,
    entities: [ Usuario, AuthUsuario, Empresa, Usuarios, UsuariosRol, UsuariosGestor ],
    subscribers: [],
    migrations: []
})


export const DataSourceContact = new DataSource({

    type: "postgres",
    
    host: "10.1.1.25",
    database: "contact_center",
    // host: "10.1.1.7",
    // database: "contact_center",
    port: 5432,
    username: "postgres",
    password: "pgsql",
    
    synchronize: false,
    logging: true,
    entities: [ askEstadoExtension ],
    subscribers: [],
    migrations: []
})