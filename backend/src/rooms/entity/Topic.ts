export class Topic {
  private readonly id: number;
  private readonly title: string;
  private readonly expirationTime: string;

  constructor(id: number, title: string, addSecond: number) {
    this.id = id;
    this.title = title;
    const date = new Date();
    date.setSeconds(date.getSeconds() + addSecond);
    this.expirationTime = date.toISOString();
  }
}
