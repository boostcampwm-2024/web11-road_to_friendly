import { IoAdapter } from '@nestjs/platform-socket.io';
import { Server, ServerOptions } from 'socket.io';
import * as process from 'node:process';
import Redis from 'ioredis';
import { createShardedAdapter } from '@socket.io/redis-adapter';

export class CustomWebSocketAdapter extends IoAdapter {
  create(port: number, options?: ServerOptions & { namespace?: string; server?: any }): Server {
    return super.create(port, options);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  createIOServer(port: number, options?: ServerOptions & { namespace?: string; server?: any }): any {
    const pubClient = new Redis();
    const subClient = pubClient.duplicate();

    return super.createIOServer(port, {
      ...options,
      cors: {
        origin: process.env.ORIGIN,
      },
      adapter: createShardedAdapter(pubClient, subClient, {
        subscriptionMode: 'dynamic-private',
      }),
    });
  }
}
