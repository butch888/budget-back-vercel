const { NestFactory } = require('@nestjs/core')

let cachedApp

async function createApp() {
  if (cachedApp) {
    return cachedApp
  }
  
  try {
    const { AppModule } = require('../dist/app.module')
    const app = await NestFactory.create(AppModule, { logger: false })
    app.enableCors()
    await app.init()
    cachedApp = app
    return app
  } catch (error) {
    console.error('Failed to create app:', error)
    throw error
  }
}

module.exports = async (req, res) => {
  try {
    const app = await createApp()
    const handler = app.getHttpAdapter().getInstance()
    return handler(req, res)
  } catch (error) {
    console.error('Handler error:', error)
    return res.status(500).json({ 
      error: 'Internal Server Error',
      message: error.message 
    })
  }
}