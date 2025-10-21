import { ArrayMinSize, ArrayUnique, IS_UUID, IsArray, IsDateString, IsInt, IsNotEmpty, IsOptional, IsPositive, IsString, IsUUID, MinLength } from "class-validator";

export class CreateOrganizationalInformationDto {
    @IsArray()
    @IsUUID('all', {each: true})
    @ArrayUnique()
    @IsNotEmpty({each: true})
    @ArrayMinSize(1)
    team: string[]

    @IsInt()
    @IsOptional()
    @IsPositive()
    revision?: number;

    @IsString()
    @IsOptional()
    @MinLength(1)
    system?: string;

    @IsString()
    @IsOptional()
    @MinLength(1)
    subsystem?: string;

    @IsString()
    @IsOptional()
    @MinLength(1)
    component?: string;

    @IsString()
    @IsNotEmpty()
    proyectCode: string

    @IsString()
    @IsNotEmpty()
    leadingDepartment: string;


    @IsDateString()
    @IsNotEmpty()
    dateOfOrigin: string

    @IsDateString()
    @IsNotEmpty()
    targetDate: string

    @IsUUID()
    @IsNotEmpty()
    @IsString()
    preparedById: string

}
