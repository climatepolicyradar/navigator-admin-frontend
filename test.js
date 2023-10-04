"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var client_1 = require("react-dom/client");
var react_2 = require("@chakra-ui/react");
var chakra_react_select_1 = require("chakra-react-select");
var rootElement = document.getElementById("root");
var root = (0, client_1.createRoot)(rootElement);
var flavorOptions = [
    {
        value: "coffee",
        label: "Coffee",
    },
    {
        value: "chocolate",
        label: "Chocolate",
    },
    {
        value: "strawberry",
        label: "Strawberry",
    },
    {
        value: "cherry",
        label: "Cherry",
    },
];
var chakraStyles = {
    container: function (provided, _state) { return (__assign(__assign({}, provided), { background: 'lightblue' })); },
};
root.render((0, jsx_runtime_1.jsx)(react_1.StrictMode, { children: (0, jsx_runtime_1.jsx)(react_2.ChakraProvider, { children: (0, jsx_runtime_1.jsx)(chakra_react_select_1.Select, { chakraStyles: chakraStyles, isClearable: false, isMulti: true, isSearchable: true, options: flavorOptions }) }) }));
