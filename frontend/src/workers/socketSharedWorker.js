// importScripts('https://cdn.socket.io/4.8.1/socket.io.min.js');
import { io } from 'socket.io-client';

let socket = null;
let port = null;

console.log('보이나');

function handleConnect(data) {
  if (socket) return;

  const { url } = data;
  socket = io(url);
  socket.on('connect', () => {
    port.postMessage({ message: 'connected', data: { id: socket.id } });
  });
}

function handleDisConnect() {
  port = null;
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}

function handleEmitFromClient(data) {
  const { eventName, body, callbackId } = data;

  if (!callbackId) socket.emit(eventName, body);
  else {
    socket.emit(eventName, body, (res) => {
      port.postMessage({ message: 'response', data: { callbackId, res } });
    });
  }
}

function handleOnFromClient(data) {
  const { eventName } = data;

  socket.on(eventName, (body) => {
    port.postMessage({ message: 'emit', data: { eventName, body } });
  });
}

function handleOffFromClient(data) {
  const { eventName } = data;

  socket.off(eventName, (body) => {
    port.postMessage({ message: 'emit', data: { eventName, body } });
  });
}

function handleClientSocketMessage({ message, data }) {
  if (message === 'connect') handleConnect(data);
  else if (message === 'disconnect') handleDisConnect();
  else if (message === 'emit') handleEmitFromClient(data);
  else if (message === 'on') handleOnFromClient(data);
  else if (message === 'off') handleOffFromClient(data);
}

addEventListener('connect', (e) => {
  const newPort = e.ports[0];
  newPort.start();

  if (port !== null) {
    newPort.postMessage({ message: 'reject' });
    return;
  }
  port = newPort;

  port.onmessage = (e) => {
    const { message, data } = e.data;
    handleClientSocketMessage({ message, data });
  };

  port.onclose = (e) => {
    handleDisConnect();
  };
});
