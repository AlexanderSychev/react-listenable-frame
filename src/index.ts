import { compose } from 'recompose';
import { ComponentType } from 'react';
import { Component } from './component';
import { Lifecycle } from './lifecycle';
import { WithPrivates } from './withPrivates';
import { PublicProps, Props, Sender } from './types';

const ListenableIFrame: ComponentType<PublicProps> = compose<Props, PublicProps>(WithPrivates, Lifecycle)(Component);

export { Sender as ListenableIFrameSender, PublicProps as ListenableIFrameProps };
export default ListenableIFrame;

// Global declarations
declare global {
    interface Window {
        ListenableIFrame: ComponentType<PublicProps>;
    }
    const ListenableIFrame: ComponentType<PublicProps>;
}
