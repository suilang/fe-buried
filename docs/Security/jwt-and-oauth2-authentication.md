# JWT与OAuth2.0身份认证机制详解

本文详细讲解现代Web应用中常用的无状态身份认证方案JWT，以及开放授权协议OAuth2.0的实现原理、使用场景和最佳实践，帮助开发者构建安全可靠的身份认证系统。

## 一、身份认证

### 1. Cookie 与 Session

传统的身份认证方式,通过服务端存储 Session,客户端存储 Cookie 来实现用户状态保持。

#### Cookie 的工作原理

当用户首次登录成功后,服务器会创建一个 Session,并生成唯一的 Session ID,通过响应头的 `Set-Cookie` 字段发送给浏览器:

```http
HTTP/1.1 200 OK
Set-Cookie: sessionId=abc123; HttpOnly; Secure; SameSite=Strict
Content-Type: application/json
```

浏览器会自动将 Cookie 保存,并在后续请求中自动携带:

```http
GET /api/user/profile HTTP/1.1
Cookie: sessionId=abc123
```

#### Cookie 的核心属性

**HttpOnly**: 防止 XSS 攻击窃取 Cookie

```javascript
// 服务端设置
res.setHeader('Set-Cookie', [
  'sessionId=abc123; HttpOnly',  // JavaScript 无法读取
  'userId=123; Secure; SameSite=Strict'
])
```

**Secure**: 仅在 HTTPS 协议下传输

**SameSite**: 防止 CSRF 攻击

- `Strict`: 完全禁止第三方 Cookie
- `Lax`: 允许 GET 请求携带第三方 Cookie
- `None`: 允许所有请求携带(需配合 Secure 使用)

#### 什么是 CSRF 攻击？

CSRF(Cross-Site Request Forgery)跨站请求伪造,是一种诱导用户在已登录状态下发起恶意请求的攻击方式。

**攻击原理:**

```
1. 用户登录 bank.com,浏览器保存登录 Cookie
2. 用户访问恶意网站 evil.com
3. evil.com 页面中包含:
   <img src="http://bank.com/transfer?to=hacker&amount=1000">
4. 浏览器自动携带 bank.com 的 Cookie 向bank.com发起请求
5. 银行服务器验证 Cookie 有效,执行转账操作
```

**为什么危险?**

- 用户完全不知情,请求在后台自动发送
- 浏览器会自动携带目标网站的 Cookie
- 服务器无法区分正常请求和伪造请求

**SameSite 如何防护:**

```javascript
// 设置 SameSite=Strict 后
res.cookie('sessionId', 'abc123', {
  sameSite: 'strict'  // 第三方网站发起的请求不会携带此 Cookie
})

// 当用户在 evil.com 访问 bank.com 的资源时
// 浏览器不会发送 sessionId Cookie
// 服务器认为用户未登录,拒绝请求
```

#### 实际应用示例

```javascript
// Express 后端设置安全 Cookie
app.use(session({
  secret: 'your-secret-key',
  cookie: {
    httpOnly: true,      // 防止 XSS 读取
    secure: true,        // 仅 HTTPS 传输
    sameSite: 'strict',  // 防止 CSRF
    maxAge: 3600000      // 1小时过期
  }
}))
```

#### Session 的存储机制

Session 通常存储在:
- **内存**: 简单快速,但重启丢失,不适合生产环境
- **Redis**: 高性能,支持过期时间,适合分布式
- **数据库**: 持久化存储,但性能较低

```javascript
// 使用 Redis 存储 Session
const RedisStore = require('connect-redis')(session)

app.use(session({
  store: new RedisStore({
    host: 'localhost',
    port: 6379,
    ttl: 3600  // 过期时间
  }),
  secret: 'your-secret-key'
}))
```

#### 优缺点对比

| 方案 | 优点 | 缺点 |
|------|------|------|
| Cookie + Session | 实现简单、服务端可控、安全性高 | 占用服务器资源、分布式需要共享、跨域困难 |

---

### 2. JWT (JSON Web Token)

无状态的身份认证方案,服务端无需存储 Session,适合分布式系统和微服务架构。

#### JWT 的结构

