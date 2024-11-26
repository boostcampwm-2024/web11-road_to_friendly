import { IoAdapter } from '@nestjs/platform-socket.io';
import { ServerOptions } from 'socket.io';

export class CustomWebSocketAdapter extends IoAdapter {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  createIOServer(port: number, options?: ServerOptions & { namespace?: string; server?: any }): any {
    return super.createIOServer(port, {
      ...options,
      cors: {
        origin: process.env.ORIGIN,
      },
    });
  }
}
