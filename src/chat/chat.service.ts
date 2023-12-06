import { Injectable } from '@nestjs/common';

interface Client {
  id: string;
  name: string;
}

@Injectable()
export class ChatService {
  private clients: Record<string, Client> = {};
  constructor() {
    this.clients = {};
  }

  onClientConnected(client: Client) {
    console.log('que fue', client);
    console.log('id_cliente', client.id);
    this.clients[client.id] = client;
  }

  onClientDisconnected(id: string) {
    delete this.clients[id];
  }
  getClients(): Client[] {
    //return Object.values(this.clients);
    if (this.clients) {
      return Object.values(this.clients);
    } else {
      return [];
    }
  }
}
