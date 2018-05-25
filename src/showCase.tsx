import * as React from 'react';
import * as ReactDOM from 'react-dom';
import ListenableIFrame, { ListenableIFrameSender } from './index';

/** Ping pong showcase component */
class PingPong extends React.Component {
    /** Sender instance */
    private sender: ListenableIFrameSender | null = null;
    /** @constructor */
    public constructor(props: any, context?: any) {
        super(props, context);
        this.onMessage = this.onMessage.bind(this);
        this.onSenderReady = this.onSenderReady.bind(this);
        this.ping = this.ping.bind(this);
    }
    /** @override */
    public render() {
        return (
            <ListenableIFrame
                onMessage={this.onMessage}
                onSenderReady={this.onSenderReady}
                src="./show-case-frame.html"
            />
        );
    }
    /** Frame message handler */
    protected onMessage(event: MessageEvent): void {
        if (event.data === 'pong') {
            console.log('pong');
            setTimeout(this.ping, 500);
        }
    }
    /** Sender ready handler */
    protected onSenderReady(sender: ListenableIFrameSender): void {
        this.sender = sender;
        setTimeout(this.ping, 500);
    }
    /** Ping frame */
    protected ping() {
        this.sender!('ping', '*');
    }
}

function onLoad() {
    const root = document.getElementById('root');
    ReactDOM.render(<PingPong />, root);
}

window.addEventListener('load', onLoad);
