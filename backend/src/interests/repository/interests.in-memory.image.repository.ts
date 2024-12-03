import { join } from 'path';
import { promises as fs } from 'fs';

import { v4 as uuid } from 'uuid';

import { CustomException } from '../../common/exception/custom-exception';
import { InterestsImageDto } from '../dto/interests.image.dto';

import { InterestsImageRepository } from './interests.image.repository';

export class InterestsInMemoryImageRepository implements InterestsImageRepository {
  async uploadImage(data: InterestsImageDto) {
    const uniqueFileName = `${uuid()}-${data.fileName}`;

    const dirPath = join(process.cwd(), 'src', 'interests', 'shareImage');
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
