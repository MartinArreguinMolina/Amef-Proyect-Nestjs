import { IsNotEmpty, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateRolDto {
    @ApiProperty({
        description: "Nombre del rol dentro del sistema",
        example: "ADMIN",
    })
    @IsString()
    @IsNotEmpty()
    rol: string;
}
