/*
    Arreguin Molina Martin
    24/09/2025
*/

import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";
import { ApiProperty } from "@nestjs/swagger";


@Entity()
export class Rol {

    @ApiProperty({
        example: '0bf71a00-b5ad-4e32-b831-2ed2afa140e6',
        description: 'Rol ID',
        uniqueItems: true
    })
    @PrimaryGeneratedColumn('uuid')
    id: string;


    @ApiProperty({
        example: 'Admin',
        description: 'Rol',
        uniqueItems: true
    })
    @Column('text', {
        unique: true
    })
    rol: string;


    // TODO: MUCHOS ROLES PUEDEN PERTENECER A UN SOLO USUARIO
    /*
    Relacion ManyToOne()
    */

    @ApiProperty({
        example: User,
        description: 'User',
    })
    @ManyToOne(
        () => User,
        (user) => user.roles,
    )
    user: User;
}