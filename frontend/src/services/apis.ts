import { Socket } from 'socket.io-client';

import { KeywordResponse, SocketWithWorker } from '@/types';

import { SERVICE_ERROR_MESSAGES } from './errorMessages';

export const sendPickKeywordMessage = (
  socket: Socket | SocketWithWorker,
  questionId: number,
  keyword: string
): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    if (socket && socket.connected) {
      socket.emit('keyword:pick', { questionId, keyword }, (response: KeywordResponse) => {
        if (response.status !== 'ok') {
          /*
          TODO: 추후 서버 로직에서 status가 ok로 바뀐다면 수정 필요
          */
          reject(new Error(SERVICE_ERROR_MESSAGES.KEYWORD_SELECT_FAILED));
        } else {
          resolve(true);
        }
      });
    } else {
      reject(new Error(SERVICE_ERROR_MESSAGES.SOCKET_NOT_FOUND));
    }
  });
};

export const sendReleaseKeywordMessage = (
  socket: Socket | SocketWithWorker,
  questionId: number,
  keyword: string
): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    if (socket && socket.connected) {
      socket.emit('keyword:release', { questionId, keyword }, (response: KeywordResponse) => {
        if (response.status !== 'ok') {
          /*
          TODO: 추후 서버 로직에서 status가 ok로 바뀐다면 수정 필요
          */
          reject(new Error(SERVICE_ERROR_MESSAGES.KEYWORD_SELECT_FAILED));
        } else {
          resolve(true);
        }
      });
    } else {
      reject(new Error(SERVICE_ERROR_MESSAGES.SOCKET_NOT_FOUND));
    }
  });
};

export const sendYoutubeEnrollRequest = (socket: Socket | SocketWithWorker, youtubeURL: string): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    if (socket && socket.connected) {
      socket.emit('interest:youtube', { link: youtubeURL });
      resolve(true);
    } else {
      reject(new Error(SERVICE_ERROR_MESSAGES.SOCKET_NOT_FOUND));
    }
  });
};

export const sendShareStopRequest = (socket: Socket | SocketWithWorker): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    if (socket && socket.connected) {
      socket.emit('interest:next');
      resolve(true);
    } else {
      reject(new Error(SERVICE_ERROR_MESSAGES.SOCKET_NOT_FOUND));
    }
  });
};
