import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { CategoryService } from './../category/category.service'
import { TransactionService } from './../transaction/transaction.service'

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly transactionServise: TransactionService,
    private readonly categoryService: CategoryService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest()
    const { id, type } = request.params

    let entity

    switch (type) {
      case 'transaction':
        entity = await this.transactionServise.findOne(+id)
        break
      case 'category':
        entity = await this.categoryService.findOne(+id)
        break
      default:
        throw new NotFoundException('Something went wrong...')
    }

    const user = request.user

    if (entity && user && entity.user.id === user.id) {
      return true
    }

    throw new BadRequestException('Something went wrong...')
  }
}
