module.exports = {
  lintOnSave: false,
  devServer: {
    host: "localhost", // 设置启动项目网址
    port: 8000, // 设置启动项目端口号
    https: false, // 是否使用https协议
    open: true, // 设置是否自动打开浏览器
    hotOnly: true, // 是否开启热更新
    proxy: {
      "/api": {
        target:
          "https://l94wc2001h.execute-api.ap-southeast-2.amazonaws.com/prod",
        changeOrigin: true, // needed for virtual hosted sites
        ws: true, // proxy websockets
        pathRewrite: {
          ["^" + "/api"]: "",
        },
      },
    },
  },
};