JWT 由三部分组成,用点号分隔:

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEyMywibmFtZSI6IkpvaG4iLCJpYXQiOjE1MTYyMzkwMjJ9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
```

1. **Header**: 定义签名算法
```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

2. **Payload**: 存储用户信息
```json
{
  "userId": 123,
  "name": "John",
  "iat": 1516239022,  // 签发时间
  "exp": 1516242622   // 过期时间
}
```

3. **Signature**: 签名验证

#### 实际应用示例

**生成 Token:**

```javascript
const jwt = require('jsonwebtoken')

// 用户登录成功后生成 token
function generateToken(user) {
  const payload = {
    userId: user.id,
    username: user.name,
    role: user.role
  }
  
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: '1h'  // 1小时过期
  })
}

// 使用示例
app.post('/login', async (req, res) => {
  const { username, password } = req.body
  
  // 验证用户
  const user = await authenticateUser(username, password)
  if (!user) {
    return res.status(401).json({ error: '认证失败' })
  }
  
  // 生成 token
  const token = generateToken(user)
  res.json({ 
    token,
    user: { id: user.id, name: user.name }
  })
})
```

**验证 Token:**

```javascript
// 前端请求拦截器 - 添加 token
axios.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// 后端验证中间件
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]
  
  if (!token) {
    return res.status(401).json({ error: '未提供认证令牌' })
  }
  
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: '令牌无效或已过期' })
    }
    req.user = user
    next()
  })
}
```

#### JWT 存储方式对比

| 存储方式 | 优点 | 缺点 | 推荐度 |
|---------|------|------|--------|
| localStorage | 实现简单、跨域友好 | XSS 可窃取 | ⭐⭐ |
| Cookie (HttpOnly) | 防 XSS 攻击 | CSRF 风险、跨域限制 | ⭐⭐⭐⭐ |
| sessionStorage | 会话级别、自动清理 | 关闭标签页丢失 | ⭐⭐⭐ |

#### Refresh Token 机制

JWT 本身无法主动失效，双 Token 机制可以在保证用户体验的同时，提高安全性。

**核心思路：**

- **Access Token**：短期有效（15分钟），用于日常接口访问
- **Refresh Token**：长期有效（7天），仅用于刷新 Access Token

**代码实现：**

```javascript
// 登录时返回两个 token
app.post('/login', (req, res) => {
  const user = authenticateUser(req.body)
  
  const accessToken = jwt.sign(
    { userId: user.id },
    process.env.JWT_SECRET,
    { expiresIn: '15m' }  // 短期 token
  )
  
  const refreshToken = jwt.sign(
    { userId: user.id, type: 'refresh' },
    process.env.REFRESH_SECRET,
    { expiresIn: '7d' }   // 长期 token
  )
  
  // refresh token 存储在 HttpOnly Cookie
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: true,
    maxAge: 7 * 24 * 60 * 60 * 1000
  })
  
  res.json({ accessToken })
})

// 刷新 token 接口
app.post('/refresh', (req, res) => {
  const refreshToken = req.cookies.refreshToken
  
  if (!refreshToken) {
    return res.status(401).json({ error: '需要重新登录' })
  }
  
  jwt.verify(refreshToken, process.env.REFRESH_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: '刷新令牌无效' })
    }
    
    const newAccessToken = jwt.sign(
      { userId: user.userId },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    )
    
    res.json({ accessToken: newAccessToken })
  })
})

// 前端自动刷新
axios.interceptors.response.use(
  response => response,
  async error => {
    if (error.response?.status === 401) {
      const { data } = await axios.post('/refresh')
      localStorage.setItem('accessToken', data.accessToken)
      error.config.headers.Authorization = `Bearer ${data.accessToken}`
      return axios.request(error.config)
    }
    return Promise.reject(error)
  }
)
```

**Web 端与 App 端的区别：**

| 平台 | Access Token 存储 | Refresh Token 存储 | 是否每次都携带 Refresh Token |
|------|------------------|-------------------|---------------------------|
| Web | localStorage | HttpOnly Cookie | 是（浏览器自动携带） |
| App | 内存 | 安全存储（Keychain/Keystore） | 否（仅在刷新时使用） |

