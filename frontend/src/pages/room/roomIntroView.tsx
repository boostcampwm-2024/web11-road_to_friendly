import HostView from './hostView';
import ParticipantView from './participantView';
import QuestionsView from './questionsView';

interface RoomIntroViewProps {
  isIntroViewActive: boolean;
  currentUserId: string | null;
  hostId: string | null;
  participantCount: number;
  hideIntroView: () => void;
  resultLoading: boolean;
  onLastQuestionComplete: () => void;
  startResultLoading: () => void;
  finishResultLoading: () => void;
}

const RoomIntroView = ({
  isIntroViewActive,
  currentUserId,
  hostId,
  participantCount,
  hideIntroView,
  onLastQuestionComplete,
  startResultLoading,
  finishResultLoading
}: RoomIntroViewProps) => {
  return (
    <>
      {isIntroViewActive &&
        (hostId === currentUserId ? <HostView participantCount={participantCount} /> : <ParticipantView />)}
      <QuestionsView
        onQuestionStart={hideIntroView}
        onLastQuestionComplete={onLastQuestionComplete}
        startResultLoading={startResultLoading}
        finishResultLoading={finishResultLoading}
      />
    </>
  );
};

export default RoomIntroView;
