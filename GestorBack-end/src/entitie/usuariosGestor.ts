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


@Entity('usuario')
export class UsuariosGestor extends BaseEntity {

    @PrimaryGeneratedColumn()
    id_usuario!: number

    @Column()
    usuario!: string

    @Column()
    empresa!: number
}