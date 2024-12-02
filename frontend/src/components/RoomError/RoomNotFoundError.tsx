import RoomError from './RoomError';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const RoomNotFoundError = () => {
  return (
    <RoomError
      title="방 찾을 수 없음"
      description="죄송합니다. 요청하신 방은 존재하지 않습니다.
      입력한 방 번호가 정확한지 확인해 주시고, 다시 시도해 주세요."
      AnimationElement={
        <div css={{ width: '40rem' }}>
          <DotLottieReact
            src="https://lottie.host/091cc406-9d06-4f3c-b8c9-1bec84ed5ecf/CA1ZTxcqlY.lottie"
            loop
            autoplay
          />
        </div>
      }
    />
  );
};

export default RoomNotFoundError;
