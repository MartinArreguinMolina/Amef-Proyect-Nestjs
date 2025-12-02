import { WebSocketGateway, WebSocketServer, SubscribeMessage, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessagesService } from './messages.service';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from 'src/auth/interfaces/jwt-payload-interface';

@WebSocketGateway({
  namespace: '/ws-comments',
  cors: { origin: ['http://localhost:4200'], methods: ['GET', 'POST'] },
})
export class MessagesGateway implements OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer() wss: Server;

  constructor(
    private readonly jwtService: JwtService,
  ) { }


  async handleConnection(client: Socket) {
    const token = client.handshake.auth?.token as string;
    const analysisId = client.handshake.auth?.analysisId as string;

    if (!token || !analysisId) {
      client.disconnect()
      return;
    }

    let payload: JwtPayload

    try {
      payload = this.jwtService.verify(token);
    } catch (error) {
      client.disconnect()
      return;
    }

    client.join(analysisId);

    await this.emitClientsUpdate(analysisId)
  }

  async handleDisconnect(client: Socket) {
    const analysisId = client.handshake.auth?.analysisId as string;
    if (!analysisId) return;

    await this.emitClientsUpdate(analysisId)
  }

  private async emitClientsUpdate(analysisId: string) {
    const socketsInRoom = await this.wss.in(analysisId).allSockets();
    const clientsInRoom = socketsInRoom.size;

    this.wss.to(analysisId).emit('clients:update', clientsInRoom);
  }

  @SubscribeMessage('joinRoom')
  async handleJoinRoom(client: Socket, analysisId: string) {
    client.join(analysisId);
    await this.emitClientsUpdate(analysisId)
  }

  public emitCommentNew(analysisId: string, payload: {}) {
    this.wss.to(analysisId).emit('comment:new', payload);
  }

  public updateComment(analysisId: string, payload: {}) {
    this.wss.to(analysisId).emit('comment:update', payload);
  }

  public deleteComment(analysisId: string, payload: {}) {
    this.wss.to(analysisId).emit('comment:delete', payload)
  }
}

