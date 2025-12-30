module.exports = async (req, res) => {
  try {
    // Простая проверка работоспособности
    if (req.url === '/') {
      return res.json({ 
        message: 'Hello from Vercel!',
        timestamp: new Date().toISOString(),
        method: req.method,
        url: req.url
      })
    }
    
    // Попытка загрузить NestJS
    const { NestFactory } = require('@nestjs/core')
    const { AppModule } = require('../dist/app.module')
    
    const app = await NestFactory.create(AppModule, { logger: false })
    app.enableCors()
    await app.init()
    
    const handler = app.getHttpAdapter().getInstance()
    return handler(req, res)
    
  } catch (error) {
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    })
    
    return res.status(500).json({ 
      error: 'Server Error',
      message: error.message,
      timestamp: new Date().toISOString()
    })
  }
}