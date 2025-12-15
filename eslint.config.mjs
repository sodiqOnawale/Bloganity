import js from "@eslint/js";
import tsParser from "@typescript-eslint/parser";
import globals from "globals";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default [
    {
        ignores: ["**/node_modules/**", "**/build/**", "**/public/**", "**/*.config.js"]
    },
    ...compat.extends(
        "eslint:recommended",
        "plugin:react/recommended",
        "plugin:react-hooks/recommended",
        "plugin:@typescript-eslint/recommended"
    ),
    {
        files: ["**/*.{js,jsx,ts,tsx}"],
        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.node,
                ...globals.jest,
            },
            parser: tsParser,
            ecmaVersion: "latest",
            sourceType: "module",
            parserOptions: {
                ecmaFeatures: {
                    jsx: true,
                },
            },
        },
        settings: {
            react: {
                version: "detect",
            },
        },
        rules: {
            "react/react-in-jsx-scope": "off",
            "react/prop-types": "off",
            "@typescript-eslint/explicit-module-boundary-types": "off",
            "react-hooks/set-state-in-effect": "off",
            "indent": [
                "error",
                2,
                {
                    "SwitchCase": 1,
                    "VariableDeclarator": 1,
                    "outerIIFEBody": 1,
                    "MemberExpression": 1,
                    "FunctionDeclaration": {
                        "parameters": 1,
                        "body": 1
                    },
                    "FunctionExpression": {
                        "parameters": 1,
                        "body": 1
                    },
                    "CallExpression": {
                        "arguments": 1
                    },
                    "ArrayExpression": 1,
                    "ObjectExpression": 1,
                    "ImportDeclaration": 1,
                    "flatTernaryExpressions": false,
                    "ignoreComments": false
                }
            ],
            "@typescript-eslint/no-unused-expressions": [
                "error",
                {
                    allowShortCircuit: true,
                    allowTernary: true,
                    allowTaggedTemplates: true,
                },
            ],
        },
    },
];