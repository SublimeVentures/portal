module.exports = {
    env: {
        browser: true,
        es2021: true,
        jest: true,
        node: true,
    },
    globals: {
        document: true,
    },
    extends: [
        "next/core-web-vitals",
        "eslint:recommended",
        "plugin:@next/next/recommended",
        "plugin:react/recommended",
        "plugin:react-hooks/recommended",
        "plugin:jsx-a11y/recommended",
        "plugin:import/recommended",
        "plugin:prettier/recommended",
        "eslint-config-prettier",
    ],
    parser: "@babel/eslint-parser",
    parserOptions: {
        ecmaVersion: 2021,
        ecmaFeatures: {
            jsx: true,
        },
        requireConfigFile: false,
        babelOptions: {
            presets: ["@babel/preset-env", "@babel/preset-react"],
        },
    },
    plugins: ["react", "react-hooks", "prettier", "jsx-a11y"],
    rules: {
        "@next/next/no-img-element": "warn",
        "react/react-in-jsx-scope": "off",
        "react-hooks/rules-of-hooks": "warn",
        "react-hooks/exhaustive-deps": "warn",
        "react/no-unescaped-entities": "warn",
        "import/order": "warn",
        "jsx-a11y/alt-text": "warn",
    },
    settings: {
        react: {
            version: "detect",
        },
        "import/resolver": {
            alias: [["@", "./src"]],
        },
    },
};
