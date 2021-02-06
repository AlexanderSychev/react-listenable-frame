/** `"message"` event listener function. Receives `"message"` event object as first argument */
export interface FrameMessageListener {
  (event: MessageEvent): unknown;
}

/**
 * Frame messages manager - listens global `"message"` event and call all attached listeners
 * for all attached source frames. Singletone class.
 */
export default class FrameMessagesManager {
  private static instance: FrameMessagesManager | null = null;

  /**
   * Get instance of a `FrameMessagesManager`. Use lazy initialization - the first call
   * creates an instance of the `FrameMessagesManager`, and subsequent calls will return the already created
   * `FrameMessagesManager` instance.
   */
  public static getInstance(): FrameMessagesManager {
    if (!FrameMessagesManager.instance) {
      FrameMessagesManager.instance = new FrameMessagesManager();
    }
    return FrameMessagesManager.instance;
  }

  /**
   * `"message"` event listeners map where key is `<iframe>` element and
   * value is `Set` of unique listener functions.
   */
  private listenersByFrames: Map<HTMLIFrameElement, Set<FrameMessageListener>>;

  private constructor() {
    this.listenersByFrames = new Map<HTMLIFrameElement, Set<FrameMessageListener>>();
    window.addEventListener('message', this.onMessage);
  }

  /** Add `"message"` event listener for `<iframe>` element. */
  public subscribe(frame: HTMLIFrameElement, listener: FrameMessageListener): void {
    if (!this.listenersByFrames.has(frame)) {
      this.listenersByFrames.set(frame, new Set<FrameMessageListener>());
    }
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    this.listenersByFrames.get(frame)!.add(listener);
  }

  /** Remove `"message"` event listener from `<iframe>` element. */
  public unsubscribe(frame: HTMLIFrameElement, listener: FrameMessageListener): void {
    if (this.listenersByFrames.has(frame)) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      this.listenersByFrames.get(frame)!.delete(listener);
    }
  }

  private onMessage = (event: MessageEvent) => {
    this.listenersByFrames.forEach((listeners, frame) => {
      if (event.source === frame.contentWindow) {
        listeners.forEach((listener) => listener(event));
      }
    });
  };
}
