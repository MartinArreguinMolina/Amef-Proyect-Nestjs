/*
    Arreguin Molina Martin
    24/09/2025
*/

import { BeforeInsert, Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Rol } from "./rol.entity";
import { ApiProperty } from "@nestjs/swagger";

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
    @Column('text', {
        unique: true
    })
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


    // TODO: UN USUARIO PUEDE TENER MUCHOS ROLES 
    /*
    Relacion OneToMany()
    */

    @ApiProperty({
        example: '[0bf71a00-b5ad-4e32-b831-2ed2afa140e6,0bf71a00-b5ad-4e32-b831-2ed2afa140e6]',
        description: 'Uuid Roles',
        uniqueItems: true
    })
    @ManyToMany(
        () => Rol,
        (rol) => rol.user,
        {cascade: true, eager: true}
    )
    @JoinTable({
        name: 'users_roles'
    })
    roles: Rol[];

    @BeforeInsert()
    private beforeInsertFullName(){
        this.fullName = this.fullName.toLowerCase().trim()
    }
}