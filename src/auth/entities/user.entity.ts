import { BeforeInsert, Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, Or, PrimaryGeneratedColumn } from "typeorm";
import { Rol } from "./rol.entity";
import { ApiProperty } from "@nestjs/swagger";
import { OrganizationalInformation } from "src/organizational-information/entities/organizational-information.entity";
import { Exclude } from "class-transformer";
import { Department } from "src/departments/entities/department.entity";
import { CommentAnalysis } from "src/comments/entities/comment.entity";

@Entity()
export class User {
    @ApiProperty({
        example: '0bf71a00-b5ad-4e32-b831-2ed2afa140e6',
        description: 'User ID',
        uniqueItems: true
    })
    @PrimaryGeneratedColumn('uuid')
    id: string

    @ApiProperty({
        example: 'Martin Arreguin Molina',
        description: 'Full Name',
        uniqueItems: true
    })
    @Column('text')
    fullName: string;

    @ApiProperty({
        example: 'example@gmail.com',
        description: 'Email',
        uniqueItems: true
    })
    @Column('text', {
        unique: true
    })
    email: string;


    @ApiProperty({
        example: 'Abc123',
        description: 'Password',
    })
    @Exclude()
    @Column('text')
    password: string;


    @ApiProperty({
        example: 'True or False',
        description: 'Is Active',
    })
    @Column('boolean', {
        default: true
    })
    isActive: boolean;

    @ApiProperty({
        example: '[0bf71a00-b5ad-4e32-b831-2ed2afa140e6,0bf71a00-b5ad-4e32-b831-2ed2afa140e6]',
        description: 'Uuid Roles',
        uniqueItems: true
    })
    @ManyToMany(
        () => Rol,
        { cascade: true, eager: true }
    )
    @JoinTable({
        name: 'users_roles'
    })
    roles: Rol[];


    @OneToMany(
        () => OrganizationalInformation,
        (organizationalInformation) => organizationalInformation.preparedBy
    )
    organizationalInformation: OrganizationalInformation[]

    @ManyToMany(
        () => Department,
        { cascade: true, eager: true }
    )
    @JoinTable({
        name: "users_departament"
    })
    departaments: Department[]

    @ManyToMany(
        () => OrganizationalInformation,
        (organizationalInformation) => organizationalInformation.team,
    )
    OrganizationalInformation: OrganizationalInformation[]

    @OneToMany(
        () => CommentAnalysis,
        (commentAnalysis) => commentAnalysis.user
    )
    comment: CommentAnalysis[]

    @BeforeInsert()
    private beforeInsertFullName() {
        this.fullName = this.fullName.toLowerCase().trim()
    }
}