**注意：** 双 Token 机制更适合 App 端，因为可以完全控制 Refresh Token 的使用时机。Web 端由于浏览器的 Cookie 机制，Refresh Token 会被自动携带，但配合 HttpOnly 和 SameSite 仍能提供较好的安全性。

---

### 3. OAuth 2.0

开放授权协议,允许第三方应用在用户授权下访问用户资源,无需暴露用户密码。常见的应用场景:微信登录、GitHub 登录等。

#### 授权码模式(最安全,推荐)

适用于有后端的应用,流程如下:

```
用户 → 点击"GitHub登录" → 跳转GitHub授权页
                              ↓
                          用户同意授权
                              ↓
GitHub → 回调 redirect_uri 并带上 code → 后端接收 code
                                           ↓
                                     后端用 code 换取 token
                                           ↓
                                     获取用户信息
```

**实际代码实现:**

```javascript
// ========== 方式 1: 后端验证 state（推荐） ==========

// 前端 - 先从后端获取 state
async function loginWithGitHub() {
  const { state } = await fetch('/api/oauth/state').then(r => r.json())
  
  const params = new URLSearchParams({
    client_id: 'your-client-id',
    redirect_uri: 'http://localhost:3000/callback',
    scope: 'user:email',
    state: state
  })
  
  window.location.href = `https://github.com/login/oauth/authorize?${params}`
}

// 后端 - 生成并存储 state
app.get('/api/oauth/state', (req, res) => {
  const state = crypto.randomBytes(16).toString('hex')
  req.session.oauthState = state
  res.json({ state })
})

// 后端 - 回调处理
app.get('/callback', async (req, res) => {
  const { code, state } = req.query
  
  // 验证 state
  if (state !== req.session.oauthState) {
    return res.status(400).json({ error: '无效的 state' })
  }
  delete req.session.oauthState
  
  // 使用 code 换取 access token
  const tokenResponse = await axios.post(
    'https://github.com/login/oauth/access_token',
    {
      client_id: process.env.GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_CLIENT_SECRET,
      code: code,
      redirect_uri: 'http://localhost:3000/callback'
    },
    { headers: { Accept: 'application/json' } }
  )
  
  const accessToken = tokenResponse.data.access_token
  
  // 获取用户信息
  const userResponse = await axios.get('https://api.github.com/user', {
    headers: { Authorization: `Bearer ${accessToken}` }
  })
  
  // 创建本地会话
  const user = await findOrCreateUser(userResponse.data)
  const jwtToken = generateJWT(user)
  
  res.redirect(`/dashboard?token=${jwtToken}`)
})

// ========== 方式 2: 前端验证 state ==========

// 前端 - 生成并存储 state
function loginWithGitHub() {
  const state = crypto.randomUUID()
  sessionStorage.setItem('oauth_state', state)
  
  const params = new URLSearchParams({
    client_id: 'your-client-id',
    redirect_uri: 'http://localhost:3000/callback',
    scope: 'user:email',
    state: state
  })
  
  window.location.href = `https://github.com/login/oauth/authorize?${params}`
}

// 后端 - 回调返回前端页面
app.get('/callback', (req, res) => {
  const { code, state } = req.query
  
  res.send(`
    <script>
      const storedState = sessionStorage.getItem('oauth_state')
      
      if (storedState !== '${state}') {
        window.location.href = '/login?error=invalid_state'
      } else {
        fetch('/api/oauth/token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code: '${code}' })
        })
        .then(r => r.json())
        .then(data => {
          localStorage.setItem('token', data.token)
          window.location.href = '/dashboard'
        })
      }
    </script>
  `)
})
```

#### 四种授权模式对比

| 模式 | 适用场景 | 安全性 | 推荐度 |
|------|---------|--------|--------|
| 授权码模式 | 有后端的 Web 应用 | 最高 | ⭐⭐⭐⭐⭐ |
| 隐式模式 | 纯前端 SPA | 较低(已弃用) | ⭐ |
| 密码模式 | 官方自有应用 | 中等 | ⭐⭐⭐ |
| 客户端凭证 | 服务间通信 | 高 | ⭐⭐⭐⭐ |

#### PKCE 扩展(移动端/SPA 推荐)

为授权码模式增加额外安全层:

```javascript
// 生成 code_verifier 和 code_challenge
function generatePKCE() {
  // 生成随机字符串
  const codeVerifier = base64UrlEncode(crypto.randomBytes(32))
  
  // 计算 SHA256 哈希
  const codeChallenge = base64UrlEncode(
    crypto.createHash('sha256').update(codeVerifier).digest()
  )
  
  return { codeVerifier, codeChallenge }
}

