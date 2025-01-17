const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");

module.exports = merge(common, {
  mode: "development",
  devtool: "inline-source-map",
  devServer: {
    static: "./dist",
    open: "/app/auth/",
    watchFiles: ["src/**/*"],
    historyApiFallback: {
      rewrites: [
        { from: /./, to: "app/not-found.html" },
        { from: /^\/$/, to: "app/dashboard/" },
      ],
    },
  },
});
