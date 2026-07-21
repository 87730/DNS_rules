// FlClash 覆写脚本 - 防泄露进阶版 v3.3
// 功能：TUN 全局接管 + DNS 全加密 + QUIC REDIRECT（Sniffer 劫持）

const VERSION = 'v3.3-leak-prevent-advanced'

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

  config['sniffer'] = {
    enable: true,
    'force-dns-mapping': true,
    'parse-pure-ip': true,
    'override-destination': true,
    sniff: {
      TLS: { ports: [443, 8443] },
      HTTP: { ports: [80, 8080, '8080-8880'], 'override-destination': true },
      QUIC: { ports: [443, 8443] }
    },
    'force-domain': [
      '+.netlify.app',
      '+.vercel.app',
      '+.workers.dev'
    ],
    'skip-domain': [
      'Mijia Cloud',
      '+.oray.com',
      '+.oray.net',
      '+.apple.com'
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
      '+.lan', '+.local', '+.localhost',
      '+.apple.com', '+.apple.com.cn', '+.icloud.com', '+.icloud.com.cn', '+.mzstatic.com',
      '+.microsoft.com', '+.microsoftonline.com', '+.windows.com', '+.windows.net',
      '+.office.com', '+.office365.com', '+.cdn-apple.com', '+.cdn.microsoft.com'
    ]
  }
}

function main(config) {
  try {
    if (!config || typeof config !== 'object') return config
    if (!Array.isArray(config.proxies) || config.proxies.length === 0) return config

    log('[' + VERSION + '] Start processing')
    overwriteGeneral(config)
    log('[' + VERSION + '] Done')
  } catch (e) {
    log('[' + VERSION + '] ERROR: ' + e.message)
  }
  return config
}

if (typeof globalThis !== 'undefined') globalThis.main = main
