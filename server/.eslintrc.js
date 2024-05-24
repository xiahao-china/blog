module.exports = {
    "env": {
        "browser": true,
        "es6": true,
        "node": true
    },
    "plugins": ['prettier'],
    "extends": ['eslint:recommended', 'prettier', 'prettier/prettier'],
    "globals": {
        "Atomics": "readonly",
        "SharedArrayBuffer": "readonly"
    },
    "parserOptions": {
        "ecmaVersion": 2018,
        "sourceType": "module"
    },
    "rules": {
        'prettier/prettier': 'warn'
    }
};