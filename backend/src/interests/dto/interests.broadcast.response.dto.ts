import { interestsResource } from '../definition/interests.resource';
import { Interest } from '../domain/interest';

export class InterestsBroadcastResponseDto {
  readonly participantId: string;
  readonly resourceType: interestsResource;
  readonly resourceUrl: string;
  readonly nowQueueSize: number;

  constructor(participantId: string, resourceType: interestsResource, resourceUrl: string, nowQueueSize: number) {
    this.participantId = participantId;
    this.resourceType = resourceType;
    this.resourceUrl = resourceUrl;
    this.nowQueueSize = nowQueueSize;
  }

  static of(interest: Interest | null, nowQueueSize: number) {
    return new this(interest?.clientId, interest?.resourceType, interest?.resourceUrl, nowQueueSize);
  }
}
