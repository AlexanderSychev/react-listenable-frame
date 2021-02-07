# react-listenable-frame

React component - wrapper for standard `<iframe>` component which provides listening of frame messages and posting messages to this frame.

## Installaction

By NPM:
```bash
npm install react-listenable-frame --save
```

Or by Yarn:
```bash
yarn add react-listenable-frame
```

## Usage

### Quick example

Connecting a frame that announces its readiness and exchanges ping messages with the parent window:

#### Component code:

```jsx
import React, { useRef, useCallback, useState } from 'react';
import ReactListenableFrame from 'react-listenable-frame';

const MyComponent = () => {
    const senderRef = useRef(null);
    const [ready, setReady] = useState(false);

    const onMessage = useCallback((event) => {
        if (event.data === 'ready') {
            setReady(true);
        } else if (event.data === 'pong') {
            alert('Frame received "ping" message');
        }
    }, [setReady]);

    const onPingClick = useCallback(() => {
        if (senderRef.current) {
            senderRef.current('ping', '*');
        }
    }, []);

    return (
        <div>
            <h1>Listenable frame</h1>
            <ReactListenableFrame
                title="MyFrame"
                src="/my-frame.html"
                senderRef={senderRef}
                onMessage={onMessage}
            />
            <button disabled={!ready} onClick={onPingClick}>
                Ping listenable frame 
            </button>
        </div>
    );
};

export default MyComponent;
```

#### Frame code

```js
window.addEventListener('load', () => {
    window.addEventListener('message', (event) => {
        if (event.data === 'ping') {
            window.parent.postMessage('pong', '*');
        }
    });
    window.parent.postMessage('ready', '*');
});
```

### Component properties

* `senderRef` - mutable React Ref object (result of [`useRef`](https://reactjs.org/docs/hooks-reference.html#useref) hook). The `current` property will be a wrapper function for [`postMessage`](https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage) method of frame element. This is the one way to send messages to the created frame;
* `onMessage` - callback function for ["message"](https://developer.mozilla.org/en-US/docs/Web/API/Window/message_event) which calls **only for created frame element**;

> **The rest of the properties are equivalent to those of the `<iframe>` component.**

### Component showcase

You can explore [a sample application](https://github.com/AlexanderSychev/react-listenable-frame-showcase) that demonstrates the capabilities of this package.

## Package bundles

The package is available in three bundles:

* CommonJS module (for `Node.JS` or `browserify`);
* ES6 module (for `webpack`, `rollup` or modern `Node.JS` versions);
* Transpiled and minified browser bundle (For use in the browser and, in the future, on the CDN);

### CommonJS module

By default, `Node.JS` (and `browserify`) will use CommonJS module.

This code:

```javascript
const ReactListenableFrame = require('react-listenable-frame');
```

is equivalent to:

```javascript
const ReactListenableFrame = require('react-listenable-frame/lib/react-listenable-frame.js');
```

### ES6 Module

You can use ES6 Module.

For `rollup` and `webpack` this record:

```javascript
import ReactListenableFrame from 'react-listenable-frame';
```

is equivalent to:

```javascript
import ReactListenableFrame from 'react-listenable-frame/lib/react-listenable-frame.mjs';
```

### Browser bundle

The package is still not presented on CDN servers, but you can take a ready-made bundle for the browser:

```
<your-project-dir>/node_modules/react-listenable-frame/lib/react-listenable-frame.min.js
```

And the source map, if you want:

```
<your-project-dir>/node_modules/react-listenable-frame/lib/react-listenable-frame.min.js.map
```

Compoment will be available as `ReactListenableFrame` global variable.
