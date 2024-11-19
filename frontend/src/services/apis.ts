import { KeywordResponse } from '@/types';
import { Socket } from 'socket.io-client';

export const sendPickKeywordMessage = (socket: Socket, questionId: number, keyword: string) => {
  if (socket && socket.connected) {
    socket.emit('keyword:pick', { questionId, keyword }, (response: KeywordResponse) => {
      if (response.action !== 'pick') {
        /*
          TODO: 추후 서버 로직에서 status가 ok로 바뀐다면 수정 필요
          */
        throw new Error('서버에서 문제가 생긴 것 같아요. Enter를 눌러 다시 전송해주세요.');
      } else {
        return true;
      }
    });
  }
};

export const sendReleaseKeywordMessage = (socket: Socket, questionId: number, keyword: string) => {
  if (socket && socket.connected) {
    socket.emit('keyword:release', { questionId, keyword }, (response: KeywordResponse) => {
      if (response.action !== 'release') {
        /*
          TODO: 추후 서버 로직에서 status가 ok로 바뀐다면 수정 필요
          */
        throw new Error('서버에서 문제가 생긴 것 같아요. Enter를 눌러 다시 전송해주세요.');
      } else {
        return true;
      }
    });
  }
};
