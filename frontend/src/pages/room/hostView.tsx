import UserProfile from '../../components/UserProfile';

interface HostViewProps {
  participantCount: number;
}

const HostView = ({ participantCount }: HostViewProps) => {
  return (
    <div>
      <div>방장 화면</div>
      {participantCount > 1 ? (
        <h2>방에 참가자들이 다 모였다면 시작해볼까요?</h2>
      ) : (
        <div>
          <UserProfile />
          <h2>방이 텅 비었어요. 하단의 버튼을 눌러 친구들을 초대해보세요!</h2>
        </div>
      )}
    </div>
  );
};

export default HostView;
