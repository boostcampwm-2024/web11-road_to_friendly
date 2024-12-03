import RoomError from './RoomError';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const RoomDefaultError = () => {
  return (
    <RoomError
      title="내부 에러 발생!"
      description="죄송해요, 서비스 내부에서 알 수 없는 에러가 발생했어요.
    잠시 후에 다시 시도해주세요!
    "
      AnimationElement={
        <div css={{ width: '40rem' }}>
          <DotLottieReact
            src="https://lottie.host/f4e6b578-c9bd-436c-ab24-a0d42a3530c6/glm9YM3zKA.lottie"
            loop
            autoplay
          />
        </div>
      }
    />
  );
};
export default RoomDefaultError;
