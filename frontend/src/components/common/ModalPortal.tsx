import { ReactNode } from 'react';
import ReactDOM from 'react-dom';

interface ModalPortalProps {
  children: ReactNode;
}

const ModalPortal = ({ children }: ModalPortalProps) => {
  const modalRoot = document.getElementById('modal') as HTMLElement;
  return ReactDOM.createPortal(children, modalRoot);
};

export default ModalPortal;
