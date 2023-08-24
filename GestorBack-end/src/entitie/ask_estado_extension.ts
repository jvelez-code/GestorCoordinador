import {
    Entity, 
    Column,
    PrimaryGeneratedColumn, 
    CreateDateColumn, 
    UpdateDateColumn,
    PrimaryColumn,
    BaseEntity
} from "typeorm"


@Entity('ask_estado_extension')
export class askEstadoExtension extends BaseEntity {


    @PrimaryColumn()
    id_extension!: number

    @Column({ nullable: true })
    login_agente!: string

    @Column()
    estado!: number

    @Column({ nullable: true })
    numero_origen!: string

    @Column({ nullable: false })
    fechahora_ultima_llamada!: Date

    @Column({ nullable: false})
    fechahora_inicio_estado!: Date

    @Column()
    nro_documento!: string

    @Column()
    empresa!: string

    @Column({ default: true })
    active!: boolean

   


  


}