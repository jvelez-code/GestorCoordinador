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


@Entity('usuarios')
export class Usuarios extends BaseEntity {

    @PrimaryGeneratedColumn()
    idusuario!: number

    @Column()
    correo!: string

    @Column()
    estado!: string

    @Column()
    fecha_cambio!: Date

    @Column()
    @MinLength(3)
    clave!: string

    @Column()
    nombre!: string

    @Column()
    intentos!: string

    @UpdateDateColumn()
    fechaactualizacion!: Date

    @CreateDateColumn()
    fechacreacion!: Date
    
    hashPassword(): void{
        const salt = bcrypt.genSaltSync(10);
        this.clave = bcrypt.hashSync(this.clave, salt);
    }

    checkPassword(clave: string): boolean{
        return bcrypt.compareSync(clave, this.clave);

    }

}