
const utils = require('./utils')
const viewer = require('./viewer')

class SizeReportPlugin {
  constructor(opts = {}) {
    this.opts = {
      reportMode: 'server',
      reportHost: '127.0.0.1',
      reportTitle: utils.defaultTitle,
      openReport: true,
      serverPort: 'serverPort' in opts ? (opts.serverPort === 'auto' ? 0 : opts.serverPort) : 8888
    }

    this.server = null

  }
  apply(compiler) {
    this.compiler = compiler

    const done = (stats, callback) => {
      callback = callback || (() => {})

      setImmediate(async () => {
        try{
          await Promise.all(() => {
            this.startSizeReportServer(stats)
          })
          callback()
        } catch (e) {
          callback(e)
        }
      })
    }

    if (compiler.hooks) {
      compiler.hooks.done.tapAsync('mpx-size-report', done)
    } else {
      compiler.plugin('done', done)
    }
  }

  async startSizeReportServer(stats) {
    if (this.server) {
      (await this.server).updateChartData(stats);
    } else {
      this.server = viewer.startServer(stats, {
        openBrowser: this.opts.openReport,
        host: this.opts.reportHost,
        port: this.opts.serverPort,
        reportTitle: this.opts.reportTitle,
        // bundleDir: this.getBundleDirFromCompiler(),
        // logger: this.logger,
        // defaultSizes: this.opts.defaultSizes,
        // excludeAssets: this.opts.excludeAssets
      });
    }
  }
}

module.exports = SizeReportPlugin
