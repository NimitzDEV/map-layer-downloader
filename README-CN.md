# 地图图层下载器

本程序用于下载各种地图的图层图片到文件夹中，并以z/x/y 的形式存储文件，下载的数据可以方便在 leaflet 中充当离线地图使用。

> downloads 目录中包含了三个下载示例，google 还有多种图层可选，具体请自行 Google

## 下载配置

不同的地图将其设置以 json 的形式存放于 config 目录中，以下是配置示例

```json
{
  "url": [
    "http://mt0.google.cn/vt/lyrs=m&x={x}&y={y}&z={z}",
    "http://mt1.google.cn/vt/lyrs=m&x={x}&y={y}&z={z}",
    "http://mt2.google.cn/vt/lyrs=m&x={x}&y={y}&z={z}",
    "http://mt3.google.cn/vt/lyrs=m&x={x}&y={y}&z={z}"
  ],
  "query": {},
  "dir": "E:/map/",
  "downloadStart": 0,
  "downloadEnd": 13
}
```

`url` 为数组，传入下载 url，如果有多个，可以放入多个 url，下载时将随机选取；使用 {x} {y} {z} 表示 url 中坐标的位置

`query`为对象，请求 url 时附加的参数，例如 MapBox, 请求时需要 access_token

`dir` 为字符串，下载目的地

`downloadStart`为数字，下载开始的层级

`downloadEnd`为数字，下载结束的层级

## 如何使用

首先克隆本项目到本地或下载用的服务器

`git clone https://github.com/NimitzDEV/map-layer-downloader.git`

安装依赖

`npm install` 或 `yarn install`

运行程序

`node index.js`



运行之后，程序将会询问加载 config 目录中的哪一个下载配置，并选择并发数以及是否继续上一次加载。