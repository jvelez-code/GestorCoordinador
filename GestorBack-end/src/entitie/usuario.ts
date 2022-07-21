import {
    Entity, 
    Column,
    PrimaryGeneratedColumn, 
    CreateDateColumn, 
    UpdateDateColumn,
    BaseEntity
} from "typeorm"


@Entity('auth_usuarioPrueba')
export class Usuario extends BaseEntity {

    @PrimaryGeneratedColumn()
    id!: number

    @Column()
    firsname!: string

    @Column()
    lastname!: string

    @Column({
        default: true
    })
    active!: boolean

    @CreateDateColumn()
    creaada!: Date

    @UpdateDateColumn()
    Actualizada!: Date


}