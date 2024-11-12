import HostView from './hostView';
import ParticipantView from './participantView';
import QuestionsView from './questionsView';

interface RoomIntroViewProps {
  isIntroViewActive: boolean;
  currentUserId: string | null;
  hostId: string | null;
  participantCount: number;
  hideIntroView: () => void;
}

const RoomIntroView = ({
  isIntroViewActive,
  currentUserId,
  hostId,
  participantCount,
  hideIntroView
}: RoomIntroViewProps) => {
  if (!isIntroViewActive) return null;

  return (
    <>
      {hostId === currentUserId ? <HostView participantCount={participantCount} /> : <ParticipantView />}
      <QuestionsView onQuestionStart={hideIntroView} />
    </>
  );
};

export default RoomIntroView;
