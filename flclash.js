// FlClash 覆写脚本 - 防泄露专用
// 功能：DNS 全加密 + WebRTC 阻断

const VERSION = 'v2.1-leak-prevent'

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

function injectRules(config) {
  if (!Array.isArray(config.rules)) config.rules = []

  config.rules.unshift('DOMAIN-KEYWORD,webrtc,REJECT')
  config.rules.unshift('DOMAIN-KEYWORD,turn,REJECT')
  config.rules.unshift('DOMAIN-KEYWORD,stun,REJECT')

  log('[' + VERSION + '] Injected 3 rules at top: WebRTC keyword block')
}

function main(config) {
  try {
    if (!config || typeof config !== 'object') return config
    if (!Array.isArray(config.proxies) || config.proxies.length === 0) return config

    log('[' + VERSION + '] Start processing')

    overwriteGeneral(config)
    injectRules(config)

    log('[' + VERSION + '] Done')
  } catch (e) {
    log('[' + VERSION + '] ERROR: ' + e.message)
  }
  return config
}

if (typeof globalThis !== 'undefined') globalThis.main = main
