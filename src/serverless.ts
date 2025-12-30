import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import type { NestExpressApplication } from '@nestjs/platform-express'

let app: NestExpressApplication

export default async function handler(req: any, res: any) {
  if (!app) {
    app = await NestFactory.create<NestExpressApplication>(AppModule)
    app.setGlobalPrefix('api')
    app.enableCors()
    await app.init()
  }
  
  return app.getHttpAdapter().getInstance()(req, res)
}