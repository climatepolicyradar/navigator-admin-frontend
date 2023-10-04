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
exports.FamilyForm = void 0;
var react_1 = require("react");
var jsx_runtime_1 = require("react/jsx-runtime");
var react_2 = require("react");
var react_hook_form_1 = require("react-hook-form");
var yup_1 = require("@hookform/resolvers/yup");
var yup = require("yup");
var useConfig_1 = require("@/hooks/useConfig");
var react_3 = require("@chakra-ui/react");
var chakra_react_select_1 = require("chakra-react-select");
var useCollections_1 = require("@/hooks/useCollections");
var Loader_1 = require("../Loader");
var schema = yup
    .object({
    import_id: yup.string().required(),
    title: yup.string().required(),
    summary: yup.string().required(),
    geography: yup.string().required(),
    category: yup.string().required(),
    organisation: yup.string().required(),
    author: yup.string().when('organisation', {
        is: 'UNFCCC',
        then: function (schema) { return schema.required(); },
    }),
    author_type: yup.string().when('organisation', {
        is: 'UNFCCC',
        then: function (schema) { return schema.required(); },
    }),
    topic: yup.array().optional(),
    // hazard: yup.array().of(yup.string()),
    // sector: yup.array().of(yup.string()),
    // keyword: yup.array().of(yup.string()),
    // framework: yup.array().of(yup.string()),
    // instrument: yup.array().of(yup.string()),
})
    .required();
