import {
  WebSocketGateway, WebSocketServer, SubscribeMessage
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessagesService } from './messages.service';

@WebSocketGateway({
  namespace: '/ws-comments',
  cors: { origin: ['http://localhost:4200'], methods: ['GET', 'POST'] },
})
export class MessagesGateway{

  constructor(
    private readonly messageService: MessagesService
  ){}

  @WebSocketServer() wss: Server;

  @SubscribeMessage('joinRoom')
  handleJoinRoom(client: Socket, analysisId: string) {
    client.join(analysisId);
  }

  public emitCommentNew(analysisId: string, payload: {}) {
    this.wss.to(analysisId).emit('comment:new', payload);
  }

  public updateComment(analysisId: string, payload: {}) {
    this.wss.to(analysisId).emit('comment:update', payload);
  }

  public deleteComment(analysisId: string, payload: {}){
    this.wss.to(analysisId).emit('comment:delete', payload)
  }
}
