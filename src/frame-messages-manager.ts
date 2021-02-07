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
   * `"message"` event listeners map where key is `<iframe>` element and value is listener function.
   */
  private listenersByFrames: [HTMLIFrameElement, FrameMessageListener][];

  private constructor() {
    this.listenersByFrames = [];
    window.addEventListener('message', this.onMessage);
  }

  /**
   * Add `"message"` event listener for `<iframe>` element.
   * If other listener was already added, it will be replaced.
   */
  public subscribe(frame: HTMLIFrameElement, listener: FrameMessageListener): void {
    const index = this.listenersByFrames.findIndex(([item]) => item === frame);

    if (index === -1) {
      this.listenersByFrames.push([frame, listener]);
    } else {
      this.listenersByFrames[index][1] = listener;
    }
  }

  /** Remove `"message"` event listener from `<iframe>` element. */
  public unsubscribe(frame: HTMLIFrameElement): void {
    this.listenersByFrames = this.listenersByFrames.filter(([item]) => item === frame);
  }

  private onMessage = (event: MessageEvent) => {
    for (let i = 0; i < this.listenersByFrames.length; i = i + 1) {
      const [frame, listener] = this.listenersByFrames[i];
      if (event.source === frame.contentWindow) {
        listener(event);
        break;
      }
    }
  };
}
