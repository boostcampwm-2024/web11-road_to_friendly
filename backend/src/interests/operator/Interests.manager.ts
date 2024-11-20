import { Interest } from '../domain/interest';
import { Queue } from '../../common/util/queue';

export class InterestsManager {
  private readonly queue = new Queue<Interest>();
  private nowInterest = null;

  addInterestIfBroadcasting(interest: Interest) {
    if (this.nowInterest === null) {
      this.nowInterest = interest;
    } else {
      this.queue.enqueue(interest);
    }

    return this.queue.getSize();
  }

  getNextInterest(): Interest | null {
    this.nowInterest = this.queue.dequeue();
    return this.nowInterest;
  }

  isMyInterest(clientId: string) {
    return clientId === this.nowInterest?.clientId;
  }

  getQueueSize() {
    return this.queue.getSize();
  }
}
