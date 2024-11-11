export type ToastType = 'check' | 'error';

export type Position = {
  bottom?: string;
  left?: string;
};

export interface ToastProps {
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  text: string;
  duration?: number;
  position?: Position;
}

export interface ToastOption extends Omit<ToastProps, 'icon'> {
  icon?: React.FC<React.SVGProps<SVGSVGElement>>;
  type?: ToastType;
}
