import { HTMLProps } from 'react';

export type Sender = (message: any, targetOrigin: string, transfer?: any[]) => void;

export interface PublicProps extends HTMLProps<HTMLIFrameElement> {
    onSenderReady?(sender: Sender): any;
    onMessage?(event: MessageEvent): any;
    onMessageContext?: any;
}

export interface Privates {
    frame: HTMLIFrameElement | null;
}

export interface Getters {
    getFrame(): HTMLIFrameElement;
}

export interface Setters {
    setFrame(frame: HTMLIFrameElement): void;
}

export type Props = PublicProps & Getters & Setters;
