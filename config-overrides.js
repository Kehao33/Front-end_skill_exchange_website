const {
  override,
  fixBabelImports,
  addLessLoader,
  addBabelPlugin,
} = require('customize-cra')

module.exports = override(
  fixBabelImports('import', {
    libraryName: 'antd',
    libraryDirectory: 'es',
    style: true,
  }),
  addLessLoader({
    javascriptEnabled: true,
    modifyVars: {
      hack: `true;@import "${require.resolve(
        'antd/lib/style/color/colorPalette.less'
      )}";`,
      '@primary-color': '#1890ff',
    },
  }),
  addBabelPlugin(['@babel/plugin-proposal-decorators', { legacy: true }])
)
