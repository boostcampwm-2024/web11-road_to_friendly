import { RoomAlreadyEnter, RoomNotFoundError, RoomDefaultError } from '@/components';
import { roomError } from '@/constants/roomError';
import { EmotionJSX } from 'node_modules/@emotion/react/types/jsx-namespace';
import { ErrorBoundary } from 'react-error-boundary';

interface RoomCatchWrapperProps {
  children: React.ReactNode;
}

const fallbackRender = ({ error }) => {
  const ErrorComponent = exceptionComponentMap[error.message] || RoomDefaultError;
  return <ErrorComponent />;
};

const RoomCatchWrapper = ({ children }: RoomCatchWrapperProps) => {
  return <ErrorBoundary fallbackRender={fallbackRender}>{children}</ErrorBoundary>;
};

const exceptionComponentMap: Record<keyof typeof roomError, () => EmotionJSX.Element> = {
  RoomNotFound: RoomNotFoundError,
  RoomAlreadyEnter: RoomAlreadyEnter
};

export default RoomCatchWrapper;
