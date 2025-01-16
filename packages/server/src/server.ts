import express, { Request, Response } from 'express'
import { createProxyMiddleware } from 'http-proxy-middleware'
import searchRoutes from './routes/search'

const app = express()
const PORT = 3000

// CORS 中间件
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*') // 允许所有来源
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS')
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  if (req.method === 'OPTIONS') {
    res.sendStatus(200)
  } else {
    next()
  }
})

// 使用路由模块
app.use(searchRoutes)

// 创建代理中间件
app.use(
  '/proxy',
  createProxyMiddleware({
    target: 'https://www.themoviedb.org', // 目标地址
    changeOrigin: true,
    pathRewrite: { '^/proxy': '' }, // 移除路径前缀 /proxy
    on: {
      proxyReq: (proxyReq, req, res) => {
        proxyReq.removeHeader('origin') // 删除 Origin 头
      },
      proxyRes: (proxyRes, req, res) => {
        proxyRes.headers['Access-Control-Allow-Origin'] = '*' // 添加 CORS 头
      },
    },
  }),
)

// 测试路由
app.get('/tmdb/search', (req: Request, res: Response) => {
  res.send('CORS Proxy Server is running!')
})

// 测试路由
app.get('/', (req: Request, res: Response) => {
  res.send('CORS Proxy Server is running!')
})

// 启动服务器
app.listen(PORT, () => {
  console.log(`CORS Proxy Server is running on http://localhost:${PORT}`)
})
