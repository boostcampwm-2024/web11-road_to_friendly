import { ArgumentsHost, Catch } from '@nestjs/common';
import { BaseWsExceptionFilter, WsException } from '@nestjs/websockets';

@Catch(WsException)
export class WsExceptionFilter extends BaseWsExceptionFilter {
  catch(exception: WsException, host: ArgumentsHost) {
    const client = host.switchToWs().getClient();
    const args = host.getArgs();
    const callback = args[2];

    if (typeof callback === 'function') {
      callback({ status: 'error', message: exception.message });
    } else {
      client.emit('error', { status: 'error', message: exception.message });
    }
  }
}
