// FlClash 覆写脚本 - 纯净防泄露版 (DNS 全加密 + TUN 全局接管)
// 说明：依靠 TUN 模式防止公网 IP 泄露。
// 提示：若需防止局域网 IP 泄露，请在浏览器端配合使用 WebRTC Leak Prevent 等扩展插件。

const VERSION = 'v3.0-leak-prevent-clean'

var log = (typeof console !== 'undefined' && console.log) ? console.log.bind(console) : function() {}

function overwriteGeneral(config) {
  config['tun'] = {
    enable: true,
    stack: 'gvisor',
    'auto-route': true,
    'auto-detect-interface': true,
    routes: ['0.0.0.0/0'],
    'exclude-routes': [
      '192.168.0.0/16',
      '10.0.0.0/8',
      '172.16.0.0/12',
      '100.64.0.0/10'
    ]
  }

  config['dns'] = {
    enable: true,
    ipv6: false,
    'enhanced-mode': 'fake-ip',
    'fake-ip-range': '198.18.0.1/16',
    'use-hosts': false,
    'respect-rules': true,
    'default-nameserver': ['tls://223.5.5.5', 'tls://223.6.6.6'],
    'proxy-server-nameserver': ['https://doh.pub/dns-query', 'tls://223.5.5.5'],
    'direct-nameserver': ['https://dns.alidns.com/dns-query'],
    'nameserver-policy': {
      'geosite:cn,geolocation-cn': [
        'https://dns.alidns.com/dns-query',
        'https://doh.pub/dns-query',
        'tls://223.5.5.5',
        'tls://223.6.6.6'
      ]
    },
    nameserver: ['https://dns.cloudflare.com/dns-query', 'https://dns.google/dns-query'],
    'direct-nameserver-follow-policy': true,
    'fake-ip-filter': [
      '+.lan',
      '+.local',
      '+.localhost',
      '+.apple.com',
      '+.apple.com.cn',
      '+.icloud.com',
      '+.icloud.com.cn',
      '+.mzstatic.com',
      '+.microsoft.com',
      '+.microsoftonline.com',
      '+.windows.com',
      '+.windows.net',
      '+.office.com',
      '+.office365.com',
      '+.cdn-apple.com',
      '+.cdn.microsoft.com'
    ]
  }
}

function main(config) {
  try {
    if (!config || typeof config !== 'object') return config
    if (!Array.isArray(config.proxies) || config.proxies.length === 0) return config

    log('[' + VERSION + '] Start processing')

    // 执行核心配置覆写
    overwriteGeneral(config)

    log('[' + VERSION + '] Done')
  } catch (e) {
    log('[' + VERSION + '] ERROR: ' + e.message)
  }
  return config
}

if (typeof globalThis !== 'undefined') globalThis.main = main
