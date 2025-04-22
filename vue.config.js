const { defineConfig } = require('@vue/cli-service');

module.exports = defineConfig({
  transpileDependencies: true,
  css: { extract: false },
  configureWebpack: config => {
    if (process.env.VUE_CLI_BUILD_TARGET === 'lib') {
      // Remove code splitting for library builds
      config.optimization = {
        splitChunks: false
      };

      config.output = {
        ...config.output,
        filename: '[name].js',
        chunkFilename: '[name].js'
      };
    }
  }
});
