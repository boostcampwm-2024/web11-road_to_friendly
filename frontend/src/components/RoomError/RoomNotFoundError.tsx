import RoomError from './RoomError';

const RoomNotFoundError = () => {
  return (
    <RoomError
      title="방 찾을 수 없음"
      description="죄송합니다. 요청하신 방은 존재하지 않습니다.
      입력한 방 번호가 정확한지 확인해 주시고, 다시 시도해 주세요."
    />
  );
};

export default RoomNotFoundError;
