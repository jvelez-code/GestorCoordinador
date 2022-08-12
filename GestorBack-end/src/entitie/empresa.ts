import {
    Entity, 
    Column,
    PrimaryGeneratedColumn, 
    CreateDateColumn, 
    UpdateDateColumn,
    BaseEntity
} from "typeorm"
import {MinLength, IsNotEmpty, MaxLength} from 'class-validator';

@Entity('empresa')
export class Empresa extends BaseEntity {

    @PrimaryGeneratedColumn()
    id_empresa!: number

    @Column()
    @MinLength(3)
    @MaxLength(500)
    descripcion!: string

    @Column()
    @MinLength(3)
    @MaxLength(100)
    pseudonimo!: string
}