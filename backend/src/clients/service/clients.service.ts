import { Injectable } from '@nestjs/common';

@Injectable()
export class ClientsService {
  private readonly actions = [
    '졸린',
    '춤추는',
    '꿈꾸는',
    '밥먹는',
    '배고픈',
    '코고는',
    '잠자는',
    '놀란',
    '웃는',
    '사나운',
    '두려운',
    '겁먹은',
    '살찐',
    '마른',
    '수줍은',
    '귀여운',
    '조용한',
    '용감한',
    '멋진',
    '예쁜',
    '이상한',
    '기쁜',
    '행복한',
    '걷는',
    '뛰는',
    '나는',
    '빠른',
    '느린',
    '배부른',
  ];

  private readonly animals = [
    '토끼',
    '여우',
    '펭귄',
    '고래',
    '매',
    '기린',
    '치타',
    '곰',
    '닭',
    '악어',
    '오리',
    '늑대',
    '하마',
    '말',
    '양',
    '염소',
    '쥐',
    '뱀',
    '거위',
  ];

  randomNickname() {
    const action = this.actions[Math.floor(Math.random() * this.actions.length)];
    const animal = this.animals[Math.floor(Math.random() * this.animals.length)];

    return `${action} ${animal}`;
  }
}
