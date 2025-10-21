import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
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
}