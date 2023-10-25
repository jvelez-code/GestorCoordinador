import {
    Entity, 
    Column,
    PrimaryGeneratedColumn, 
    CreateDateColumn, 
    UpdateDateColumn,
    BaseEntity,
    JoinColumn,
    OneToOne,
    ManyToOne
} from "typeorm"
import { Usuarios } from "./usuariosMigra";


@Entity('usuario_rol')
export class UsuariosRol extends BaseEntity {

    @PrimaryGeneratedColumn()
    id_usuario!: number

    @Column()
    id_rol!: string

    @ManyToOne(() => Usuarios, usuario => usuario.idusuario) // Indica que es una relación ManyToOne con la entidad Usuario
    @JoinColumn({ name: 'id_usuario' }) // Especifica el nombre de la columna de llave foránea
    usuario!: Usuarios;

}