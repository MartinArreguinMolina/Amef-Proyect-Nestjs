import {  Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Socket } from 'socket.io';
import { User } from 'src/auth/entities/user.entity';
import { Repository } from 'typeorm';

interface ConnectedClients {
    [id: string] : {
        socket: Socket,
        user: User
    }
}

@Injectable()
export class MessagesService {

    // private connectedClients: ConnectedClients = {};

    // constructor(
    //     @InjectRepository(User)
    //     private readonly userRepository: Repository<User>
    // ){
    // }


    // async registerClient(client: Socket, userId: string) {
    //     const user = await this.userRepository.findOneBy({id: userId})

    //     if(!user){
    //         throw new NotFoundException(`No se pudo encontrar el usuario con el id ${userId}`)
    //     }

    //     this.checkUserConnection(user)

    //     this.connectedClients[client.id] = { socket: client, user}
    // }


    // removeClient(id: string){
    //     delete this.connectedClients[id]
    // }

    // getConnectedClients(){
    //     return Object.keys(this.connectedClients).length;
    // }

    // private checkUserConnection(user: User){
    //     for(const clientId of Object.keys(this.connectedClients)){
    //         const connectedClient = this.connectedClients[clientId]

    //         if(user.id === connectedClient.user.id){
    //             connectedClient.socket.disconnect()
    //             break;
    //         }
    //     }
    // }
}
