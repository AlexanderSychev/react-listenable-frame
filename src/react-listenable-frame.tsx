import React, {
  useEffect,
  useRef,
  useCallback,
  DetailedHTMLProps,
  IframeHTMLAttributes,
  MutableRefObject,
  FC,
} from 'react';

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
  const frameRef: MutableRefObject<HTMLIFrameElement | null> = useRef(null);

  const frameFuncRef = useCallback(
    (frame: HTMLIFrameElement) => {
      frameRef.current = frame;
      if (onMessage) {
        FrameMessagesManager.getInstance().subscribe(frameRef.current, onMessage);
      }

      if (senderRef) {
        // eslint-disable-next-line no-param-reassign
        senderRef.current = (message, targetOrigin, transfer) => {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          if (frameRef.current!.contentWindow) {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            frameRef.current!.contentWindow.postMessage(message, targetOrigin, transfer);
          }
        };
      }
    },
    [frameRef, senderRef, onMessage],
  );

  useEffect(() => {
    return () => {
      if (frameRef.current && onMessage) {
        FrameMessagesManager.getInstance().unsubscribe(frameRef.current, onMessage);
      }
    };
  }, [frameRef, onMessage]);

  return (
    <iframe ref={frameFuncRef} {...rest}>
      {children}
    </iframe>
  );
};

ReactListenableFrame.displayName = 'ReactListenableFrame';

export default ReactListenableFrame;
