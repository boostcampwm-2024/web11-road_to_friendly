import * as AWS from 'aws-sdk';
import { v4 as uuid } from 'uuid';
import { ConfigService } from '@nestjs/config';
import { CustomException } from 'src/common/exception/custom-exception';

import { InterestsImageDto } from '../dto/interests.image.dto';
import { ContentTypes } from '../definition/contentType';
import { InterestsManager } from '../operator/Interests.manager';

import { InterestsImageRepository } from './interests.image.repository';

export class InterestsOSImageRepository implements InterestsImageRepository {
  private s3: AWS.S3;

  private endpoint: AWS.Endpoint;
  private readonly region: string;
  private readonly access_key: string;
  private readonly secret_key: string;

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

  async uploadImage(data: InterestsImageDto) {
    const extension = data.fileName.split('.').pop()?.toUpperCase();

    const contentType = ContentTypes[extension];

    const uniqueFileName = `${uuid()}-${data.fileName}`;

    const params = {
      Bucket: 'road-to-friendly-bucket',
      Key: `shareImage/${uniqueFileName}`,
      Body: data.buffer,
      ContentType: contentType,
      ACL: 'public-read',
    };

    try {
      const result = await this.s3.upload(params).promise();
      return result.Location;
    } catch (error) {
      throw new CustomException(`파일 업로드 실패: ${error.message}`);
    }
  }
}
