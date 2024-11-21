import { css } from '@emotion/react';
import Crown from '@/assets/icons/crown.svg?react';
import { useRadiusStore } from '@/stores';
import { Variables } from '@/styles';
import { Participant } from '@/types';
import ResultView from '@/pages/room/resultView';
import { flexStyle } from '@/styles';

const profileStyle = (x: number, y: number, shortRadius: number, longRadius: number) => css`
  position: absolute;
  left: ${longRadius + x}px;
  bottom: ${shortRadius + y}px;
  transform: translate(-50%, 50%);
  transition: 1s ease-in-out;
  ${flexStyle(10, 'column', 'center', 'center')}
`;

const profileImageStyle = (bgColor: string) => css`
  position: relative;
  width: 90px;
  height: 90px;
  background-color: ${bgColor};
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 30px;
  color: ${Variables.colors.text_white};
`;

const participantNicknameStyle = css`
  font-size: 16px;
  font-weight: bold;
  color: ${Variables.colors.text_default};
`;

const selfTagStyle = css`
  position: absolute;
  top: -1px;
  right: 5px;
  width: 25px;
  height: 25px;
  border-radius: 50%;
  background: ${Variables.colors.surface_black};
  color: ${Variables.colors.text_white};
  text-align: center;
  font-size: 16px;
`;

const hostStyle = css`
  position: absolute;
  top: -25px;
  width: 50px;
  height: 40px;
`;

const profileColors = [
  Variables.colors.player_blue,
  Variables.colors.player_grey,
  Variables.colors.player_red,
  Variables.colors.player_green,
  Variables.colors.player_orange,
  Variables.colors.player_purple,
  Variables.colors.player_yellow,
  Variables.colors.player_pink,
  Variables.colors.player_cyan,
  Variables.colors.player_brown
];

interface Positon {
  x: number;
  y: number;
}

interface UserProfileProps {
  participant: Participant;
  index: number;
  isCurrentUser: boolean;
  isHost: boolean;
  position: Positon;
  isResultView: boolean;
  setIsResultView: React.Dispatch<React.SetStateAction<boolean>>;
}

const UserProfile = ({
  participant,
  index,
  isCurrentUser,
  isHost,
  position,
  isResultView = false,
  setIsResultView
}: UserProfileProps) => {
  const { radius } = useRadiusStore();

  return (
    <div css={profileStyle(position.x, position.y, radius[0], radius[1])}>
      <div css={profileImageStyle(profileColors[index % profileColors.length])}>
        {isHost && (
          <div css={hostStyle}>
            <Crown />
          </div>
        )}
        <div>🐯</div>
        <div css={participantNicknameStyle}>{participant.nickname}</div>
        {isCurrentUser && <div css={selfTagStyle}>나</div>}
      </div>
      {isResultView && <ResultView participant={participant} setIsResultView={setIsResultView} />}
    </div>
  );
};

export default UserProfile;
