export interface SocketWithWorker {
  socketWorker: SharedWorker;
  id: string | null;
  connected: boolean;
  on: (eventName: string, callback: Function) => void;
  off: (eventName: string, callback?: Function) => void;
  emit: (eventName: string, body?: any) => void;
}
