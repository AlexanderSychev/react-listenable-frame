function pong(): void {
  window.parent.postMessage('pong', '*');
}

function onMessage(event: MessageEvent): void {
  if (event.data === 'ping') {
    console.log('ping');
    setTimeout(pong, 1500);
  }
}

function onLoad() {
  window.addEventListener('message', onMessage);
}

window.addEventListener('load', onLoad);
