import { IsDateString, IsOptional, IsUUID } from "class-validator";

export class CreateRoomMemberDto {

    @IsUUID()
    amefId: string;

    @IsUUID()
    analysisId: string;

    @IsUUID()
    userId: string;

    @IsDateString()
    @IsOptional()
    lastConnection?: Date
}