var generateOptions = function (values) {
    return (values === null || values === void 0 ? void 0 : values.map(function (value) { return ({ value: value, label: value }); })) || [];
};
var FamilyForm = function () {
    var _a = (0, useConfig_1.default)(), config = _a.config, configError = _a.error, configLoading = _a.loading;
    var _b = (0, useCollections_1.default)(), collections = _b.collections, collectionsError = _b.error, collectionsLoading = _b.loading;
    var toast = (0, react_3.useToast)();
    var _c = (0, react_2.useState)(), formError = _c[0], setFormError = _c[1];
    var _d = (0, react_hook_form_1.useForm)({
        resolver: (0, yup_1.yupResolver)(schema),
    }), register = _d.register, watch = _d.watch, handleSubmit = _d.handleSubmit, control = _d.control, _e = _d.formState, errors = _e.errors, isSubmitting = _e.isSubmitting;
    var watchOrganisation = watch('organisation');
    var handleFamilyCreate = function (family) {
        setFormError(null);
        console.log(family);
        // await createFamily(family)
        //   .then(() => {
        //     toast.closeAll()
        //     toast({
        //       title: 'Family has been successfully created',
        //       status: 'success',
        //       position: 'top',
        //     })
        //   })
        //   .catch((error: IError) => {
        //     setFormError(error)
        //     toast({
        //       title: 'Family has not been created',
        //       description: error.message,
        //       status: 'error',
        //       position: 'top',
        //     })
        //   })
    };
    var onSubmit = function (data) {
        return handleFamilyCreate(data);
    };
    var canLoadForm = !configLoading && !collectionsLoading && !configError && !collectionsError;
    var chakraStyles = {
        container: function (provided, _state) { return (__assign(__assign({}, provided), { background: 'white' })); },
    };
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(configLoading || collectionsLoading) && ((0, jsx_runtime_1.jsxs)(react_3.Box, { padding: "4", bg: "white", children: [(0, jsx_runtime_1.jsx)(Loader_1.Loader, {}), (0, jsx_runtime_1.jsx)(react_3.SkeletonText, { mt: "4", noOfLines: 12, spacing: "4", skeletonHeight: "2" })] })), configError && ((0, jsx_runtime_1.jsxs)(react_3.Box, { padding: "4", bg: "white", children: [(0, jsx_runtime_1.jsx)(react_3.Text, { color: 'red.500', children: configError.message }), (0, jsx_runtime_1.jsx)(react_3.Text, { fontSize: "xs", color: 'gray.500', children: configError.detail })] })), collectionsError && ((0, jsx_runtime_1.jsxs)(react_3.Box, { padding: "4", bg: "white", children: [(0, jsx_runtime_1.jsx)(react_3.Text, { color: 'red.500', children: collectionsError.message }), (0, jsx_runtime_1.jsx)(react_3.Text, { fontSize: "xs", color: 'gray.500', children: collectionsError.detail })] })), (configError || collectionsError) && ((0, jsx_runtime_1.jsxs)(react_3.Box, { padding: "4", bg: "white", children: [(0, jsx_runtime_1.jsx)(react_3.Text, { color: 'red.500', children: "Please create a collection first" }), (0, jsx_runtime_1.jsx)(react_3.Text, { fontSize: "xs", color: 'gray.500', children: "You can do this by clicking the button below" })] })), canLoadForm && ((0, jsx_runtime_1.jsxs)("form", { onSubmit: handleSubmit(onSubmit), children: [(0, jsx_runtime_1.jsxs)(react_3.VStack, { gap: "4", mb: 12, align: 'stretch', children: [formError && ((0, jsx_runtime_1.jsxs)(react_3.Box, { children: [(0, jsx_runtime_1.jsx)(react_3.Text, { color: 'red.500', children: formError.message }), (0, jsx_runtime_1.jsx)(react_3.Text, { fontSize: "xs", color: 'gray.500', children: formError.detail })] })), (0, jsx_runtime_1.jsxs)(react_3.FormControl, { isRequired: true, children: [(0, jsx_runtime_1.jsx)(react_3.FormLabel, { children: "Import ID" }), (0, jsx_runtime_1.jsx)(react_3.Input, __assign({ bg: "white" }, register('import_id'))), (0, jsx_runtime_1.jsx)(react_3.FormHelperText, { children: "Must be in the format of: a.b.c.d where each letter represents a word or number for example: CCLW.family.1234.5678" })] }), (0, jsx_runtime_1.jsxs)(react_3.FormControl, { isRequired: true, children: [(0, jsx_runtime_1.jsx)(react_3.FormLabel, { children: "Title" }), (0, jsx_runtime_1.jsx)(react_3.Input, __assign({ bg: "white" }, register('title')))] }), (0, jsx_runtime_1.jsxs)(react_3.FormControl, { isRequired: true, children: [(0, jsx_runtime_1.jsx)(react_3.FormLabel, { children: "Summary" }), (0, jsx_runtime_1.jsx)(react_3.Textarea, __assign({ height: '300px', bg: "white" }, register('summary')))] }), (0, jsx_runtime_1.jsx)(react_3.FormControl, { children: (0, jsx_runtime_1.jsx)(react_3.FormLabel, { children: "Collection" }) }), (0, jsx_runtime_1.jsx)(react_3.FormControl, { isRequired: true, children: (0, jsx_runtime_1.jsx)(react_3.FormLabel, { children: "Geography" }) }), (0, jsx_runtime_1.jsxs)(react_3.FormControl, { isRequired: true, as: "fieldset", isInvalid: !!errors.category, children: [(0, jsx_runtime_1.jsx)(react_3.FormLabel, { as: "legend", children: "Category" }), (0, jsx_runtime_1.jsx)(react_3.RadioGroup, { children: (0, jsx_runtime_1.jsxs)(react_3.HStack, { gap: 4, children: [(0, jsx_runtime_1.jsx)(react_3.Radio, __assign({ bg: "white", value: "Executive" }, register('category'), { children: "Executive" })), (0, jsx_runtime_1.jsx)(react_3.Radio, __assign({ bg: "white", value: "Legislative" }, register('category'), { children: "Legislative" })), (0, jsx_runtime_1.jsx)(react_3.Radio, __assign({ bg: "white", value: "Litigation" }, register('category'), { children: "Litigation" })), (0, jsx_runtime_1.jsx)(react_3.Radio, __assign({ bg: "white", value: "UNFCCC" }, register('category'), { children: "UNFCCC" }))] }) }), (0, jsx_runtime_1.jsx)(react_3.FormErrorMessage, { children: "Please select a category" })] }), (0, jsx_runtime_1.jsxs)(react_3.FormControl, { isRequired: true, as: "fieldset", isInvalid: !!errors.organisation, children: [(0, jsx_runtime_1.jsx)(react_3.FormLabel, { as: "legend", children: "Organisation" }), (0, jsx_runtime_1.jsx)(react_3.RadioGroup, { children: (0, jsx_runtime_1.jsxs)(react_3.HStack, { gap: 4, children: [(0, jsx_runtime_1.jsx)(react_3.Radio, __assign({ bg: "white", value: "CCLW" }, register('organisation'), { children: "CCLW" })), (0, jsx_runtime_1.jsx)(react_3.Radio, __assign({ bg: "white", value: "UNFCCC" }, register('organisation'), { children: "UNFCCC" }))] }) }), (0, jsx_runtime_1.jsx)(react_3.FormErrorMessage, { children: "Please select an organisation" })] }), !!watchOrganisation && ((0, jsx_runtime_1.jsxs)(react_3.Box, { position: "relative", padding: "10", children: [(0, jsx_runtime_1.jsx)(react_3.Divider, {}), (0, jsx_runtime_1.jsx)(react_3.AbsoluteCenter, { bg: "gray.50", px: "4", children: "Metadata" })] })), watchOrganisation === 'UNFCCC' && ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)(react_3.FormControl, { isRequired: true, children: [(0, jsx_runtime_1.jsx)(react_3.FormLabel, { children: "Author" }), (0, jsx_runtime_1.jsx)(react_3.Input, __assign({ bg: "white" }, register('author')))] }), (0, jsx_runtime_1.jsxs)(react_3.FormControl, { isRequired: true, as: "fieldset", isInvalid: !!errors.author_type, children: [(0, jsx_runtime_1.jsx)(react_3.FormLabel, { as: "legend", children: "Author type" }), (0, jsx_runtime_1.jsx)(react_3.RadioGroup, { children: (0, jsx_runtime_1.jsx)(react_3.HStack, { gap: 4, children: config === null || config === void 0 ? void 0 : config.taxonomies.UNFCCC.author_type.allowed_values.map(function (authorType) { return ((0, react_1.createElement)(react_3.Radio, __assign({ bg: "white", value: authorType }, register('author_type'), { key: authorType }), authorType)); }) }) }), (0, jsx_runtime_1.jsx)(react_3.FormErrorMessage, { children: "Please select an organisation" })] })] })), watchOrganisation === 'CCLW' && ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: (0, jsx_runtime_1.jsx)(react_hook_form_1.Controller, { control: control, name: "topic", render: function (_a) {
                                        var field = _a.field;
                                        return ((0, jsx_runtime_1.jsxs)(react_3.FormControl, { children: [(0, jsx_runtime_1.jsx)(react_3.FormLabel, { children: "Topics" }), (0, jsx_runtime_1.jsx)(chakra_react_select_1.Select, __assign({ chakraStyles: chakraStyles, isClearable: false, isMulti: true, isSearchable: true, options: generateOptions(config === null || config === void 0 ? void 0 : config.taxonomies.CCLW.topic.allowed_values) }, field))] }));
                                    } }) }))] }), (0, jsx_runtime_1.jsx)(react_3.ButtonGroup, { children: (0, jsx_runtime_1.jsx)(react_3.Button, { type: "submit", colorScheme: "blue", onSubmit: handleSubmit(onSubmit), disabled: isSubmitting, children: "Create new Family" }) })] }))] }));
};
exports.FamilyForm = FamilyForm;
