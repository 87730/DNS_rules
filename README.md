# FlClash 防泄露覆写脚本

FlClash 覆写脚本，防止 DNS 泄露和 WebRTC 泄露。

## 功能

- TUN gvisor 模式，接管所有流量
- DNS 全加密（DoH），fake-ip 防泄露
- WebRTC STUN/TURN 域名阻断
- IPv6 出站阻断
- 不修改原有策略组和规则

## 使用方法

1. 复制本仓库 `flclash-leak-prevent.js` 的 RAW 地址
2. FlClash → 配置 → 覆写脚本 → `+` → 通过 URL 添加
3. 粘贴链接 → 保存
4. 关联到订阅 → 刷新
https://raw.githubusercontent.com/87730/proxy_DNS_rules/refs/heads/main/flclash.js

## 配置说明

| 配置项 | 值 | 说明 |
|---|---|---|
| TUN | gvisor | 用户态协议栈，兼容性好 |
| DNS | DoH | 阿里/Cloudflare/Google 加密解析 |
| fake-ip | 198.18.0.0/16 | 返回假 IP，真实 IP 走代理 |
| WebRTC | 阻断 STUN/TURN | 防止真实 IP 泄露 |
| IPv6 | 全阻断 | 防止 IPv6 泄露 |

## 验证

- 访问 https://ipleak.net — 应无 DNS 泄露
- 访问 https://browserleaks.com/webrtc — 应无本地 IP

## 许可

MIT
