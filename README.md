# Map Layer Downloader

[中文文档](README-CN.md)

This program is use for download layer pictures from multiple map services, and store files into z/x/y structure, files can be useful for offline maps for leaflet.

> downloads directory contains 3 config examples, and Google Map has many types of layers, you can find it on Google.

## Download Configuration

Different download configurations should be separate into different JSON files, here is one example shows how to write the configuration.

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

`url` Array, contains one or more download URLs, before you put it in, use {x} {y} {z} to replace the original URL structure.

`query `Object, additional request parameters, like in MapBox, you should have a access_token parameter.

`dir` String, download destination.

`downloadStart`Number, starting layer.

`downloadEnd`Number, ending layer.

## How to use

Clone this project into your computer or download server

`git clone https://github.com/NimitzDEV/map-layer-downloader.git`

Install dependencies

`npm install`  or  `yarn install`

Run

`node index.js`



After this program started, will prompt you a few questions like which map you want to download, how many concurrencies you want and ask you if you want to resume previous download.