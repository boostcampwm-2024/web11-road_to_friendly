import { IoAdapter } from '@nestjs/platform-socket.io';
import { ServerOptions } from 'socket.io';
import * as process from 'node:process';
import Redis from 'ioredis';
import { createAdapter } from '@socket.io/redis-adapter';

export class CustomWebSocketAdapter extends IoAdapter {
  constructor(
    appOrHttpServer: any,
    private readonly redisClient: Redis | null,
  ) {
    super(appOrHttpServer);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  createIOServer(port: number, options?: ServerOptions & { namespace?: string; server?: any }): any {
    return super.createIOServer(port, {
      ...options,
      cors: {
        origin: process.env.ORIGIN,
      },
      adapter: this.createRedisAdapter(this.redisClient),
    });
  }

  private createRedisAdapter(redisClient: Redis | null) {
    if (redisClient === null) {
      return undefined;
    }

    const pubClient = redisClient.duplicate();
    const subClient = redisClient.duplicate();

    return createAdapter(pubClient, subClient, {
      publishOnSpecificResponseChannel: false,
    });
  }
}
