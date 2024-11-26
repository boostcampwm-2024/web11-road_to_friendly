import { ArgumentsHost, Catch } from '@nestjs/common';
import { BaseWsExceptionFilter } from '@nestjs/websockets';
import { CustomException } from '../exception/custom-exception';

const CALLBACK_INDEX = 2;

@Catch(CustomException)
export class SocketCustomExceptionFilter extends BaseWsExceptionFilter {
  catch(exception: CustomException, host: ArgumentsHost) {
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
