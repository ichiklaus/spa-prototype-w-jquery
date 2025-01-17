const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  entry: {
    main: path.resolve(__dirname, "./src/app/main.js"),
  },
  output: {
    path: path.resolve(__dirname, "./dist"),
    filename: "app/app/[name].bundle.js",
    clean: true,
    // assetModuleFilename: "app/images/[name][ext]",
    // publicPath: "/app/",
  },
  resolve: {
    alias: {
      "@/components": path.resolve(__dirname, "./src/components"),
      "@/libs": path.resolve(__dirname, "./src/app/libs"),
      "@/helpers": path.resolve(__dirname, "./src/app/helpers"),
      "@/config": path.resolve(__dirname, "./src/app/config"),
      "@/db": path.resolve(__dirname, "./src/app/db"),
      "@/views": path.resolve(__dirname, "./src/app/views"),
      "@/assets": path.resolve(__dirname, "./src/assets"),
      "@/styles": path.resolve(__dirname, "./src/styles"),
    },
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: "asset/resource",
        generator: {
          filename: "app/images/[name][ext]",
        },
      },
      {
        test: /\.(mp4|webm|ogg|ogv)$/i,
        type: "asset/resource",
        generator: {
          filename: "app/videos/[name][ext]",
        },
      },
      {
        test: /\.(html)$/,
        use: ["html-loader"],
      },
      {
        test: /\.(scss)$/,
        use: ["style-loader", "css-loader", "postcss-loader", "sass-loader"],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: "Webpack setup",
      template: path.resolve(__dirname, "./src/pages/dashboard/index.html"),
      filename: "app/dashboard/index.html",
    }),
    new HtmlWebpackPlugin({
      title: "Webpack setup",
      template: path.resolve(__dirname, "./src/pages/auth/index.html"),
      filename: "app/auth/index.html",
    }),
    new HtmlWebpackPlugin({
      title: "Webpack setup",
      template: path.resolve(__dirname, "./src/not-found.html"),
      filename: "app/not-found.html",
    }),
    new CopyPlugin({
      patterns: [{ from: "./src/app/views/*", to: "./app/views", flatten: true }],
    }),
  ],
};
