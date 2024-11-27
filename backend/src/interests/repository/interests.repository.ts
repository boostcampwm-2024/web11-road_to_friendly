import { Interest } from '../domain/interest';
import { InterestsImageDto } from '../dto/interests.image.dto';

export interface InterestsRepository {
  addInterestIfBroadcasting(roomId: string, interest: Interest);
  next(roomId: string, hostFlag: boolean, clientId: string);
  deleteRoomInterest(roomId: string);
  uploadImage(data: InterestsImageDto);
}
