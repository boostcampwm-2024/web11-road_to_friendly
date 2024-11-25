import { css } from '@emotion/react';
import { useState, useEffect, useRef } from 'react';

import LinkIcon from '@/assets/icons/link.svg?react';
import { useToast } from '@/hooks';
import { sendYoutubeEnrollRequest } from '@/services';
import { useSocketStore } from '@/stores';
import { flexStyle, Variables } from '@/styles';
import { checkYoutubeURLValidation, getYoutubeEmbedURL } from '@/utils';

import { StepComponentType } from '../contentEnrollModal';

const thumbnailSectionStyle = css([
  {
    position: 'relative',
    width: '100%',
    height: 315,
    overflow: 'hidden',
    backgroundColor: Variables.colors.surface_default,
    backgroundImage: `URL(
      "data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='16' ry='16' stroke='%23C4C4C4FF' stroke-width='2' stroke-dasharray='5' stroke-dashoffset='0' stroke-linecap='square'/%3e%3c/svg%3e"
    )`,
    borderRadius: 16
  },
  flexStyle(0)
]);

const resetButtonStyle = css({
  position: 'absolute',
  top: 0,
  right: 0,
  width: 32,
  height: 32,
  backgroundColor: Variables.colors.surface_black,
  color: Variables.colors.text_white,
  font: Variables.typography.font_bold_24,
  borderRadius: 999,
  transform: 'translate(50%, -50%)',
  ':hover': {
    backgroundColor: Variables.colors.surface_strong
  },
  transition: 'all 0.3s ease-in-out'
});

const inputWrapperStyle = css({
  position: 'relative',
  width: '100%'
});

const inputStyle = (isValid: boolean | null, youtubeURL: string) =>
  css({
    padding: 8,
    border: `2px solid ${
      isValid === null || youtubeURL === '' ? Variables.colors.surface_weak : isValid ? 'green' : 'red'
    }`,
    backgroundColor: `${
      isValid === null || youtubeURL === '' ? Variables.colors.surface_weak : isValid ? '#e7f6e7' : '#f9e7e7'
    }`,
    borderRadius: '12px',
    width: '100%',
    outline: 'none',
    transition: 'all 0.3s ease-in-out',
    textAlign: 'center',
    '::placeholder': {
      color: Variables.colors.text_alt,
      font: Variables.typography.font_medium_14
    }
  });

const inputIconStyle = css({
  position: 'absolute',
  left: '10px',
  top: '50%',
  transform: 'translateY(-50%)',
  width: '16px',
  height: '16px',
  fill: Variables.colors.text_weak
});

const buttonStyle = (isValid: boolean | null) =>
  css({
    width: '100%',
    padding: '10px 20px',
    backgroundColor: isValid ? '#4caf50' : '#ccc',
    color: Variables.colors.text_white,
    font: Variables.typography.font_medium_16,
    border: 'none',
    borderRadius: '12px',
    cursor: isValid ? 'pointer' : 'not-allowed',
    ':hover': {
      opacity: isValid ? 0.9 : 1
    }
  });

const previewTextStyle = css({
  font: Variables.typography.font_medium_16,
  color: Variables.colors.text_weak
});

const EnrollYoutubeContent: StepComponentType = ({ changeStepIndex, closeModal }) => {
  const { socket } = useSocketStore();
  const [youtubeURL, setYoutubeURL] = useState('');
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { openToast } = useToast();

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setYoutubeURL(inputValue);

    setIsValid(checkYoutubeURLValidation(inputValue));
  };

  const handleSubmit = async (youtubeURL: string) => {
    if (isValid) {
      try {
        await sendYoutubeEnrollRequest(socket, youtubeURL);
        openToast({ text: '공유 대기 목록에 컨텐츠를 추가했어요!', type: 'check' });
        closeModal();
      } catch (error) {
        if (error instanceof Error) openToast({ text: error.message, type: 'error' });
      }
    }
  };

  return (
    <div css={flexStyle(16, 'column')} style={{ width: '100%', marginTop: 12 }}>
      <div style={{ width: '100%', position: 'relative' }}>
        <div css={thumbnailSectionStyle}>
          {isValid ? (
            <iframe
              title="YouTube Preview"
              width="100%"
              height="100%"
              src={getYoutubeEmbedURL(youtubeURL)}
              frameBorder="0"
              allowFullScreen
            ></iframe>
          ) : (
            <p css={previewTextStyle}>여기에 미리보기가 표시됩니다.</p>
          )}
        </div>
        {isValid && (
          <button
            css={resetButtonStyle}
            onClick={() => {
              setYoutubeURL('');
              setIsValid(false);
              inputRef.current.focus();
            }}
          >
            -
          </button>
        )}
      </div>
      <div css={inputWrapperStyle}>
        <input
          id="youtube-link"
          type="text"
          ref={inputRef}
          placeholder={isValid === null || youtubeURL === '' ? '유튜브 링크를 입력해주세요!' : undefined}
          value={youtubeURL}
          onChange={handleInputChange}
          css={inputStyle(isValid, youtubeURL)}
        />
        <LinkIcon css={inputIconStyle} />
      </div>
      <button onClick={() => handleSubmit(youtubeURL)} disabled={!isValid} css={buttonStyle(isValid)}>
        제출하고 공유 시작하기 ✨
      </button>
    </div>
  );
};

export default EnrollYoutubeContent;
