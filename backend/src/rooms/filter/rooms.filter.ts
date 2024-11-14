import { ArgumentsHost, Catch } from '@nestjs/common';
import { BaseWsExceptionFilter, WsException } from '@nestjs/websockets';

const CALLBACK_INDEX = 2;

@Catch(WsException)
export class WsExceptionFilter extends BaseWsExceptionFilter {
  catch(exception: WsException, host: ArgumentsHost) {
    const client = host.switchToWs().getClient();
    const callback = host.getArgByIndex(CALLBACK_INDEX);
    const response = { status: 'error', message: exception.message };

    if (typeof callback === 'function') {
      callback(response);
    } else {
      client.emit('error', response);
    }
  }
}
