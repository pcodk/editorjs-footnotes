module.exports = {
  mode: "production",
  devtool: "inline-source-map",
  entry: {
    main: "./src/index.js",
  },
  output: {
    filename: "[name].js",
    path: __dirname + "/dist",
    library: "@jakekara/editorjs-footnotes",
    libraryTarget: "amd",
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
            plugins: ["@babel/plugin-proposal-object-rest-spread"],
          },
        },
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
};
