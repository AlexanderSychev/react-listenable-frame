import React, { useCallback, useRef, FC, MutableRefObject } from 'react';
import ReactDOM from 'react-dom';

import ReactListenableFrame, { ReactListenableFrameSender } from './react-listenable-frame';

const ShowCase: FC = () => {
  const sender: MutableRefObject<ReactListenableFrameSender | null> = useRef(null);

  const onMessage = useCallback((event: MessageEvent) => {
    if (event.data === 'pong') {
      console.info('pong');
    }
  }, []);

  const onPingClick = useCallback(() => {
    if (sender.current) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      sender.current!('ping', '*');
    }
  }, []);

  return (
    <div className="app">
      <button type="submit" onClick={onPingClick}>
        Send &quot;ping&quot; message to frame
      </button>
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
