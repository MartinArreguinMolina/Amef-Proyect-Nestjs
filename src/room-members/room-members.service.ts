import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRoomMemberDto } from './dto/create-room-member.dto';
import { UpdateRoomMemberDto } from './dto/update-room-member.dto';
import { HandleErrors } from 'src/common/handleErros';
import { InjectRepository } from '@nestjs/typeorm';
import { RoomMember } from './entities/room-member.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RoomMembersService {

  constructor(
    @InjectRepository(RoomMember)
    private readonly roomMembersRepository: Repository<RoomMember>
  ) { }

  async create(createRoomMemberDto: CreateRoomMemberDto) {
    try {
      const roomMember = this.roomMembersRepository.create(createRoomMemberDto);
      return await this.roomMembersRepository.save(roomMember)
    } catch (error) {
      HandleErrors.handleDBErrors(error)
    }
  }

  findAll() {
    return `This action returns all roomMembers`;
  }

  async findOne(userId: string, amefId: string) {

    const roomMembers = await this.roomMembersRepository.find({
      where: {
        userId,
        amefId
      }
    })

    if (roomMembers.length === 0 || !roomMembers) throw new NotFoundException(`Los mensajes vistos a las salas no existen`)

    return roomMembers;
  }

  async findRoomMembersByAnalysisId(userId: string, amefId: string, analysisId: string) {

    const roomMembers = await this.roomMembersRepository.findOne({
      where: {
        userId,
        amefId,
        analysisId
      }
    })

    if (!roomMembers) throw new NotFoundException(`El mensaje vistos a las sala no existen`)

    return roomMembers;
  }

  async update(id: string, updateRoomMemberDto: UpdateRoomMemberDto) {
    const roomMember = await this.roomMembersRepository.preload({
      id,
      ...updateRoomMemberDto
    })

    if (!roomMember) throw new NotFoundException(`El roomMember con el id ${id} no fue encontrado`)

    try {
      return await this.roomMembersRepository.save(roomMember)
    } catch (error) {
      HandleErrors.handleDBErrors(error)
    }
  }

  remove(id: number) {
    return `This action removes a #${id} roomMember`;
  }
}
