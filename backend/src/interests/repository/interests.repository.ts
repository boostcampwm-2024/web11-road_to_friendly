import { Interest } from '../domain/interest';
import { InterestsImageDto } from '../dto/interests.image.dto';
import { InterestsBroadcastResponseDto } from '../dto/interests.broadcast.response.dto';

export interface InterestsRepository {
  addInterestIfBroadcasting(roomId: string, interest: Interest): InterestsBroadcastResponseDto;
  next(roomId: string, hostFlag: boolean, clientId: string): InterestsBroadcastResponseDto;
  deleteRoomInterest(roomId: string): void;
  uploadImage(data: InterestsImageDto): Promise<string>;
}
