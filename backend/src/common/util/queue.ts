export class Queue<T> {
  private queue: (T | null)[];
  private head: number = 0;
  private tail: number = 0;
  private size: number = 0;
  private capacity: number;

  constructor(initSize: number = 8) {
    if (initSize <= 0) {
      throw new Error('initSize는 0이나 음수일 수 없습니다.');
    }

    this.capacity = initSize;
    this.queue = new Array<T | null>(initSize).fill(null);
  }

  enqueue(item: T) {
    if (this.isFull()) {
      this.resize();
    }

    this.queue[this.tail] = item;
    this.tail = (this.tail + 1) % this.capacity;
    this.size++;
  }

  dequeue(): T | null {
    if (this.isEmpty()) {
      return null;
    }

    const item = this.queue[this.head];
    this.head = (this.head + 1) % this.capacity;
    this.size--;
    return item;
  }

  isEmpty() {
    return this.size === 0;
  }

  peek(): T | null {
    return this.queue[this.head];
  }

  private isFull(): boolean {
    return this.size === this.capacity;
  }

  private resize() {
    const newCapacity = this.capacity * 2;
    const newQueue = new Array<T | null>(newCapacity).fill(null);

    for (let i = 0; i < this.size; i++) {
      newQueue[i] = this.queue[(this.head + i) % this.capacity];
    }

    this.queue = newQueue;
    this.capacity = newCapacity;

    this.head = 0;
    this.tail = this.size;
  }

  getSize() {
    return this.size;
  }
}
