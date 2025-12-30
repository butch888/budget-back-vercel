const { NestFactory } = require('@nestjs/core')
const { ExpressAdapter } = require('@nestjs/platform-express')
const { AppModule } = require('../dist/app.module')

let cachedHandler

async function bootstrap() {
  if (cachedHandler) {
    return cachedHandler
  }

  // NestJS по умолчанию использует Express через @nestjs/platform-express
  // Для Vercel serverless функций нам нужно получить Express handler
  // ExpressAdapter автоматически создаст Express приложение
  const adapter = new ExpressAdapter()
  
  const app = await NestFactory.create(AppModule, adapter, {
    logger: false,
  })
  
  // Настройка CORS для работы с фронтендом на Vercel
  app.enableCors({
    origin: [
      process.env.FRONTEND_URL,
      /\.vercel\.app$/,
      /\.vercel\.dev$/
    ].filter(Boolean),
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
  
  await app.init()
  
  // Получаем Express приложение из адаптера NestJS
  // Это необходимо для Vercel, который ожидает Express handler (req, res) => {}
  // NestJS использует Express под капотом, мы просто получаем к нему доступ
  const handler = app.getHttpAdapter().getInstance()
  cachedHandler = handler
  return handler
}

module.exports = async (req, res) => {
  try {
    const handler = await bootstrap()
    handler(req, res)
  } catch (error) {
    console.error('Error handling request:', error)
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    })
  }
}