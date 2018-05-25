import withPrivates, { WithPrivatesHOC } from 'with-privates';
import { PublicProps, Privates, Setters, Getters } from './types';

export const WithPrivates: WithPrivatesHOC<PublicProps, Setters, Getters> = withPrivates<
    PublicProps,
    Privates,
    Setters,
    Getters
>(
    {
        frame: null,
    },
    {
        setFrame: (props, setValues) => (frame: HTMLIFrameElement) => setValues({ frame }),
    },
    {
        getFrame: (props, privates) => () => privates.frame,
    },
);
