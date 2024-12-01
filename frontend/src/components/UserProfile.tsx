import { css } from '@emotion/react';

import Crown from '@/assets/icons/crown.svg?react';
import ResultView from '@/pages/room/resultView';
import { useRadiusStore } from '@/stores';
import { Variables, flexStyle } from '@/styles';
import { Participant } from '@/types';

const profileStyle = (x: number, y: number, shortRadius: number, longRadius: number, isOutOfBounds: boolean) => css`
  position: absolute;
  left: ${longRadius + x}px;
  bottom: ${shortRadius + y}px;
  transform: translate(-50%, 50%) scale(1);
  transition: 1s ease-in-out;
  opacity: ${isOutOfBounds ? 0 : 1};
  transition: opacity 0.5s ease-in-out;
  ${flexStyle(10, 'column', 'center', 'center')};

  @media (min-height: 768px) and (max-height: 1200px) {
    transform: translate(-50%, 50%) scale(0.8);
  }
`;

const profileImageStyle = (bgColor: string) => css`
  position: relative;
  width: 100px;
  height: 100px;
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
  font-size: 15px;
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
  [Variables.colors.player_blue, '🐯'],
  [Variables.colors.player_grey, '🦊'],
  [Variables.colors.player_red, '🐱'],
  [Variables.colors.player_green, '🐼'],
  [Variables.colors.player_orange, '🐨'],
  [Variables.colors.player_purple, '🐵'],
  [Variables.colors.player_yellow, '🐰'],
  [Variables.colors.player_pink, '🦁'],
  [Variables.colors.player_cyan, '🐶'],
  [Variables.colors.player_brown, '🦝']
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
}

const UserProfile = ({ participant, index, isCurrentUser, isHost, position, isResultView }: UserProfileProps) => {
  const { radius, isOutOfBounds } = useRadiusStore();

  return (
    <div css={profileStyle(position.x, position.y, radius[0], radius[1], isOutOfBounds)}>
      <div css={profileImageStyle(profileColors[index % profileColors.length][0])}>
        {isHost && (
          <div css={hostStyle}>
            <Crown />
          </div>
        )}
        <div>{profileColors[index % profileColors.length][1]}</div>
        <div css={participantNicknameStyle}>{participant.nickname}</div>
        {isCurrentUser && <div css={selfTagStyle}>나</div>}
      </div>
      {isResultView && <ResultView participant={participant} />}
    </div>
  );
};

export default UserProfile;
