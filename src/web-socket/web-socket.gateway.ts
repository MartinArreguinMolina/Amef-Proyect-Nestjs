import { WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage } from '@nestjs/websockets';
import { WebSocketService } from './web-socket.service';
import { Server , Socket} from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from 'src/auth/interfaces/jwt-payload-interface';
import { CreateWebSocketDto } from './dto/create-web-socket.dto';

@WebSocketGateway({ cors: true })
export class MessagesWsGateway implements OnGatewayConnection, OnGatewayDisconnect {

  // Sabe todo sobre los clientes o los usuarios
  @WebSocketServer() wss: Server;

  constructor(
    private readonly messagesWsService: WebSocketService,

    private readonly jwtService: JwtService
  ) { }
  
  async handleConnection(client: Socket) {
    const token = client.handshake.headers.authentication as string;
    console.log(token)

    let payload : JwtPayload

    try{
      payload = this.jwtService.verify(token)
      await this.messagesWsService.registerClient(client, payload.id);
    }catch(error){
      client.disconnect()
      return;
    }

    this.wss.emit('clients-updated', this.messagesWsService.getConnectedClients())
  }

  handleDisconnect(client: Socket) {
    this.messagesWsService.removeClient(client.id);


    this.wss.emit('clients-updated', this.messagesWsService.getConnectedClients())
  }


  // Escuchar al cliente
  @SubscribeMessage('message-from-client')
  onMessageFromClient(client: Socket, payload: CreateWebSocketDto){
    console.log(payload)

    this.wss.emit('message-from-server', {
      fullName: this.messagesWsService.getUserFullName(client.id),
      message: payload.message || 'no-message!!'
    })
  }

}
