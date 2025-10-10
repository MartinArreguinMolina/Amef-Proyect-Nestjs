import { Analysis } from "src/analysis/entities/analysis.entity";
import { User } from "src/auth/entities/user.entity";
import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class OrganizationalInformation {
    @PrimaryGeneratedColumn('uuid')
    amefId: string

    @Column('int', {
        default: 1
    })
    revision: number;

    @Column('text', {
        array: true,
    })
    team: string[]

    @Column('text', {
        nullable: true
    })
    system: string;

    @Column('text', {
        nullable: true
    })
    subsystem: string;

    @Column('text', {
        nullable: true
    })
    component: string;

    @Column('text')
    proyectCode: string

    @Column('text')
    leadingDepartment: string
    
    @ManyToOne(
        ()=> User,
        (user)=> user.organizationalInformation,
    )
    preparedBy: User

    @OneToMany(
        () => Analysis,
        (analysis) => analysis.organizationalInformation,
        { cascade: true }
    )
    analysis: Analysis[];

    @Column('date')
    dateOfOrigin: string

    @Column('date')
    targetDate: string
}
