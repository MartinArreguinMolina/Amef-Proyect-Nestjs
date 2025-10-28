import { IsDateString, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateCommentDto {
    @IsString()
    comment: string;

    @IsUUID()
    @IsString()
    userUuid: string

    @IsUUID()
    @IsString()
    analysisUuid: string

    @IsDateString()
    date: string

    @IsOptional()
    @IsDateString()
    modificationDate: string
}
