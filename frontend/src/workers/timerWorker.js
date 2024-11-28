let timerId = null;

self.onmessage = (e) => {
  const { action, interval } = e.data;

  if (action === 'start') {
    if (!timerId) {
      timerId = setInterval(() => {
        self.postMessage('tick'); // 메인 스레드로 메시지 전송
      }, interval);
    }
  } else if (action === 'stop') {
    if (timerId) {
      clearInterval(timerId);
      timerId = null;
    }
  }
};
