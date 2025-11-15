import { PartialType } from '@nestjs/swagger';
import { CreateRoomMemberDto } from './create-room-member.dto';

export class UpdateRoomMemberDto extends PartialType(CreateRoomMemberDto) {}
