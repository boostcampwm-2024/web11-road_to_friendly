import { interestsResource } from '../definition/interests.resource';

export class Interest {
  readonly clientId: string;
  readonly resourceType: interestsResource;
  readonly resourceUrl: string;

  constructor(clientId: string, resourceType: interestsResource, url: string) {
    this.clientId = clientId;
    this.resourceType = resourceType;
    this.resourceUrl = url;
  }
}
