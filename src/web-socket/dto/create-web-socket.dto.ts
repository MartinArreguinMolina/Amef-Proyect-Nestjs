import { IsString, MinLength } from "class-validator";

export class CreateWebSocketDto {
    @IsString()
    @MinLength(1)
    message: string
}
