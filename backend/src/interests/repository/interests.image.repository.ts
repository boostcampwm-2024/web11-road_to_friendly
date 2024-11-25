import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { v4 as uuid } from 'uuid';
import { InterestsImageDto } from '../dto/interests.image.dto';
import { ContentTypes } from '../definition/contentType';
import { ConfigService } from '@nestjs/config';
import { InterestsManager } from '../operator/Interests.manager';
import * as AsyncLock from 'async-lock';
import { getOrCreateValue } from 'src/common/util/get-or-create-value';
import { InterestsBroadcastResponseDto } from '../dto/interests.broadcast.response.dto';
import { Interest } from '../domain/interest';
import { CustomException } from 'src/common/exception/custom-exception';
import { InterestsRepository } from './interests.repository';

@Injectable()
export class InterestsImageRepository implements InterestsRepository {
  private readonly roomInterest = new Map<string, InterestsManager>();
  private readonly lock = new AsyncLock();

  private s3: AWS.S3;

  private endpoint: AWS.Endpoint;
  private region: string;
  private access_key: string;
  private secret_key: string;

  constructor(private configService: ConfigService) {
    this.endpoint = new AWS.Endpoint(this.configService.get<string>('ENDPOINT'));
    this.region = this.configService.get<string>('REGION');
    this.access_key = this.configService.get<string>('ACCESS_KEY');
    this.secret_key = this.configService.get<string>('SECRET_KEY');

    this.s3 = new AWS.S3({
      endpoint: this.endpoint.href,
      region: this.region,
      credentials: {
        accessKeyId: this.access_key,
        secretAccessKey: this.secret_key,
      },
    });
  }

  async addInterestIfBroadcasting(roomId: string, interest: Interest) {
    return await this.lock.acquire(`${roomId}:share`, async () => {
      const interestsManager = getOrCreateValue(this.roomInterest, roomId, () => new InterestsManager());
      const nowQueueSize = interestsManager.addInterestIfBroadcasting(interest);
      return InterestsBroadcastResponseDto.of(interest, nowQueueSize);
    });
  }

  async next(roomId: string, hostFlag: boolean, clientId: string) {
    return await this.lock.acquire(`${roomId}:share`, async () => {
      const interestsManager = this.roomInterest.get(roomId);

      if (hostFlag || interestsManager.isMyInterest(clientId)) {
        const nextInterest = interestsManager.getNextInterest();
        const nowQueueSize = interestsManager.getQueueSize();
        return InterestsBroadcastResponseDto.of(nextInterest, nowQueueSize);
      }

      throw new CustomException('권한이 없습니다.');
    });
  }

  deleteRoomInterest(roomId: string) {
    this.roomInterest.delete(roomId);
  }

  async uploadImage(data: InterestsImageDto) {
    const extension = data.fileName.split('.').pop()?.toUpperCase();
    const uniqueFileName = `${uuid()}-${data.fileName}`;

    const params = {
      Bucket: 'road-to-friendly-bucket',
      Key: `shareImage/${uniqueFileName}`,
      Body: data.buffer,
      ContentType: ContentTypes[extension],
      ACL: 'public-read',
    };

    const result = await this.s3.upload(params).promise();

    return result.Location;
  }
}
