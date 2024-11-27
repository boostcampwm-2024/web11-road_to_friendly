import { Injectable } from '@nestjs/common';

@Injectable()
export class ClientsService {
  randomNickname() {
    const cho = Math.floor(Math.random() * 19);
    const jung = Math.floor(Math.random() * 21);
    const jong = Math.floor(Math.random() * 28);
    return String.fromCharCode(0xac00 + 21 * 28 * cho + 28 * jung + jong);
  }
}
