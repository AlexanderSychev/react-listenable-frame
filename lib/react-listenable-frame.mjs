import React, { useRef, useCallback, useEffect } from 'react';

/**
 * Frame messages manager - listens global `"message"` event and call all attached listeners
 * for all attached source frames. Singletone class.
 */
class FrameMessagesManager {
    constructor() {
        this.onMessage = (event) => {
            this.listenersByFrames.forEach((listeners, frame) => {
                if (event.source === frame.contentWindow) {
                    listeners.forEach((listener) => listener(event));
                }
            });
        };
        this.listenersByFrames = new Map();
        window.addEventListener('message', this.onMessage);
    }
    /**
     * Get instance of a `FrameMessagesManager`. Use lazy initialization - the first call
     * creates an instance of the `FrameMessagesManager`, and subsequent calls will return the already created
     * `FrameMessagesManager` instance.
     */
    static getInstance() {
        if (!FrameMessagesManager.instance) {
            FrameMessagesManager.instance = new FrameMessagesManager();
        }
        return FrameMessagesManager.instance;
    }
    /** Add `"message"` event listener for `<iframe>` element. */
    subscribe(frame, listener) {
        if (!this.listenersByFrames.has(frame)) {
            this.listenersByFrames.set(frame, new Set());
        }
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        this.listenersByFrames.get(frame).add(listener);
    }
    /** Remove `"message"` event listener from `<iframe>` element. */
    unsubscribe(frame, listener) {
        if (this.listenersByFrames.has(frame)) {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            this.listenersByFrames.get(frame).delete(listener);
        }
    }
}
FrameMessagesManager.instance = null;

/**
 * `ReactListenableFrame` - wrapper for `iframe` element which provides listening of frame messages
 * and posting messages to this frame
 */
const ReactListenableFrame = ({ onMessage, senderRef, children, ...rest }) => {
    const frameRef = useRef(null);
    const frameFuncRef = useCallback((frame) => {
        frameRef.current = frame;
        if (onMessage) {
            FrameMessagesManager.getInstance().subscribe(frameRef.current, onMessage);
        }
        if (senderRef) {
            // eslint-disable-next-line no-param-reassign
            senderRef.current = (message, targetOrigin, transfer) => {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                if (frameRef.current.contentWindow) {
                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                    frameRef.current.contentWindow.postMessage(message, targetOrigin, transfer);
                }
            };
        }
    }, [frameRef, senderRef, onMessage]);
    useEffect(() => {
        return () => {
            if (frameRef.current && onMessage) {
                FrameMessagesManager.getInstance().unsubscribe(frameRef.current, onMessage);
            }
        };
    }, [frameRef, onMessage]);
    return (React.createElement("iframe", Object.assign({ ref: frameFuncRef }, rest), children));
};
ReactListenableFrame.displayName = 'ReactListenableFrame';

export default ReactListenableFrame;
