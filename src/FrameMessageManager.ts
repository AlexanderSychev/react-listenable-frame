import { isNil } from './utils';

/** Frame message listener */
export interface FrameMessageListener {
    (event: MessageEvent): any;
}

/** Frame message manager */
export class FrameMessageManager {
    /** Manager instance */
    protected static instance: FrameMessageManager;
    /** Frames map */
    private frameMap: Map<HTMLIFrameElement, Set<FrameMessageListener>>;
    /** Map of listeners execution contexts */
    private contextMap: Map<FrameMessageListener, any>;
    /** @constructor */
    protected constructor() {
        this.frameMap = new Map<HTMLIFrameElement, Set<FrameMessageListener>>();
        this.contextMap = new Map<FrameMessageListener, any>();
        this.onMessage_ = this.onMessage_.bind(this);
        window.addEventListener('message', this.onMessage_);
    }
    /** Get instance of manager (create if not exists) */
    public static getInstance(): FrameMessageManager {
        if (isNil(FrameMessageManager.instance)) {
            FrameMessageManager.instance = new FrameMessageManager();
        }
        return FrameMessageManager.instance;
    }
    /** Subscribe to frame's messages */
    public subscribe(element: HTMLIFrameElement, listener: FrameMessageListener, context?: any): void {
        if (!this.frameMap.has(element)) {
            this.frameMap.set(element, new Set<FrameMessageListener>());
        }
        const listeners: Set<FrameMessageListener> = this.frameMap.get(element)!;
        if (!listeners.has(listener)) {
            listeners.add(listener);
            if (!isNil(context)) {
                this.contextMap.set(listener, context);
            }
        }
    }
    /** Unsubscribe from frame's messages */
    public unsubscribe(element: HTMLIFrameElement, listener: FrameMessageListener): void {
        if (this.frameMap.has(element)) {
            const listeners: Set<FrameMessageListener> = this.frameMap.get(element)!;
            if (listeners.has(listener)) {
                listeners.delete(listener);
                if (this.contextMap.has(listener)) {
                    this.contextMap.delete(listener);
                }
            }
        }
    }
    /** Internal "message" event listener */
    private onMessage_(event: MessageEvent): void {
        this.frameMap.forEach((listeners: Set<FrameMessageListener>, key: HTMLIFrameElement) => {
            if (event.source === key.contentWindow) {
                listeners.forEach(
                    (listener: FrameMessageListener) =>
                        this.contextMap.has(listener)
                            ? listener.call(this.contextMap.get(listener), event)
                            : listener(event),
                );
            }
        });
    }
}
