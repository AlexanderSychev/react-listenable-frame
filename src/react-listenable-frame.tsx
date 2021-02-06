import React, { useState, useEffect, DetailedHTMLProps, IframeHTMLAttributes, MutableRefObject, FC } from 'react';

import FrameMessagesManager from './frame-messages-manager';

/**
 * `ReactListenableFrame` - function which allows to post messages to created `iframe` element.
 * The signature is similar to the `postMessage` method of the `Window` interface.
 * Can be used to send messages to created frame.
 */
export interface ReactListenableFrameSender {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (message: any, targetOrigin: string, transfer?: Transferable[]): void;
}

/** `ReactListenableFrame` component properties */
export interface ReactListenableFrameProps
  extends DetailedHTMLProps<IframeHTMLAttributes<HTMLIFrameElement>, HTMLIFrameElement> {
  /**
   * Mutable React Ref for sender - function that passes `ReactListenableFrameSender` instance as the first argument.
   * This ref object can be used to post messages to frame
   */
  senderRef?: MutableRefObject<ReactListenableFrameSender | null | undefined>;
  /** Incoming frame message event listener */
  onMessage?(event: MessageEvent): unknown;
}

/**
 * `ReactListenableFrame` - wrapper for `iframe` element which provides listening of frame messages
 * and posting messages to this frame
 */
const ReactListenableFrame: FC<ReactListenableFrameProps> = ({ onMessage, senderRef, children, ...rest }) => {
  const [currentFrame, setCurrentFrame] = useState<HTMLIFrameElement | null>(null);

  useEffect(() => {
    if (currentFrame && senderRef) {
      // eslint-disable-next-line no-param-reassign
      senderRef.current = (message, targetOrigin, transfer) => {
        if (currentFrame.contentWindow) {
          currentFrame.contentWindow.postMessage(message, targetOrigin, transfer);
        }
      };
    }
  }, [currentFrame, senderRef]);

  useEffect(() => {
    let cleanUp: (() => void) | undefined;

    if (currentFrame && onMessage) {
      FrameMessagesManager.getInstance().subscribe(currentFrame, onMessage);
      cleanUp = () => FrameMessagesManager.getInstance().unsubscribe(currentFrame, onMessage);
    }

    return cleanUp;
  }, [currentFrame, onMessage]);

  return (
    <iframe ref={setCurrentFrame} {...rest}>
      {children}
    </iframe>
  );
};

ReactListenableFrame.displayName = 'ReactListenableFrame';

export default ReactListenableFrame;
