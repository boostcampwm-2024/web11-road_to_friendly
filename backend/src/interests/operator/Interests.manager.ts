import { Interest } from '../domain/interest';

export class InterestsManager {
  private readonly queue = new Queue<Interest>();

  checkAndEnqueueIfShared(interest: Interest) {
    const nowInterest = this.queue.peek();
    this.queue.enqueue(interest);

    return nowInterest === undefined;
  }

  getNextInterest() {
    this.queue.dequeue();
    return this.queue.peek();
  }

  isMyInterest(clientId: string) {
    const nowInterest = this.queue.peek();
    return nowInterest.clientId === clientId;
  }
}
