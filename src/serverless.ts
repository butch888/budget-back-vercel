import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ExpressAdapter } from '@nestjs/platform-express'
import express from 'express'

const server = express()

let app: any

async function createNestServer(expressInstance: any) {
  app = await NestFactory.create(AppModule, new ExpressAdapter(expressInstance))
  app.setGlobalPrefix('api')
  app.enableCors()
  await app.init()
  return app
}

createNestServer(server)
  .then(() => console.log('Nest Ready'))
  .catch((err) => console.error('Nest broken', err))

export default server
