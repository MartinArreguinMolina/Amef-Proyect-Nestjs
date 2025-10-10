import { IsDateString, IsInt, IsNotEmpty, IsOptional, IsString, Max, Min } from "class-validator";

export class CreateActionDto {
  @IsString()
  @IsNotEmpty()
  recommendedAction: string;

  @IsString()
  @IsNotEmpty()
  responsible: string;

  @IsDateString()
  @IsNotEmpty()
  targetDate: string;

  @IsString()
  @IsOptional()
  implementedAction?: string;

  @IsDateString()
  @IsOptional()
  completionDate?: string;

  @IsInt()
  @Min(1)
  @Max(10)
  @IsOptional()
  newSeverity?: number;

  @IsInt()
  @Min(1)
  @Max(10)
  @IsOptional()
  newOccurrence?: number;

  @IsInt()
  @Min(1)
  @Max(10)
  @IsOptional()
  newDetection?: number;
}
