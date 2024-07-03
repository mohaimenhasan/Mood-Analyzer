const { override, addWebpackResolve } = require('customize-cra');

module.exports = override(
  addWebpackResolve({
    fallback: {
      "util": require.resolve("util/"),
      "stream": require.resolve("stream-browserify")
    }
  })
);
