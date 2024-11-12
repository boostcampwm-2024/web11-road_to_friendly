export class Topic {
  private readonly questionId: number;
  private readonly title: string;
  private readonly expirationTime: string;

  constructor(questionId: number, title: string, addSecond: number) {
    this.questionId = questionId;
    this.title = title;
    const date = new Date();
    date.setSeconds(date.getSeconds() + addSecond);
    this.expirationTime = date.toISOString();
  }
}
