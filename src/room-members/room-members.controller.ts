import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe } from '@nestjs/common';
import { RoomMembersService } from './room-members.service';
import { CreateRoomMemberDto } from './dto/create-room-member.dto';
import { UpdateRoomMemberDto } from './dto/update-room-member.dto';

@Controller('room-members')
export class RoomMembersController {
  constructor(private readonly roomMembersService: RoomMembersService) {}

  @Post()
  async create(@Body() createRoomMemberDto: CreateRoomMemberDto) {
    return await this.roomMembersService.create(createRoomMemberDto);
  }

  @Get()
  findAll() {
    return this.roomMembersService.findAll();
  }

  @Get(':userId/amef/:amefId')
  findOne(@Param('userId', ParseUUIDPipe) userId: string, @Param('amefId', ParseUUIDPipe) amefId: string) {
    return this.roomMembersService.findOne(userId, amefId);
  }

  @Get(':userId/amef/:amefId/analysis/:analysisId')
  findRoomMembers(@Param('userId', ParseUUIDPipe) userId: string, @Param('amefId', ParseUUIDPipe) amefId: string, @Param('analysisId', ParseUUIDPipe) analysisid: string) {
    return this.roomMembersService.findRoomMembersByAnalysisId(userId, amefId, analysisid);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRoomMemberDto: UpdateRoomMemberDto) {
    return this.roomMembersService.update(id, updateRoomMemberDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.roomMembersService.remove(+id);
  }
}
