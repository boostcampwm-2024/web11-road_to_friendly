export class Topic {
  readonly questionId: number;
  readonly title: string;
  readonly expirationTime: string;

  constructor(questionId: number, title: string, addSecond: number) {
    this.questionId = questionId;
    this.title = title;
    const date = new Date();
    date.setSeconds(date.getSeconds() + addSecond);
    this.expirationTime = date.toISOString();
  }
}
