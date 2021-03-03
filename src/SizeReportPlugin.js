
const utils = require('./utils')
const viewer = require('./viewer')

class SizeReportPlugin {
  constructor(opts = {}) {
    this.opts = {
      reportMode: 'server',
      reportHost: '127.0.0.1',
      reportTitle: utils.defaultTitle,
      readFilePath: opts.readFilePath || '',
      openReport: true,
      serverPort: 'serverPort' in opts ? (opts.serverPort === 'auto' ? 0 : opts.serverPort) : 9999
    }

    this.server = null

  }
  apply(compiler) {
    this.compiler = compiler

    const done = async (stats, callback) => {
      callback = callback || (() => {})
      await this.startSizeReportServer(stats)
      callback()
      // setImmediate(async () => {
      //   try{
      //     await Promise.all([() => {
      //       this.startSizeReportServer(stats)
      //     }])
      //     callback()
      //   } catch (e) {
      //     console.log('ERRRO')
      //     callback(e)
      //   }
      // })
    }

    if (compiler.hooks) {
      compiler.hooks.done.tapAsync('mpx-size-report', done)
    } else {
      compiler.plugin('done', done)
    }
  }

  async startSizeReportServer(stats) {
    this.server = viewer.startServer(stats, {
      openBrowser: this.opts.openReport,
      host: this.opts.reportHost,
      port: this.opts.serverPort,
      reportTitle: this.opts.reportTitle,
      readFilePath: this.opts.readFilePath
      // bundleDir: this.getBundleDirFromCompiler(),
      // logger: this.logger,
      // defaultSizes: this.opts.defaultSizes,
      // excludeAssets: this.opts.excludeAssets
    });
  }
}

module.exports = SizeReportPlugin
