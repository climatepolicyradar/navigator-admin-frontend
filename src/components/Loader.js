"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Loader = void 0;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("@chakra-ui/react");
function Loader() {
    return ((0, jsx_runtime_1.jsx)(react_1.Center, { h: '10vh', children: (0, jsx_runtime_1.jsx)(react_1.Spinner, {}) }));
}
exports.Loader = Loader;
