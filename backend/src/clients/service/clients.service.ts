import { Injectable } from '@nestjs/common';

@Injectable()
export class ClientsService {
  private readonly actions = [
    '포효하는',
    '드러누운',
    '하품하는',
    '졸린',
    '춤추는',
    '재주넘는',
    '꿈꾸는',
    '요리하는',
    '밥먹는',
    '노래하는',
    '배고픈',
    '웃고있는',
    '코고는',
  ];

  private readonly animals = [
    '호랑이',
    '강아지',
    '고양이',
    '토끼',
    '여우',
    '거북이',
    '펭귄',
    '고래',
    '매',
    '독수리',
    '기린',
    '비둘기',
    '티라노',
    '고슴도치',
    '미어캣',
    '코끼리',
    '치타',
  ];

  randomNickname() {
    const action = this.actions[Math.floor(Math.random() * this.actions.length)];
    const animal = this.animals[Math.floor(Math.random() * this.animals.length)];

    return `${action} ${animal}`;
  }
}
