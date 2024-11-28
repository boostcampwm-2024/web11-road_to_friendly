import { join } from 'path';
import { promises as fs } from 'fs';

import { v4 as uuid } from 'uuid';

import { InterestsManager } from '../operator/Interests.manager';
import { getOrCreateValue } from '../../common/util/get-or-create-value';
import { Interest } from '../domain/interest';
import { CustomException } from '../../common/exception/custom-exception';
import { InterestsBroadcastResponseDto } from '../dto/interests.broadcast.response.dto';
import { InterestsImageDto } from '../dto/interests.image.dto';
import { ContentTypes } from '../definition/contentType';

import { InterestsRepository } from './interests.repository';

export class InterestsInMemoryRepository implements InterestsRepository {
  private readonly roomInterest = new Map<string, InterestsManager>();

  addInterestIfBroadcasting(roomId: string, interest: Interest) {
    const interestsManager = getOrCreateValue(this.roomInterest, roomId, () => new InterestsManager());
    const nowQueueSize = interestsManager.addInterestIfBroadcasting(interest);
    return InterestsBroadcastResponseDto.of(interest, nowQueueSize);
  }

  next(roomId: string, hostFlag: boolean, clientId: string) {
    const interestsManager = this.roomInterest.get(roomId);

    if (hostFlag || interestsManager.isMyInterest(clientId)) {
      const nextInterest = interestsManager.getNextInterest();
      const nowQueueSize = interestsManager.getQueueSize();
      return InterestsBroadcastResponseDto.of(nextInterest, nowQueueSize);
    }

    throw new CustomException('권한이 없습니다.');
  }

  deleteRoomInterest(roomId: string) {
    this.roomInterest.delete(roomId);
  }

  async uploadImage(data: InterestsImageDto) {
    const extension = data.fileName.split('.').pop()?.toUpperCase();
    if (!extension) {
      throw new CustomException('확장자가 없습니다.'); // TODO: 가드로 변경
    }

    if (!ContentTypes[extension]) {
      throw new CustomException(`지원되지 않는 확장자: ${extension}`); // TODO: 가드로 변경
    }

    const uniqueFileName = `${uuid()}-${data.fileName}`;

    const dirPath = join(__dirname, '..', 'shareImage');
    const filePath = join(dirPath, uniqueFileName);

    try {
      await fs.mkdir(dirPath, { recursive: true });

      await fs.writeFile(filePath, data.buffer);

      return `http://localhost:8080/shareImage/${uniqueFileName}`;
    } catch (error) {
      throw new CustomException(`파일 업로드 실패: ${error.message}`);
    }
  }
}
