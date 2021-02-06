import React, { useCallback, useRef, FC, MutableRefObject } from 'react';
import ReactDOM from 'react-dom';

import ReactListenableFrame, { ReactListenableFrameSender } from './react-listenable-frame';

const ShowCase: FC = () => {
  const sender: MutableRefObject<ReactListenableFrameSender | null> = useRef(null);

  const onMessage = useCallback((event: MessageEvent) => {
    if (event.data === 'pong') {
      console.log('pong');
    }
  }, []);

  const onPingClick = useCallback(() => {
    if (sender.current) {
      sender.current!('ping', '*');
    }
  }, []);

  return (
    <div className="app">
      <button onClick={onPingClick}>Send "ping" message to frame</button>
      <ReactListenableFrame src="/frame.html" onMessage={onMessage} senderRef={sender} />
    </div>
  );
};

ShowCase.displayName = `ShowCase`;

function onLoad() {
  const root = document.getElementById('root');
  if (root) {
    ReactDOM.render(<ShowCase />, root);
  }
}

window.addEventListener('load', onLoad);
