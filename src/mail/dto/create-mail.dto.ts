import { IsEmail, IsString, IsUUID } from "class-validator";

export class CreateMailDto {
    @IsString()
    @IsEmail()
    to: string;

    @IsUUID()
    amefId: string;

    @IsUUID()
    analysisId: string;

    @IsString()
    typeAmef: string;

    @IsString()
    amef: string;

    @IsString()
    action: string;

    @IsString()
    name: string

}
