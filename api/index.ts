import { NestFactory } from '@nestjs/core'
import { AppModule } from '../src/app.module'

let app

export default async function handler(req: any, res: any) {
  try {
    if (!app) {
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