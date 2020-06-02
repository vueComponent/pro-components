const path = require('path')
const { IgnorePlugin } = require('webpack')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const dynamicThemePlugin = require('./config/dynamicTheme.js')

const isProd = process.env.NODE_ENV === 'production'
const isAnalyz = process.env.IS_ANALYZ === 'true'

function resolve (dir) {
  return path.join(__dirname, dir)
}

const assetsCDN = {
  externals: {
    'vue': 'Vue',
    'vue-router': 'VueRouter',
    'vuex': 'Vuex',
    'axios': 'axios'
  },
  assets: {
    css: [],
    // https://unpkg.com/browse/vue@2.6.10/
    js: [
      '//cdn.jsdelivr.net/npm/vue@2.6.10/dist/vue.min.js',
      '//cdn.jsdelivr.net/npm/vue-router@3.1.3/dist/vue-router.min.js',
      '//cdn.jsdelivr.net/npm/vuex@3.1.1/dist/vuex.min.js',
      '//cdn.jsdelivr.net/npm/axios@0.19.0/dist/axios.min.js'
    ]
  }
}

// vue.config
const defaultConfig = {
  configureWebpack: {
    plugins: [
      // Ignore all locale files of moment.js
      new IgnorePlugin(/^\.\/locale$/, /moment$/)
    ],
    resolve: {
      alias: {
        '@ant-design/icons/lib/dist$': resolve('./src/core/antd/icons.js')
      }
    },
    externals: isProd ? assetsCDN.externals : {}
  },
  chainWebpack: (config) => {
    config.resolve.alias
      .set('@config', resolve('./config'))
      .set('@ant-design-vue/pro-layout', resolve('../src'))

    // if `production` env require on cdn assets
    isProd && config.plugin('html').tap(args => {
      args[0].cdn = assetsCDN.assets
      return args
    })

    // if `IS_ANALYZ` env is TRUE on report bundle info
    isAnalyz && config.plugin('webpack-report').use(BundleAnalyzerPlugin, [
      {
        analyzerMode: 'static'
      }
    ])

    const svgRule = config.module.rule('svg')
    svgRule.uses.clear()

    svgRule.oneOf('inline')
      .resourceQuery(/inline/)
      .use('vue-svg-icon-loader')
      .loader('vue-svg-icon-loader')
      .end()
      .end()
      .oneOf('external')
      .use('file-loader')
      .loader('file-loader')
      .options({
        name: 'assets/[name].[hash:8].[ext]'
      })
  },
  css: {
    loaderOptions: {
      less: {
        modifyVars: {
          // less vars，customize ant design theme

          // 'primary-color': '#F5222D',
          // 'link-color': '#F5222D',
          // 'border-radius-base': '4px'
        },
        // DO NOT REMOVE THIS LINE
        javascriptEnabled: true
      }
    }
  },
  devServer: {
    // default development server port 8000
    port: 9001
    // If you want to turn on the proxy, please remove the mockjs /src/main.jsL11
    // proxy: {
    //   '/api': {
    //     target: 'https://mock.ihx.me/mock/5baf3052f7da7e07e04a5116/antd-pro',
    //     ws: false,
    //     changeOrigin: true
    //   }
    // }
  },

  // disable source map in production
  productionSourceMap: false,
  lintOnSave: undefined,
  // babel-loader no-ignore node_modules/*
  transpileDependencies: []
}

if (!isProd) {
  defaultConfig.configureWebpack.plugins.push(dynamicThemePlugin())
}

module.exports = defaultConfig
