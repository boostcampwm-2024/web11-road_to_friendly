import { DotLottieReact } from '@lottiefiles/dotlottie-react';

import RoomError from './RoomError';

const RoomAlreadyEnter = () => {
  return (
    <RoomError
      title="중복 입장을 감지했어요"
      description="죄송해요. 이미 방에 입장한 세션이 존재하는 것 같아요.
        한 번에 하나의 세션만 진행할 수 있어요. 
        또다른 세션을 진행하고 싶다면 이전 세션이 끝난 뒤 다시 시도해주세요!"
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

export default RoomAlreadyEnter;
