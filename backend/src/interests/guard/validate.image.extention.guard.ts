import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { CustomException } from 'src/common/exception/custom-exception';
import { ContentTypes } from '../definition/contentType';

@Injectable()
export class ValidateImageExtensionGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const { fileName } = context.switchToWs().getData();

    if (!fileName) {
      throw new CustomException('파일명이 없습니다.');
    }

    const extension = fileName.split('.').pop()?.toUpperCase();
    if (!extension) {
      throw new CustomException('확장자가 없습니다.');
    }

    if (!ContentTypes[extension]) {
      throw new CustomException(`지원되지 않는 확장자: ${extension}`);
    }

    return true;
  }
}
