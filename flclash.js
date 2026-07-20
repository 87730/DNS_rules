// FlClash 覆写脚本 - 防泄露专用 v3.0
// 功能：DNS 全加密 + WebRTC 阻断 + QUIC REDIRECT（Sniffer 劫持）
// 适用：FlClash >= v0.8.85

const VERSION = 'v3.0-leak-prevent'

var log = (typeof console !== 'undefined' && console.log) ? console.log.bind(console) : function() {}

function overwriteGeneral(config) {
  // TUN 模式 - 接管所有流量
  config['tun'] = {
    enable: true,
    stack: 'gvisor',
    'auto-route': true,
    'auto-detect-interface': true,
    routes: ['0.0.0.0/0'],
    'exclude-routes': [
      '192.168.0.0/16',
      '10.0.0.0/8',
      '172.16.0.0/12'
    ]
  }

  // ============ QUIC REDIRECT（Sniffer 劫持 UDP 443 到代理） ============
  config['sniffer'] = {
    enable: true,
    'parse-pure-ip': false,
    'force-dns-mapping': true,
    'override-destination': true,
    sniff: {
      TLS: { ports: [1-65535], 'override-destination': true },
      HTTP: { ports: [1-65535], 'override-destination': true },
      QUIC: { ports: [1-65535], 'override-destination': true }
    },
    'skip-domain': [
      'Mijia Cloud',
      'dlg.io.mi.com',
      '+.push.apple.com'
    ]
  }

  // DNS 全加密
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
      '+.cdn.microsoft.com',
      'time.*.com',
      'time.*.gov',
      'time.*.edu.cn',
      'time.*.apple.com',
      'time1.*.com',
      'time2.*.com',
      'time3.*.com',
      'time4.*.com',
      'time5.*.com',
      'time6.*.com',
      'time7.*.com',
      'ntp.*.com',
      'ntp1.*.com',
      'ntp2.*.com',
      'ntp3.*.com',
      'ntp4.*.com',
      'ntp5.*.com',
      'ntp6.*.com',
      'ntp7.*.com',
      '*.time.edu.cn',
      '*.ntp.org.cn',
      '+.pool.ntp.org',
      'time1.cloud.tencent.com',
      'stun.*.*',
      'stun.*.*.*',
      'swscan.apple.com',
      'mesu.apple.com',
      'music.163.com',
      '*.music.163.com',
      '*.126.net',
      'musicapi.taihe.com',
      'music.taihe.com',
      'songsearch.kugou.com',
      'trackercdn.kugou.com',
      '*.kuwo.cn',
      'api-jooxtt.sanook.com',
      'api.joox.com',
      'y.qq.com',
      '*.y.qq.com',
      'streamoc.music.tc.qq.com',
      'mobileoc.music.tc.qq.com',
      'isure.stream.qqmusic.qq.com',
      'dl.stream.qqmusic.qq.com',
      'aqqmusic.tc.qq.com',
      'amobile.music.tc.qq.com',
      'localhost.ptlogin2.qq.com',
      '*.msftconnecttest.com',
      '*.msftncsi.com',
      '*.xiami.com',
      '*.music.migu.cn',
      'music.migu.cn',
      '+.wotgame.cn',
      '+.wggames.cn',
      '+.wowsgame.cn',
      '+.wargaming.net',
      '*.*.*.srv.nintendo.net',
      '*.*.stun.playstation.net',
      'xbox.*.*.microsoft.com',
      '*.*.xboxlive.com',
      '*.ipv6.microsoft.com',
      'teredo.*.*.*',
      'teredo.*.*',
      'speedtest.cros.wr.pvp.net',
      '+.jjvip8.com',
      'www.douyu.com',
      'activityapi.huya.com',
      'activityapi.huya.com.w.cdngslb.com',
      'www.bilibili.com',
      'api.bilibili.com',
      'a.w.bilicdn1.com'
    ]
  }
}

function injectRules(config) {
  if (!Array.isArray(config.rules)) config.rules = []

  // WebRTC 泄露防护 - 域名级阻断
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

    log('[' + VERSION + '] Done - TUN + QUIC REDIRECT + DNS encrypted + WebRTC blocked')
  } catch (e) {
    log('[' + VERSION + '] ERROR: ' + e.message)
  }
  return config
}

if (typeof globalThis !== 'undefined') globalThis.main = main
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
