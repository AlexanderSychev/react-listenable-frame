import React, { useState, useEffect } from 'react';

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
    const [currentFrame, setCurrentFrame] = useState(null);
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
        let cleanUp;
        if (currentFrame && onMessage) {
            FrameMessagesManager.getInstance().subscribe(currentFrame, onMessage);
            cleanUp = () => FrameMessagesManager.getInstance().unsubscribe(currentFrame, onMessage);
        }
        return cleanUp;
    }, [currentFrame, onMessage]);
    return (React.createElement("iframe", Object.assign({ ref: setCurrentFrame }, rest), children));
};
ReactListenableFrame.displayName = 'ReactListenableFrame';

export default ReactListenableFrame;
