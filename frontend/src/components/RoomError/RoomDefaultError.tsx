import RoomError from './RoomError';

const RoomDefaultError = () => {
  return (
    <RoomError
      title="내부 에러 발생!"
      description="죄송해요, 서비스 내부에서 알 수 없는 에러가 발생했어요.
    잠시 후에 다시 시도해주세요!
    "
    />
  );
};
export default RoomDefaultError;
