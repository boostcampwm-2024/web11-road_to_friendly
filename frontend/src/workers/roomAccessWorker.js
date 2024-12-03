const TIMEOUT = 3500;

let port = null;
let alive = false;

function clearPort() {
  port.onmessage = null;
  port.close();
  port = null;
}

function checkAliveSignal() {
  if (!port) return;

  alive = false;
  setTimeout(() => {
    if (!alive) {
      clearPort();
      return;
    }
    checkAliveSignal();
  }, TIMEOUT);
}

addEventListener('connect', (e) => {
  const newPort = e.ports[0];

  if (port !== null) {
    newPort.postMessage({ message: 'reject' });
    newPort.close();
    newPort.onmessage = null;
    return;
  }

  port = newPort;
  alive = true;
  port.postMessage({ message: 'accept' });

  checkAliveSignal();
  port.onmessage = (e) => {
    const { message } = e.data;

    if (message === 'alive') {
      alive = true;
      port.postMessage({ message: 'alive check' });
    }
    if (message === 'disconnect') {
      clearPort();
    }
  };
});
