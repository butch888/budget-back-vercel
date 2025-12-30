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
  
  app.enableCors({
    origin: true,
    credentials: true,
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