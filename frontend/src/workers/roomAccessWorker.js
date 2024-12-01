const TIMEOUT = 2500;

let port = null;
let alive = false;

function clearPort() {
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
    }
  };
});
