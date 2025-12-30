import { Injectable } from '@nestjs/common'

@Injectable()
export class AppService {
  getHello(): string {
    return '<h1 style="color: red">Hello World from Nest.js!<h1/>'
  }
  getProfile(): string {
    return 'Hello Profile!'
  }
}
