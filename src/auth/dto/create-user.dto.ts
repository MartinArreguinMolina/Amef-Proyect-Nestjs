/*
    Arreguin Molina Martin
    24/09/2025
*/

import { 
    IsArray, 
    IsEmail, 
    IsNotEmpty, 
    IsString, 
    Matches, 
    MaxLength, 
    MinLength 
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateUserDto {
    @ApiProperty({
        description: "Nombre completo del usuario",
        example: "Juan Pérez López",
        minLength: 1,
    })
    @IsString()
    @IsNotEmpty()
    @MinLength(1)
    fullName: string;

    @ApiProperty({
        description: "Correo electrónico único del usuario",
        example: "juan.perez@example.com",
        format: "email",
    })
    @IsEmail()
    @IsString()
    email: string;

    @ApiProperty({
        description: "Contraseña del usuario. Debe contener mayúsculas, minúsculas, un número o caracter especial.",
        example: "Passw0rd!",
        minLength: 6,
        maxLength: 50,
    })
    @IsString()
    @MinLength(6)
    @MaxLength(50)
    @Matches(
        /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: 'The password must have a Uppercase, lowercase letter and a number'
    })
    password: string;

    @ApiProperty({
        description: "Lista de roles asignados al usuario",
        example: ["ADMIN", "USER"],
        isArray: true,
        type: String,
    })
    @IsArray()
    @IsString({ each: true })
    roles: string[];


    @IsString({each: true})
    @IsArray()
    departments: string[]
}
