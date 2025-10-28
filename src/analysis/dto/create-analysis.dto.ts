import { IsInt, IsNotEmpty, IsOptional, IsString, Min, Max } from "class-validator";

export class CreateAnalysisDto {

    @IsString()
    @IsNotEmpty()
    systemFunction: string;

    @IsString()
    @IsNotEmpty()
    failureMode: string;

    @IsString()
    @IsNotEmpty()
    failureEffects: string;

    @IsInt()
    @Min(1)
    @Max(10)
    severity: number;

    @IsString()
    @IsNotEmpty()
    failureCauses: string;

    @IsInt()
    @Min(1)
    @Max(10)
    occurrence: number;

    @IsString()
    @IsOptional()
    currentControls?: string;

    @IsInt()
    @Min(1)
    @Max(10)
    detection: number;
}
