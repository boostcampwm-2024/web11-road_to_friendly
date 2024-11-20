import { Interest } from '../domain/interest';
import { Queue } from '../../common/util/queue';

export class InterestsManager {
  private readonly queue = new Queue<Interest>();
  private nowInterest = null;

  checkAndEnqueueIfShared(interest: Interest) {
    if (this.nowInterest === null) {
      this.nowInterest = interest;
      return true;
    }

    this.queue.enqueue(interest);
    return false;
  }

  getNextInterest() {
    this.nowInterest = this.queue.dequeue();
    return this.nowInterest;
  }

  isMyInterest(clientId: string) {
    return clientId === this.nowInterest?.clientId;
  }
}
