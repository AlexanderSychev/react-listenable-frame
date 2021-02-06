(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('react')) :
    typeof define === 'function' && define.amd ? define(['react'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.ReactListenableFrame = factory(global.React));
}(this, (function (React) { 'use strict';

    function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

    var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */

    var __assign = function() {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };

    function __rest(s, e) {
        var t = {};
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
            t[p] = s[p];
        if (s != null && typeof Object.getOwnPropertySymbols === "function")
            for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
                if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                    t[p[i]] = s[p[i]];
            }
        return t;
    }

    /**
     * Frame messages manager - listens global `"message"` event and call all attached listeners
     * for all attached source frames. Singletone class.
     */
    var FrameMessagesManager = /** @class */ (function () {
        function FrameMessagesManager() {
            var _this = this;
            this.onMessage = function (event) {
                _this.listenersByFrames.forEach(function (listeners, frame) {
                    if (event.source === frame.contentWindow) {
                        listeners.forEach(function (listener) { return listener(event); });
                    }
                });
            };
            this.listenersByFrames = new Map();
            window.addEventListener('message', this.onMessage);
        }
        /**
         * Get instance of a `FrameMessagesManager`. Use lazy initialization - the first call
         * creates an instance of the `FrameMessagesManager`, and subsequent calls will return the already created
         * `FrameMessagesManager` instance.
         */
        FrameMessagesManager.getInstance = function () {
            if (!FrameMessagesManager.instance) {
                FrameMessagesManager.instance = new FrameMessagesManager();
            }
            return FrameMessagesManager.instance;
        };
        /** Add `"message"` event listener for `<iframe>` element. */
        FrameMessagesManager.prototype.subscribe = function (frame, listener) {
            if (!this.listenersByFrames.has(frame)) {
                this.listenersByFrames.set(frame, new Set());
            }
            this.listenersByFrames.get(frame).add(listener);
        };
        /** Remove `"message"` event listener from `<iframe>` element. */
        FrameMessagesManager.prototype.unsubscribe = function (frame, listener) {
            if (this.listenersByFrames.has(frame)) {
                this.listenersByFrames.get(frame).delete(listener);
            }
        };
        FrameMessagesManager.instance = null;
        return FrameMessagesManager;
    }());

    /**
     * `ReactListenableFrame` - wrapper for `iframe` element which provides listening of frame messages
     * and posting messages to this frame
     */
    var ReactListenableFrame = function (_a) {
        var onMessage = _a.onMessage, senderRef = _a.senderRef, children = _a.children, rest = __rest(_a, ["onMessage", "senderRef", "children"]);
        var _b = React.useState(null), currentFrame = _b[0], setCurrentFrame = _b[1];
        React.useEffect(function () {
            if (currentFrame && senderRef) {
                senderRef.current = function (message, targetOrigin, transfer) {
                    if (currentFrame.contentWindow) {
                        currentFrame.contentWindow.postMessage(message, targetOrigin, transfer);
                    }
                };
            }
        }, [currentFrame]);
        React.useEffect(function () {
            var cleanUp;
            if (currentFrame && onMessage) {
                FrameMessagesManager.getInstance().subscribe(currentFrame, onMessage);
                cleanUp = function () { return FrameMessagesManager.getInstance().unsubscribe(currentFrame, onMessage); };
            }
            return cleanUp;
        }, [currentFrame, onMessage]);
        return (React__default['default'].createElement("iframe", __assign({ ref: setCurrentFrame }, rest), children));
    };
    ReactListenableFrame.displayName = 'ReactListenableFrame';

    return ReactListenableFrame;

})));
