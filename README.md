# Mpx size reprot plugin

## Install

```js
npm i @didi/mpx-size-report --save-dev
```

## Usage
在 webpack 构建配置文件中 plugins 中配置

```js
plugins: [
    new MpxSizeReportPlugin({
      // 读取的 sizeReport json 文件地址，第二版会去掉
      readFilePath: path.resolve(__dirname, '../dist/wx-size-report.json')
    }),
]
```
