import { Module } from '@nestjs/common';
import { WebSocketService } from './web-socket.service';
import { MessagesWsGateway } from './web-socket.gateway';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  providers: [MessagesWsGateway,WebSocketService],
  imports: [AuthModule]
})
export class WebSocketModule {}
