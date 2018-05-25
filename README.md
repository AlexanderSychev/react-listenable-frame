# with-privates

High-Order Component (HOC) which provides private variables with
setters and getters. Private variables changing not will fire re-rendering process.

## Installation

Package requires React 16.0.26 and higher as peer dependency.

```bash
# by Yarn
yarn add react with-privates --save
# by NPM
npm install react with-privates --save
```

## Usage

```typescript jsx
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import withPrivates, { WithPrivatesHOC } from 'with-privates';

interface Privates {
    foo: string;
    bar: string;
}

interface BaseProps {
    foo: string;
    test: string;
}

interface Getters {
    getFoo(): string;
    getBar(): string;
}

interface Setters {
    setFoo(foo: string): void;
    setBar(bar: string): void;
}

type Props = BaseProps & Getters & Setters;

const SomeFunctionalComponent: React.StatelessComponent<Props> = ({
    getFoo,
    getBar,
    setFoo,
    setBar,
    test,
    foo,
}: Props) => (
    <fieldset>
        <legend>Component "SomeFunctionalComponent"</legend>
        <fieldset>
            <legend>PRIVATE VARIABLES EDITOR</legend>
            <label>foo:</label>
            <input type="text" onChange={event => setFoo(event.target.value)} />
            <br />
            <label>bar:</label>
            <input type="text" onChange={event => setBar(event.target.value)} />
        </fieldset>
        <fieldset>
            <legend>EXTERNAL PROPS:</legend>
            <div>
                <span>test:</span>
                &nbsp;
                <span>{test}</span>
            </div>
            <div>
                <span>foo:</span>
                &nbsp;
                <span>{foo}</span>
            </div>
        </fieldset>
        <button
            type="button"
            onClick={() => {
                alert(`foo = ${getFoo()}\nbar = ${getBar()}`);
            }}
        >
            SHOW PRIVATE VARIABLES
        </button>
    </fieldset>
);

// Note that "withPrivates" is factory function which creates
// HOC by settled initial private fields, setters and getters
const SomeFunctionalComponentEnhancer: WithPrivatesHOC<BaseProps, Setters, Getters> = withPrivates<
    BaseProps,
    Privates,
    Setters,
    Getters
>(
    props => ({
        foo: props.foo,
        bar: 'bar',
    }),
    {
        setFoo: (props, setValues) => foo => setValues({ foo }),
        setBar: (props, setValues) => bar => setValues({ bar }),
    },
    {
        getFoo: (props, privates) => () => privates.foo,
        getBar: (props, privates) => () => privates.bar,
    },
);

// Component, enhanced by created HOC
const EnhancedSomeFunctionalComponents = SomeFunctionalComponentEnhancer(SomeFunctionalComponent);

interface ShowCaseState {
    foo: string;
    test: string;
}

class ShowCase extends React.Component<{}, ShowCaseState> {
    public constructor(props: {}, context: any) {
        super(props, context);
        this.state = {
            foo: 'foo',
            test: 'test',
        };
    }
    public render() {
        return (
            <fieldset>
                <legend>"with-privates" package showcase</legend>
                <fieldset>
                    <legend>State editor</legend>
                    <label>foo:</label>
                    <input
                        type="text"
                        value={this.state.foo}
                        onChange={event => this.setState({ foo: event.target.value })}
                    />
                    <br />
                    <label>test:</label>
                    <input
                        type="text"
                        value={this.state.test}
                        onChange={event => this.setState({ test: event.target.value })}
                    />
                </fieldset>
                <hr />
                <EnhancedSomeFunctionalComponents foo={this.state.foo} test={this.state.test} />
            </fieldset>
        );
    }
}

function onLoad() {
    const root = document.getElementById('root');
    ReactDOM.render(<ShowCase />, root);
}

window.addEventListener('load', onLoad);
```

## Bundling with Webpack

You can use one of browser bundles of this package:
* `with-privates/dist/with-privates.dev.js` - uncompressed library (for development);
* `with-privates/dist/with-privates.prod.js` - compressed library (for production).

Both libraries provides "withPrivates" function as global variable.

In Webpack configuration file add to externals:

```javascript
module.exports = {
    // ...
    // Your configuration
    // ...
    externals: {
        // Note that "React" and "ReactDOM" externals
        // are REQUIRED for browser bundles
        'react': 'React',
        'react-dom': 'ReactDOM',
        './withPrivates': 'withPrivates',
    }
};
```

At your page:
```html
<script crossorigin src="https://unpkg.com/react@16/umd/react.development.js"></script>
<script crossorigin src="https://unpkg.com/react-dom@16/umd/react-dom.development.js"></script>
<script src="node_modules/with-privates/dist/with-privates.dev.js"></script>
<script src="path/to/your/bundle"></script>
```
