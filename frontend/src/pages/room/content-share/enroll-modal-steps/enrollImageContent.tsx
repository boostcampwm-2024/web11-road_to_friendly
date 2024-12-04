import { css } from '@emotion/react';
import { useEffect, useState } from 'react';

import { LoadingSpinner } from '@/components/common';

import DeleteButton from '@/assets/icons/deleteButton.svg?react';
import Image from '@/assets/icons/image.svg?react';
import { useToast } from '@/hooks';
import { useSocketStore } from '@/stores';
import { flexStyle, Variables } from '@/styles';

import { StepComponentType } from '../contentEnrollModal';

const EnrollImageContent: StepComponentType = ({ closeModal }) => {
  const { socket } = useSocketStore();
  const { openToast } = useToast();

  const [isActive, setActive] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileData, setFileData] = useState<{ filename: string; buffer: ArrayBuffer } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleDragStart = () => setActive(true);
  const handleDragEnd = () => setActive(false);
  const handleDrop = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();

    const file = event.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) handleFileSelect(file);
  };

  const handleFileSelect = (file: File) => {
    const maxSize = 5 * 1024 * 1024; // 5MB 제한
    if (file.size > maxSize) {
      openToast({ type: 'error', text: '파일 크기가 너무 큽니다! 최대 5MB까지 허용됩니다.' });
      return;
    }

    const reader = new FileReader();

    // 이미지 미리보기 URL 생성
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string);
    };

    // 파일 buffer 생성
    reader.onloadend = () => {
      const bufferReader = new FileReader();
      bufferReader.readAsArrayBuffer(file);
      bufferReader.onload = () => {
        setFileData({
          filename: file.name,
          buffer: bufferReader.result as ArrayBuffer
        });
      };
    };

    reader.readAsDataURL(file);
    handleDragStart();
  };

  const resetImagePreview = () => {
    setPreviewUrl(null);
    handleDragEnd();
    setLoading(false);
  };

  const shareImage = () => {
    if (!fileData || !fileData.filename || !fileData.buffer) {
      openToast({ type: 'error', text: '유효한 이미지 파일이 아닙니다. 다시 시도해 주세요.' });
      return;
    }

    setLoading(true);

    const timeout = setTimeout(() => {
      setLoading(false);
      openToast({ type: 'error', text: '사진 공유에 실패했습니다.' });
    }, 5000);

    socket.emit(
      'interest:image',
      { fileName: fileData.filename, buffer: fileData.buffer },
      (response: { status: string }) => {
        clearTimeout(timeout); // 응답이 왔을 때 타임아웃 제거
        setLoading(false);

        if (response.status === 'ok') {
          resetImagePreview();
          closeModal();
        } else {
          openToast({ type: 'error', text: '사진 공유에 실패했습니다.' });
        }
      }
    );
  };

  // 클립보드에서 이미지 붙여넣기 처리
  const handlePaste = (event: ClipboardEvent) => {
    const items = event.clipboardData?.items;
    if (items) {
      for (const item of items) {
        if (item.type.startsWith('image/')) {
          const file = item.getAsFile();
          if (file) {
            handleFileSelect(file);
          }
        } else {
          openToast({ type: 'error', text: '이미지 파일만 가능합니다' });
        }
      }
    }
  };

  useEffect(() => {
    //클립보드 이벤트 리스너 추가
    window.addEventListener('paste', handlePaste);

    return () => {
      window.removeEventListener('paste', handlePaste);
    };
  }, []);

  return (
    <div css={[flexStyle(15, 'column', 'center', 'center'), { width: '100%' }]}>
      <label
        css={previewStyle(isActive)}
        onDragOver={(event) => event.preventDefault()}
        onDragEnter={handleDragStart}
        onDragLeave={handleDragEnd}
        onDrop={handleDrop}
      >
        {previewUrl ? (
          <div css={{ width: '100%', height: '100%', position: 'relative' }}>
            <img src={previewUrl} css={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '16px' }} />
            <button css={deleteButtonStyle} onClick={resetImagePreview}>
              <DeleteButton width={30} height={30} />
            </button>
          </div>
        ) : (
          <>
            <input type="file" css={{ display: 'none' }} accept=".jpg,.jpeg,.png" onChange={handleInputChange} />
            <Image width={50} height={50} fill={Variables.colors.surface_alt} />
            <p>
              이미지를 드래그 앤 드랍으로 업로드할 수 있어요.
              <br />
              혹은,
            </p>
            <div css={selectButtonStyle}>디바이스에서 파일을 선택할 수도 있어요.</div>
          </>
        )}
      </label>
      <button css={imgShareButtonStyle(isActive)} onClick={shareImage}>
        {loading ? (
          <div css={{ display: 'flex', justifyContent: 'center' }}>
            <LoadingSpinner
              roundSize="1.7rem"
              emptyColor={`${Variables.colors.surface_white}50`}
              fillColor={Variables.colors.surface_white}
            />
          </div>
        ) : (
          '제출하고 공유 시작하기✨'
        )}
      </button>
    </div>
  );
};

export default EnrollImageContent;

const previewStyle = (isActive: boolean) => css`
  width: 100%;
  height: 280px;
  margin: auto;
  background-color: ${Variables.colors.surface_default};
  border-radius: 16px;
  border: 3px dashed ${isActive ? Variables.colors.surface_black : Variables.colors.surface_alt};
  ${flexStyle(15, 'column', 'center', 'center')};
  cursor: pointer;
  font: ${Variables.typography.font_medium_16};
`;

const selectButtonStyle = css`
  background-color: ${Variables.colors.surface_white};
  padding: 12px 8px;
  color: ${Variables.colors.surface_green_strong};
  border: 1px solid ${Variables.colors.surface_green_strong};
  border-radius: 12px;
`;

const imgShareButtonStyle = (isActive: boolean) => css`
  width: 100%;
  background-color: ${isActive ? Variables.colors.surface_green_strong : Variables.colors.surface_alt};
  color: ${Variables.colors.text_white};
  padding: 12px 8px;
  border: none;
  border-radius: 12px;
`;

const deleteButtonStyle = () => css`
  position: absolute;
  top: -10px;
  right: -10px;
  background: none;
  border: none;
  cursor: pointer;
`;
