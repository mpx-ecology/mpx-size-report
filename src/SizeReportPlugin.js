const startServer = require('./server')
const path = require('path')
const matchCondition = require('@mpxjs/webpack-plugin/lib/utils/match-condition')
const parseRequest = require('@mpxjs/webpack-plugin/lib/utils/parse-request')
const toPosix = require('@mpxjs/webpack-plugin/lib/utils/to-posix')
const { every, has, map, filter, concat, mapToArr } = require('@mpxjs/webpack-plugin/lib/utils/set')
const parseAsset = require('./utils/parse-asset')
const { mkdirp } = require('webpack/lib/util/fs')

class SizeReportPlugin {
  constructor (opts = {}) {
    this.options = opts
    this.options.server = Object.assign({
      host: '127.0.0.1',
      port: 0,
      autoOpenBrowser: true,
      enable: true
    }, opts.server)
  }

  apply (compiler) {
    const fs = compiler.outputFileSystem
    const mkdirpPromise = (dir) => new Promise((resolve, reject) => {
      mkdirp(fs, dir, (err) => {
        if (err) return reject(err)
        resolve()
      })
    })

    const writeFilePromise = (file, content) => new Promise((resolve, reject) => {
      fs.writeFile(file, content, (err) => {
        if (err) return reject(err)
        resolve()
      })
    })

    compiler.hooks.emit.tapPromise({
      name: 'SizeReportPlugin',
      // 在最后assets稳定后执行
      stage: 1000
    }, async (compilation) => {
      const { moduleGraph, chunkGraph, __mpx__: mpx } = compilation
      if (!mpx) return

      function walkEntry (entryModule, sideEffect) {
        const modulesSet = new Set()

        function walk (module) {
          if (modulesSet.has(module)) return
          sideEffect && sideEffect(module, entryModule)
          modulesSet.add(module)
          for (const connection of moduleGraph.getOutgoingConnections(module)) {
            const d = connection.dependency
            // We skip connections without dependency
            if (!d) continue
            const m = connection.module
            // We skip connections without Module pointer
            if (!m) continue
            // We skip weak connections
            if (connection.weak) continue
            // Use undefined runtime
            const state = connection.getActiveState(/* runtime */)
            // We skip inactive connections
            if (state === false) continue
            walk(m)
          }
        }

        walk(entryModule)
      }

      const reportGroups = this.options.groups || []

      const reportPages = this.options.reportPages

      if (reportPages) {
        Object.entries(mpx.pagesMap).forEach(([resourcePath, name]) => {
          reportGroups.push({
            name,
            resourcePath,
            isPage: true,
            entryRules: {
              include: resourcePath
            }
          })
        })
      }

      const reportGroupsWithNoEntryRules = reportGroups.filter((reportGroup) => {
        return reportGroup.hasOwnProperty('noEntryRules')
      })

      const moduleEntriesMap = new Map()

      function setModuleEntries (module, entryModule, noEntry) {
        getModuleEntries(module, noEntry).add(entryModule)
      }

      function getModuleEntries (module, noEntry) {
        const entries = moduleEntriesMap.get(module) || []
        const index = noEntry ? 1 : 0
        entries[index] = entries[index] || new Set()
        moduleEntriesMap.set(module, entries)
        return entries[index]
      }

      // Walk and mark entryModules/noEntryModules
      let entryModules = mpx.removedEntryModules
      compilation.chunks.forEach((chunk) => {
        entryModules = concat(entryModules, new Set(chunkGraph.getChunkEntryModulesIterable(chunk)))
      })

      for (const entryModule of entryModules) {
        walkEntry(entryModule, (module, entryModule) => {
          setModuleEntries(module, entryModule)
        })
        reportGroups.forEach((reportGroup) => {
          reportGroup.entryModules = reportGroup.entryModules || new Set()
          if (reportGroup.entryRules && matchCondition(parseRequest(entryModule.resource).resourcePath, reportGroup.entryRules)) {
            reportGroup.entryModules.add(entryModule)
          }
        })
      }

      if (reportGroupsWithNoEntryRules.length) {
        compilation.modules.forEach((module) => {
          reportGroupsWithNoEntryRules.forEach((reportGroup) => {
            if ((module.resource && matchCondition(parseRequest(module.resource).resourcePath, reportGroup.noEntryRules)) ||
              // 处理ConcatenatedModule
              (module.modules && has(module.modules, (module) => {
                return module.resource && matchCondition(parseRequest(module.resource).resourcePath, reportGroup.noEntryRules)
              }))) {
              reportGroup.noEntryModules = reportGroup.noEntryModules || new Set()
              reportGroup.noEntryModules.add(module)
              walkEntry(module, (module, noEntryModule) => {
                setModuleEntries(module, noEntryModule, true)
              })
            }
          })
        })
      }

      const subpackages = Object.keys(mpx.componentsMap)
      delete subpackages.main

      function getPackageName (fileName) {
        fileName = toPosix(fileName)
        for (let packageName of subpackages) {
          if (fileName.startsWith(packageName + '/')) return packageName
        }
        return 'main'
      }

      function getEntrySet (entryModules, ignoreSubEntry) {
        const selfSet = new Set()
        const sharedSet = new Set()
        const otherSelfEntryModules = new Set()
        entryModules.forEach((entryModule) => {
          const entryNode = mpx.getEntryNode(entryModule)
          if (entryNode) {
            selfSet.add(entryNode)
          } else {
            // 没有在entryNode中记录的entryModule默认为selfEntryModule
            otherSelfEntryModules.add(entryModule)
          }
        })
        if (!ignoreSubEntry) {
          let currentSet = selfSet
          while (currentSet.size) {
            const newSet = new Set()
            currentSet.forEach((entryNode) => {
              entryNode.children.forEach((childNode) => {
                if (selfSet.has(childNode) || sharedSet.has(childNode)) return
                if (every(childNode.parents, (parentNode) => {
                  return selfSet.has(parentNode)
                })) {
                  selfSet.add(childNode)
                } else {
                  sharedSet.add(childNode)
                }
                newSet.add(childNode)
              })
            })
            currentSet = newSet
          }
        }

        return {
          selfEntryModules: concat(map(filter(selfSet, item => {
            if (!item.module) {
              compilation.warnings.push(`EntryNode[${item.request}] has no module, please check!`)
              return false
            }
            return true
          }), item => item.module), otherSelfEntryModules),
          sharedEntryModules: map(filter(sharedSet, item => {
            if (!item.module) {
              compilation.warnings.push(`EntryNode[${item.request}] has no module, please check!`)
              return false
            }
            return true
          }), item => item.module)
        }
      }

      // Get and split selfEntryModules & sharedEntryModules
      reportGroups.forEach((reportGroup) => {
        const entrySet = getEntrySet(reportGroup.entryModules, reportGroup.ignoreSubEntry)
        Object.assign(reportGroup, entrySet, {
          selfSize: 0,
          selfSizeInfo: {},
          sharedSize: 0,
          sharedSizeInfo: {}
        })
      })

      function fillSizeInfo (sizeInfo, packageName, fillType, fillInfo) {
        sizeInfo[packageName] = sizeInfo[packageName] || {
          assets: [],
          modules: [],
          size: 0
        }
        sizeInfo[packageName][fillType].push({ ...fillInfo })
        sizeInfo[packageName].size += fillInfo.size
      }

      function fillSizeReportGroups (entryModules, noEntryModules, packageName, fillType, fillInfo) {
        reportGroups.forEach((reportGroup) => {
          if (reportGroup.noEntryModules && noEntryModules && noEntryModules.size) {
            if (has(noEntryModules, (noEntryModule) => {
              const _entryModules = getModuleEntries(noEntryModule)
              return reportGroup.noEntryModules.has(noEntryModule) && every(entryModules, (entryModule) => {
                return _entryModules.has(entryModule)
              })
            })) {
              reportGroup.selfSize += fillInfo.size
              return fillSizeInfo(reportGroup.selfSizeInfo, packageName, fillType, fillInfo)
            } else if (has(noEntryModules, (noEntryModule) => {
              return reportGroup.noEntryModules.has(noEntryModule)
            })) {
              reportGroup.sharedSize += fillInfo.size
              return fillSizeInfo(reportGroup.sharedSizeInfo, packageName, fillType, fillInfo)
            }
          }
          if (entryModules && entryModules.size) {
            if (every(entryModules, (entryModule) => {
              return reportGroup.selfEntryModules.has(entryModule)
            })) {
              reportGroup.selfSize += fillInfo.size
              return fillSizeInfo(reportGroup.selfSizeInfo, packageName, fillType, fillInfo)
            } else if (has(entryModules, (entryModule) => {
              return reportGroup.selfEntryModules.has(entryModule) || reportGroup.sharedEntryModules.has(entryModule)
            })) {
              reportGroup.sharedSize += fillInfo.size
              return fillSizeInfo(reportGroup.sharedSizeInfo, packageName, fillType, fillInfo)
            }
          }
        })
      }

      const assetsSizeInfo = {
        assets: []
      }

      const packagesSizeInfo = {}

      const sizeSummary = {
        sizeInfo: packagesSizeInfo,
        totalSize: 0,
        staticSize: 0,
        chunkSize: 0,
        copySize: 0
      }

      function fillPackagesSizeInfo (packageName, size) {
        packagesSizeInfo[packageName] = packagesSizeInfo[packageName] || 0
        packagesSizeInfo[packageName] += size
      }

      const modulesMapById = {}

      compilation.modules.forEach(module => {
        const id = chunkGraph.getModuleId(module)
        modulesMapById[id] = module
      })

      // Generate original size info
      for (let name in compilation.assets) {
        const packageName = getPackageName(name)
        const assetModules = mpx.assetModulesMap.get(name)
        if (assetModules) {
          const entryModules = new Set()
          const noEntryModules = new Set()
          // 循环 modules，存储到 entryModules 和 noEntryModules 中
          assetModules.forEach((module) => {
            const _entryModules = getModuleEntries(module)
            const _noEntryModules = getModuleEntries(module, true)
            if (_entryModules) {
              _entryModules.forEach((entryModule) => {
                entryModules.add(entryModule)
              })
            }
            if (_noEntryModules) {
              _noEntryModules.forEach((noEntryModule) => {
                noEntryModules.add(noEntryModule)
              })
            }
          })
          const size = compilation.assets[name].size()
          const identifierSet = new Set()
          let identifier = ''
          assetModules.forEach((module) => {
            const moduleIdentifier = module.readableIdentifier(compilation.requestShortener)
            identifierSet.add(moduleIdentifier)
            if (!identifier) identifier = moduleIdentifier
          })
          if (identifierSet.size > 1) identifier += ` + ${identifierSet.size - 1} modules`

          fillSizeReportGroups(entryModules, noEntryModules, packageName, 'assets', {
            name,
            identifier,
            size
          })
          assetsSizeInfo.assets.push({
            type: 'static',
            name,
            packageName,
            size,
            modules: mapToArr(identifierSet, (identifier) => {
              return {
                identifier
              }
            })
          })
          fillPackagesSizeInfo(packageName, size)
          sizeSummary.staticSize += size
          sizeSummary.totalSize += size
        } else if (/\.m?js$/i.test(name)) {
          let parsedModules
          try {
            parsedModules = parseAsset(compilation.assets[name].source())
          } catch (err) {
            const msg = err.code === 'ENOENT' ? 'no such file' : err.message
            compilation.errors.push(`Error parsing bundle asset "${name}": ${msg}`)
            continue
          }
          let size = compilation.assets[name].size()
          const chunkAssetInfo = {
            type: 'chunk',
            name,
            packageName,
            size,
            modules: []
            // webpackTemplateSize: 0
          }
          assetsSizeInfo.assets.push(chunkAssetInfo)
          fillPackagesSizeInfo(packageName, size)
          sizeSummary.chunkSize += size
          sizeSummary.totalSize += size
          for (let id in parsedModules) {
            const module = modulesMapById[id]
            const moduleSize = Buffer.byteLength(parsedModules[id])
            const identifier = module.readableIdentifier(compilation.requestShortener)
            const entryModules = getModuleEntries(module)
            const noEntryModules = getModuleEntries(module, true)
            fillSizeReportGroups(entryModules, noEntryModules, packageName, 'modules', {
              name,
              identifier,
              size: moduleSize
            })
            chunkAssetInfo.modules.push({
              identifier,
              size: moduleSize
            })
            size -= moduleSize
          }
          // chunkAssetInfo.webpackTemplateSize = size
          // filter sourcemap
        } else if (!/\.m?js\.map$/i.test(name)) {
          // static copy assets such as project.config.json
          const size = compilation.assets[name].size()
          assetsSizeInfo.assets.push({
            type: 'copy',
            name,
            packageName,
            size
          })
          fillPackagesSizeInfo(packageName, size)
          sizeSummary.copySize += size
          sizeSummary.totalSize += size
        }
      }

      // Check threshold
      function normalizeThreshold (threshold) {
        if (typeof threshold === 'number') return threshold
        if (typeof threshold === 'string') {
          if (/ki?b$/i.test(threshold)) return parseFloat(threshold) * 1024
          if (/mi?b$/i.test(threshold)) return parseFloat(threshold) * 1024 * 1024
        }
        return +threshold
      }

      function checkThreshold (threshold, size, sizeInfo, reportGroupName) {
        const sizeThreshold = normalizeThreshold(threshold.size || threshold)
        const packagesThreshold = threshold.packages
        const prefix = reportGroupName ? `${reportGroupName}体积分组` : '总包'

        if (sizeThreshold && size && size > sizeThreshold) {
          compilation.errors.push(`${prefix}的总体积（${size}B）超过设定阈值（${sizeThreshold}B），请检查！`)
        }

        if (packagesThreshold && sizeInfo) {
          for (const packageName in sizeInfo) {
            const packageSize = sizeInfo[packageName].size || sizeInfo[packageName]
            const packageSizeThreshold = normalizeThreshold(packagesThreshold[packageName] || packagesThreshold)
            if (packageSize && packageSizeThreshold && packageSize > packageSizeThreshold) {
              const readablePackageName = packageName === 'main' ? '主包' : `${packageName}分包`
              compilation.errors.push(`${prefix}的${readablePackageName}体积（${packageSize}B）超过设定阈值（${packageSizeThreshold}B），请检查！`)
            }
          }
        }
      }

      if (this.options.threshold) {
        checkThreshold(this.options.threshold, sizeSummary.totalSize, packagesSizeInfo)
      }

      reportGroups.forEach((reportGroup) => {
        if (reportGroup.threshold) {
          checkThreshold(reportGroup.threshold, reportGroup.selfSize, reportGroup.selfSizeInfo, reportGroup.name || 'anonymous group')
        }
      })

      // Format size info
      // function mapModulesReadable (modulesSet) {
      //   return mapToArr(modulesSet, (module) => module.readableIdentifier(compilation.requestShortener))
      // }

      function formatSizeInfo (sizeInfo) {
        const result = {}
        for (const key in sizeInfo) {
          const item = sizeInfo[key]
          result[key] = {
            assets: sortAndFormat(item.assets),
            modules: sortAndFormat(item.modules),
            size: formatSize(item.size)
          }
        }
        return result
      }

      function formatSize (byteLength) {
        if (typeof byteLength !== 'number') return byteLength
        return (byteLength / 1024).toFixed(2) + 'KiB'
      }

      function sortAndFormat (sizeItems) {
        sizeItems.sort((a, b) => {
          return b.size - a.size
        }).forEach((sizeItem) => {
          sizeItem.size = formatSize(sizeItem.size)
        })
        return sizeItems
      }

      const groupsSizeInfo = reportGroups.filter(item => !item.isPage).map((reportGroup) => {
        const readableInfo = {}
        readableInfo.name = reportGroup.name || 'anonymous group'
        // readableInfo.selfEntryModules = mapModulesReadable(reportGroup.selfEntryModules)
        // readableInfo.sharedEntryModules = mapModulesReadable(reportGroup.sharedEntryModules)
        // if (reportGroup.noEntryModules) readableInfo.noEntryModules = mapModulesReadable(reportGroup.noEntryModules)
        readableInfo.selfSize = formatSize(reportGroup.selfSize)
        readableInfo.selfSizeInfo = formatSizeInfo(reportGroup.selfSizeInfo)
        readableInfo.sharedSize = formatSize(reportGroup.sharedSize)
        readableInfo.sharedSizeInfo = formatSizeInfo(reportGroup.sharedSizeInfo)
        return readableInfo
      })

      const pagesSizeInfo = reportGroups.filter(item => item.isPage).map((reportGroup) => {
        const readableInfo = {}
        readableInfo.name = reportGroup.name || 'anonymous page'
        readableInfo.resourcePath = reportGroup.resourcePath
        // readableInfo.selfEntryModules = mapModulesReadable(reportGroup.selfEntryModules)
        // readableInfo.sharedEntryModules = mapModulesReadable(reportGroup.sharedEntryModules)
        readableInfo.selfSize = formatSize(reportGroup.selfSize)
        readableInfo.selfSizeInfo = formatSizeInfo(reportGroup.selfSizeInfo)
        readableInfo.sharedSize = formatSize(reportGroup.sharedSize)
        readableInfo.sharedSizeInfo = formatSizeInfo(reportGroup.sharedSizeInfo)
        return readableInfo
      })

      sortAndFormat(assetsSizeInfo.assets)
      assetsSizeInfo.assets.forEach((asset) => {
        if (asset.modules) sortAndFormat(asset.modules)
      })
      'totalSize|staticSize|chunkSize|copySize'.split('|').forEach((key) => {
        sizeSummary[key] = formatSize(sizeSummary[key])
      })

      for (const packageName in packagesSizeInfo) {
        packagesSizeInfo[packageName] = formatSize(packagesSizeInfo[packageName])
      }

      const reportData = {
        sizeSummary
      }

      if (groupsSizeInfo.length) reportData.groupsSizeInfo = groupsSizeInfo
      if (pagesSizeInfo.length) reportData.pagesSizeInfo = pagesSizeInfo
      if (this.options.reportAssets) reportData.assetsSizeInfo = assetsSizeInfo

      const reportFilePath = path.resolve(compiler.outputPath, this.options.filename || 'report.json')

      await mkdirpPromise(path.dirname(reportFilePath))

      await writeFilePromise(reportFilePath, JSON.stringify(reportData, null, 2))

      const logger = compilation.getLogger('SizeReportPlugin')
      logger.info(`Size report is generated in ${reportFilePath}!`)

      if (this.options.server.enable) {
        startServer(JSON.stringify(reportData), Object.assign({ logger }, this.options.server))
      }
    })
  }
}

module.exports = SizeReportPlugin
