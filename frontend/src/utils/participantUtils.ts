import { Participant } from '@/types';
import { ParticipantItem } from '@/types';

// 참가자 배열을 객체로 변환하는 함수
export const convertArrayToObject = (participantsArray: ParticipantItem[]) => {
  return participantsArray.reduce(
    (acc, participant) => {
      acc[participant.id] = participant;
      return acc;
    },
    {} as { [id: string]: Participant }
  );
};
