import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { ChatService } from './chat.service';
import { Socket, Server } from 'socket.io';
import { OnModuleInit } from '@nestjs/common';

@WebSocketGateway()
export class ChatGateway implements OnModuleInit {
  @WebSocketServer()
  server: Server;

  constructor(private readonly chatService: ChatService) {}

  onModuleInit() {
    this.server.on('connection', (socket: Socket) => {
      console.log('client conected', socket.id);

      const { token, name } = socket.handshake.auth;

      console.log('token', token, 'name', name);

      if (!name) {
        socket.disconnect();
        return;
      }
      //socket.disconnect();
      this.chatService.onClientConnected({ id: socket.id, name: name });
      this.server.emit('on-clients-changed', this.chatService.getClients());

      socket.emit('welcome-message', 'holas');

      socket.on('disconnect', () => {
        this.chatService.onClientDisconnected(socket.id);
        this.server.emit('on-clients-changed', this.chatService.getClients);
        console.log('client disconect', socket.id);
      });
    });
  }

  @SubscribeMessage('send-message')
  handleMessage(
    @MessageBody() message: string,
    @ConnectedSocket() client: Socket,
  ) {
    const { name } = client.handshake.auth;
    if (!message) {
      return;
    }
    this.server.emit('on-message', {
      userId: client.id,
      message: message,
      name: name,
    });

    console.log('message', message);
    client.broadcast.emit('new-message', message);
  }
}
