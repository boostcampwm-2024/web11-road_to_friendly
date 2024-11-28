import { Injectable } from '@nestjs/common';
import { ValidationPipe, ValidationError } from '@nestjs/common';
import { CustomException } from 'src/common/exception/custom-exception';

@Injectable()
export class CustomValidationPipe extends ValidationPipe {
  constructor() {
    super({
      exceptionFactory: (errors: ValidationError[]) => {
        return new CustomException('youtube 링크가 아닙니다 : ' + errors.map((err) => err.value).join(', '));
      },
    });
  }
}
