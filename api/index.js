const { NestFactory } = require('@nestjs/core')
const { ExpressAdapter } = require('@nestjs/platform-express')
const express = require('express')
const { AppModule } = require('../dist/app.module')

let cachedApp

async function createApp() {
  if (cachedApp) {
    return cachedApp
  }

  const expressApp = express()
  const adapter = new ExpressAdapter(expressApp)
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
  
  cachedApp = expressApp
  return expressApp
}

module.exports = async (req, res) => {
  try {
    const app = await createApp()
    app(req, res)
  } catch (error) {
    console.error('Error handling request:', error)
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    })
  }
}