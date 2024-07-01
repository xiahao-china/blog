const presets = [
  [
    '@babel/preset-env',
    {
      targets: {
        node: 'current'
      },
      useBuiltIns: 'usage',
      corejs: '3.6.4'
    }
  ],
  '@babel/preset-typescript'
]

const plugins = ['@babel/plugin-transform-optional-chaining'];

module.exports = { presets, plugins }
