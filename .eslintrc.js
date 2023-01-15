module.exports = {
    env: {
        browser: true,
        es2021: true,
        node: true,
    },
    plugins: ['import', 'react', '@typescript-eslint', 'simple-import-sort'],
    extends: [
        'airbnb',
        'eslint:recommended',
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:prettier/recommended',
        'plugin:react/recommended',
        'plugin:import/errors',
        'plugin:import/warnings',
        'plugin:import/typescript',
    ],
    settings: {
        'import/resolver': {
            node: {
                extensions: ['.js', '.jsx', '.ts', '.tsx', '.d.ts'],
                project: ['./tsconfig.json'],
                // paths: ['./node_modules', './src/*', './pages/*', './utils/*', './prisma/*'],
            },
            webpack: {},
            typescript: {
                project: ['./tsconfig.json'],
                // paths: ['./node_modules', './src/*', './pages/*', './utils/*', './prisma/*'],
            },
        },
        'import/parsers': {
            '@typescript-eslint/parser': ['.ts', '.tsx', '.d.ts'],
        },
    },
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaFeatures: {
            jsx: true,
        },
        ecmaVersion: 'latest',
        sourceType: 'module',
    },
    rules: {
        indent: ['warn', 4],
        'import/extensions': [
            'error',
            {
                '.js|.ts': 'never',
            },
        ],
        'simple-import-sort/imports': [
            'error',
            {
                groups: [
                    // Packages `react` related packages come first.
                    ['^react', '^@?\\w'],
                    // Packages `next` related packages come first.
                    ['^next', '^@?\\w'],
                    // Components
                    ['^@components', '^(/.*|$)'],
                    // Styles
                    ['^@styles', '^(/.*|$)'],
                    // Public Assets
                    ['^@public', '^(/.*|$)'],
                    // Services
                    ['^@services', '^(/.*|$)'],
                    // State
                    ['^@state', '^(/.*|$)'],
                    // Utils
                    ['^(@utils|@fe-utils)', '^(/.*|$)'],
                    // Side effect imports.
                    ['^\\u0000'],
                    // Parent imports. Put `..` last.
                    ['^\\.\\.(?!/?$)', '^\\.\\./?$'],
                    // Other relative imports. Put same-folder imports and `.` last.
                    ['^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'],
                ],
            },
        ],
        'simple-import-sort/exports': 'error',
        'import/first': 'error',
        'import/newline-after-import': 'error',
        'import/no-duplicates': 'error',
        'no-underscore-dangle': 'off',
        'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx', '.ts', '.tsx'] }],
        'react/function-component-definition': 'off',
        'react/jsx-props-no-spreading': 'off',
        'react/react-in-jsx-scope': 'off',
        'react/destructuring-assignment': 'off',
        'react/require-default-props': 'off',
        'import/no-unresolved': 'off',
    },
};
