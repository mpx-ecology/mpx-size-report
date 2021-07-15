const path = require('path')
const fs = require('fs')
const http = require('http')

const WebSocket = require('ws')
const express = require('express')
const opener = require('opener')

const projectRoot = path.resolve(__dirname, '..');
const assetsRoot = path.join(projectRoot, 'public');

async function startServer(reportData, opts) {
  const {
    port = opts.port || 9999,
    host = opts.host || '127.0.0.1',
    autoOpenBrowser =  true,
    readFilePath
  } = opts || {};

  const app = express()
  // app.engine('ejs', require('ejs').renderFile)
  // app.set('view engine', `${projectRoot}/views`)
  // app.set('views', `${projectRoot}/views`);

  app.set('views', path.join(__dirname, '../views'));
  app.set('view engine', 'ejs');
  app.use(express.static(`${projectRoot}/public`));

  app.use('/size', (req, res) => {
    res.render('index.ejs', {
      mode: 'server',
      title: 'Mpx Size Report',
      sizeReportInfo: reportData
    })
  })

  app.get('/api/currentUser', (req, res) => {
    res.json({
      name: 'Serati Ma',
      avatar: 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
      userid: '00000001',
      email: 'antdesign@alipay.com',
      signature: '海纳百川，有容乃大',
      title: '交互专家',
      group: '蚂蚁集团－某某某事业群－某某平台部－某某技术部－UED',
      tags: [
        {
          key: '0',
          label: '很有想法的',
        },
        {
          key: '1',
          label: '专注设计',
        },
        {
          key: '2',
          label: '辣~',
        },
        {
          key: '3',
          label: '大长腿',
        },
        {
          key: '4',
          label: '川妹子',
        },
        {
          key: '5',
          label: '海纳百川',
        },
      ],
      notifyCount: 12,
      unreadCount: 11,
      country: 'China',
      geographic: {
        province: {
          label: '浙江省',
          key: '330000',
        },
        city: {
          label: '杭州市',
          key: '330100',
        },
      },
      address: '西湖区工专路 77 号',
      phone: '0752-268888888',
    })
  })

  app.get('/api/sizeReportInfo', (req, res) => {
    // 第一版本先进行本地sizeReport文件的读取
    fs.readFile(readFilePath, 'utf-8', (err, data) => {
      const info = JSON.parse(data)
      res.json(info)
    })
  })

  const server = http.createServer(app)

  await new Promise(resolve => {
    server.listen(port, host, (err) => {
      if (!err) {
        resolve()
        const url = `http://${host}:${server.address().port}/size`
        if (autoOpenBrowser) {
          opener(url)
        }
      }
    })
    server.on('error', (e) => {
      console.log('listen error', e)
      setTimeout(() => {
        server.close();
        server.listen(0, host, (err) => {
          resolve()
          const url = `http://${host}:${server.address().port}/size`
          if (autoOpenBrowser) {
            opener(url)
          }
        })
      }, 1000)
    })
  })
  // ws 长链接监控
}

module.exports = {
  startServer,
  start: startServer
};
