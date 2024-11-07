import { Variables } from '../styles/Variables';
import { css } from '@emotion/react';
import Crown from '../assets/icons/crown.svg?react';

const profileStyle = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 10px;
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
  Variables.colors.player_orange
];

interface Participant {
  id: string;
  nickname: string;
}

interface UserProfileProps {
  participant: Participant;
  index: number;
  isCurrentUser: boolean;
  isHost: boolean;
}

const UserProfile = ({ participant, index, isCurrentUser, isHost }: UserProfileProps) => {
  return (
    <div key={participant.id} css={profileStyle}>
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
    </div>
  );
};

export default UserProfile;
