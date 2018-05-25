import { lifecycle, InferableComponentEnhancer } from 'recompose';
import { Props } from './types';
import { FrameMessageManager } from './FrameMessageManager';
import { isNil } from './utils';

export const Lifecycle: InferableComponentEnhancer<{}> = lifecycle<Props, {}>({
    componentDidMount() {
        const frame = this.props.getFrame();
        if (!isNil(this.props.onMessage)) {
            FrameMessageManager.getInstance().subscribe(frame, this.props.onMessage, this.props.onMessageContext);
        }
        if (!isNil(this.props.onSenderReady)) {
            this.props.onSenderReady((message: any, targetOrigin: string, transfer?: any[]) => {
                frame.contentWindow!.postMessage(message, targetOrigin, transfer);
            });
        }
    },
    componentWillUnmount() {
        if (!isNil(this.props.onMessage)) {
            FrameMessageManager.getInstance().unsubscribe(this.props.getFrame(), this.props.onMessage);
        }
    },
});
