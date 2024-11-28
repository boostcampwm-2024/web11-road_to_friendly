import { InterestsImageDto } from '../dto/interests.image.dto';

export interface InterestsImageRepository {
  uploadImage(data: InterestsImageDto): Promise<string>;
}
