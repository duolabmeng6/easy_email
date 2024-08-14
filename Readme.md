# 临时邮箱 
任意域名变成临时邮箱

需要部署3个服务

1. email-api 是api接口
2. email-worker 是接收邮件的worker
3. remix 是ui界面

使用d1数据库存储邮件

创建数据库
```
npx wrangler d1 create prod-d1-tutorial
```
把配置添加到 wrangler.toml 里面 email-api 和 email-worker 都需要

创建表
```
cd email-api
npx wrangler d1 execute prod-d1-tutorial --remote --file=./schema.sql
```


remix 需要3个环境变量 可以部署到 vercel

```
QUERY_WORKER_URL=https://xxx.workers.dev/api/email
EMAIL_DOMAIN=xxx.com
COOKIES_SECRET=abc
```
