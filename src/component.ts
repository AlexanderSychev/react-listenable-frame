import * as React from 'react';
import { omit } from './utils';
import { Props } from './types';

type OmitProps = 'onMessage' | 'ref' | 'getFrame' | 'setFrame' | 'onSenderReady';

export const Component: React.StatelessComponent = (props: Props) =>
    React.createElement('iframe', {
        ...omit<Props, OmitProps>(props, ['onMessage', 'ref', 'getFrame', 'setFrame', 'onSenderReady']),
        ref: props.setFrame,
    });
