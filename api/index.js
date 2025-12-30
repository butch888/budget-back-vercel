const { NestFactory } = require('@nestjs/core')

let app

module.exports = async (req, res) => {
  try {
    if (!app) {
      const { AppModule } = require('../dist/app.module')
      app = await NestFactory.create(AppModule)
      app.enableCors()
      await app.init()
    }
    
    const expressApp = app.getHttpAdapter().getInstance()
    return expressApp(req, res)
  } catch (error) {
    console.error('Error:', error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}