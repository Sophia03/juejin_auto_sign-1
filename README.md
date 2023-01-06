## 简介
&emsp;&emsp;依赖 [GitHub Actions](https://docs.github.com/cn/actions/learn-github-actions/understanding-github-actions) 的稀土掘金助手，用于自动化每日签到、沾喜气、免费抽奖等。

## 使用说明

### 环境机密 secrets
| `Name` | `Value` | `Required` |
| --- | --- | --- |
| `COOKIE` | 稀土掘金用户`cookie` | 是 |
| `PUSHPLUS_TOKEN` | 微信公众号`pushplus` `token` | 是 |

### 安装依赖

```
npm install
OR
yarn
```

### 本地测试

```
yarn dev
```