// 发起授权时携带 code_challenge
function loginWithPKCE() {
  const { codeVerifier, codeChallenge } = generatePKCE()
  
  // 存储 codeVerifier 用于后续验证
  sessionStorage.setItem('code_verifier', codeVerifier)
  
  const params = new URLSearchParams({
    client_id: 'your-client-id',
    redirect_uri: 'http://localhost:3000/callback',
    response_type: 'code',
    scope: 'openid profile',
    code_challenge: codeChallenge,
    code_challenge_method: 'S256'
  })
  
  window.location.href = `https://auth.example.com/authorize?${params}`
}

// 回调时发送 code_verifier
app.post('/token', async (req, res) => {
  const { code, code_verifier } = req.body
  
  const tokenResponse = await axios.post(tokenEndpoint, {
    grant_type: 'authorization_code',
    code: code,
    code_verifier: code_verifier,  // 验证授权码
    client_id: 'your-client-id'
  })
  
  res.json(tokenResponse.data)
})
```

---

### 4. SSO 单点登录

一次登录,多系统共享认证状态。企业应用常见方案。

#### 同域 SSO

通过共享顶级域名的 Cookie 实现:

```javascript
// 主系统登录后设置 Cookie
// 系统A: app1.company.com
// 系统B: app2.company.com
// 认证中心: auth.company.com

// 认证中心设置 Cookie
res.cookie('sso_token', token, {
  domain: '.company.com',  // 共享顶级域名
  httpOnly: true,
  secure: true
})
```

#### 跨域 SSO (CAS 方案)

使用中央认证服务:

```
1. 用户访问 app1.com
2. 未登录,跳转 auth-center.com/login?service=app1.com
3. 用户在 auth-center.com 登录
4. 生成 ticket,重定向回 app1.com?ticket=ST-123
5. app1.com 后端验证 ticket
6. ticket 有效,创建本地会话
7. 用户访问 app2.com
8. 未登录,跳转 auth-center.com/login?service=app2.com
9. 检测已登录,直接生成 ticket 重定向
10. app2.com 验证 ticket,创建会话
```

**代码示例:**

```javascript
// 应用端 - 检查登录状态
app.get('/protected', (req, res) => {
  // 检查本地 session
  if (req.session.user) {
    return res.json({ user: req.session.user })
  }
  
  // 未登录,重定向到 SSO 认证中心
  const serviceUrl = encodeURIComponent('http://app1.com/callback')
  res.redirect(`https://auth-center.com/login?service=${serviceUrl}`)
})

// 应用端 - SSO 回调
app.get('/callback', async (req, res) => {
  const { ticket } = req.query
  
  if (!ticket) {
    return res.status(400).json({ error: '缺少 ticket' })
  }
  
  // 向认证中心验证 ticket
  const response = await axios.get(
    `https://auth-center.com/validate?ticket=${ticket}&service=http://app1.com/callback`
  )
  
  if (response.data.valid) {
    // ticket 有效,创建本地会话
    req.session.user = response.data.user
    res.redirect('/dashboard')
  } else {
    res.redirect('/login')
  }
})

// 认证中心 - 登录处理
app.post('/login', (req, res) => {
  const { username, password, service } = req.body
  
  // 验证用户
  const user = authenticate(username, password)
  if (!user) {
    return res.status(401).json({ error: '认证失败' })
  }
  
  // 创建全局会话
  const ssoToken = generateSSOToken(user)
  req.session.ssoToken = ssoToken
  
  // 如果有 service 参数,生成 ticket 重定向
  if (service) {
    const ticket = generateTicket(ssoToken, service)
    res.redirect(`${service}?ticket=${ticket}`)
  } else {
    res.json({ success: true })
  }
})
```

---

