import {
    Entity, 
    Column,
    PrimaryGeneratedColumn, 
    CreateDateColumn, 
    UpdateDateColumn,
    BaseEntity,
    JoinColumn,
    OneToOne
} from "typeorm"
import { Empresa } from "./empresa";

import {MinLength, IsNotEmpty} from 'class-validator';
import * as bcrypt from 'bcryptjs';


@Entity('auth_usuario')
export class AuthUsuario extends BaseEntity {

    @PrimaryGeneratedColumn()
    id_usuario!: number

    @Column()
    @MinLength(6)
    usuario!: string

    @Column()
    @MinLength(3)
    clave!: string

    @Column()
    nombre!: string

    @Column()
    apellido!: string

    @Column()
    documento!: string

    @Column()
    estado!: string

    @Column()
    correo!: string
    
    //@OneToOne(() => Empresa)
    //@JoinColumn()
    //Empresa: any;
    
    @Column()
    id_empresa!: number

    @Column()
    id_rol!: number

    @CreateDateColumn()
    creado_usuario!: Date

    @UpdateDateColumn()
    actualiza_usuario!: Date
    
    hashPassword(): void{
        const salt = bcrypt.genSaltSync(10);
        this.clave = bcrypt.hashSync(this.clave, salt);
    }

    checkPassword(clave: string): boolean{
        return bcrypt.compareSync(clave, this.clave);

    }

}