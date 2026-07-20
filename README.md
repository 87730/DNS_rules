# FlClash 防泄露覆写脚本

> FlClash 专用覆写脚本，彻底防止 DNS 泄露、WebRTC 泄露、QUIC 泄露。

## 功能

| 功能 | 说明 |
|---|---|
| TUN gvisor | 接管所有流量，无泄漏 |
| QUIC REDIRECT | Sniffer 嗅探劫持 UDP 443 到代理，保留 QUIC 高速优势 |
| DNS 全加密 | DoH + DoT，fake-ip 防泄露 |
| WebRTC 阻断 | 阻断 STUN/TURN 域名，防止真实 IP 泄露 |
| fake-ip-filter | 保留音乐/游戏/时间同步等直连，App 兼容 |

## 安装

### 方法一：通过 URL 添加（推荐）

1. 复制脚本的 RAW 地址
2. FlClash → 配置 → 覆写脚本 → `+` → **通过 URL 添加**
3. 粘贴链接 → 保存
4. 关联到订阅 → 刷新

### 方法二：本地导入

1. 下载 `flclash.js`
2. FlClash → 配置 → 覆写脚本 → `+` → **本地导入**
3. 选择文件 → 保存
4. 关联到订阅 → 刷新

## 使用前提

> ⚠️ **重要**：FlClash 系统层面必须开启 TUN 模式，否则脚本不生效。

- FlClash → 设置（右上角齿轮）→ TUN 模式 → 启用
- 确认主界面订阅卡片显示「TUN 模式」

## 验证

| 测试项 | 预期结果 |
|---|---|
| DNS 泄露测试 | [ipleak.net](https://ipleak.net) → 无真实 IP，无本地 DNS |
| WebRTC 泄露测试 | [browserleaks.com/webrtc](https://browserleaks.com/webrtc) → 无本地 IP |
| QUIC 测试 | [browserleaks.com/quic](https://browserleaks.com/quic) → 正常连接，无 IP 泄露 |

## 配置说明

```javascript
// TUN 模式配置
tun: {
  enable: true,
  stack: 'gvisor',
  auto-route: true,
  auto-detect-interface: true,
  routes: ['0.0.0.0/0'],      // 全网接管
  exclude-routes: ['192.168.0.0/16', '10.0.0.0/8', '172.16.0.0/12']  // 排除内网
}

// QUIC REDIRECT：Sniffer 嗅探 → 劫持到代理
sniffer: {
  enable: true,
  override-destination: true,     // 关键：覆写目标地址
  sniff: {
    QUIC: { ports: [1-65535], override-destination: true }  // 劫持 UDP 443
  }
}

// DNS 全加密
dns: {
  enable: true,
  ipv6: false,                   // 禁用 IPv6，防止 IPv6 泄露
  enhanced-mode: 'fake-ip',      // 返回假 IP，真实 IP 只走代理
  nameserver: ['https://dns.cloudflare.com/dns-query', 'https://dns.google/dns-query'],
  default-nameserver: ['tls://223.5.5.5', 'tls://223.6.6.6']
}
```

## 仓库结构

```
.
├── flclash_leak_prevent.js    # FlClash 防泄露覆写脚本
└── README.md                  # 本文件
```

## 相关链接

- FlClash 官网：[https://github.com/FlClash-Tsing](https://github.com/FlClash-Tsing)
- mihomo 内核文档：[https://wiki.metacubex.one](https://wiki.metacubex.one)

## 常见问题

**Q: 开 TUN 后网速变慢？**
A: gvisor 是用户态协议栈，性能略低于 system 栈。切换到 system 栈：FlClash → 设置 → TUN Stack → system

**Q: 音乐 App 网易云/QQ 音乐断连？**
A: 脚本已内置 fake-ip-filter 排除音乐域名。如果仍断连，尝试关闭 TUN 改用系统代理模式。

**Q: 游戏延迟高？**
A: 部分游戏 QUIC 被劫持可能导致延迟。在游戏分组中选低延迟节点，或加入直连规则。

**Q: 为什么 TUN 开了还是泄露？**
A: 确认 FlClash 设置里 TUN 已启用（非仅脚本配置）。脚本只改配置参数，系统总开关需手动打开。

## 更新日志

| 版本 | 日期 | 更新内容 |
|---|---|---|
| v3.0 | 2026-07-20 | 新增 QUIC REDIRECT（Sniffer 劫持），fake-ip-filter 扩充 |
| v2.1 | 2026-07-20 | 修复 IPv6 规则语法，规则位置修正为 unshift |
| v2.0 | 2026-07-20 | DNS 端口冲突修复，WebRTC 保留视频通话功能 |
| v1.0 | 2026-07-20 | 初始版本：DNS 全加密 + WebRTC 阻断 |

## 许可

MIT License

## 免责声明

本脚本仅用于学习和保护个人隐私。请遵守当地法律法规，因使用本脚本产生的一切后果由使用者自行承担。
