import { Module } from '@nestjs/common';
import { RoomMembersService } from './room-members.service';
import { RoomMembersController } from './room-members.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomMember } from './entities/room-member.entity';

@Module({
  controllers: [RoomMembersController],
  providers: [RoomMembersService],
  imports: [
    TypeOrmModule.forFeature([RoomMember])
  ],
  exports: [RoomMembersService]
})
export class RoomMembersModule {}
