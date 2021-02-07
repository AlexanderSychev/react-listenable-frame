import React, { useRef, useCallback, useEffect } from 'react';

/**
 * Frame messages manager - listens global `"message"` event and call all attached listeners
 * for all attached source frames. Singletone class.
 */
class FrameMessagesManager {
    constructor() {
        this.onMessage = (event) => {
            for (let i = 0; i < this.listenersByFrames.length; i = i + 1) {
                const [frame, listener] = this.listenersByFrames[i];
                if (event.source === frame.contentWindow) {
                    listener(event);
                    break;
                }
            }
        };
        this.listenersByFrames = [];
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
    /**
     * Add `"message"` event listener for `<iframe>` element.
     * If other listener was already added, it will be replaced.
     */
    subscribe(frame, listener) {
        const index = this.listenersByFrames.findIndex(([item]) => item === frame);
        if (index === -1) {
            this.listenersByFrames.push([frame, listener]);
        }
        else {
            this.listenersByFrames[index][1] = listener;
        }
    }
    /** Remove `"message"` event listener from `<iframe>` element. */
    unsubscribe(frame) {
        this.listenersByFrames = this.listenersByFrames.filter(([item]) => item === frame);
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
    }, 
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []);
    useEffect(() => {
        let cleanUp;
        if (onMessage) {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            const currentFrame = frameRef.current;
            FrameMessagesManager.getInstance().subscribe(currentFrame, onMessage);
            cleanUp = () => FrameMessagesManager.getInstance().unsubscribe(currentFrame);
        }
        return cleanUp;
    }, [onMessage]);
    return (React.createElement("iframe", Object.assign({ ref: frameFuncRef }, rest), children));
};
ReactListenableFrame.displayName = 'ReactListenableFrame';

export default ReactListenableFrame;
