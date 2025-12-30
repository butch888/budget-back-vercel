import { Injectable, NotFoundException } from '@nestjs/common'
import { CreateTransactionDto } from './dto/create-transaction.dto'
import { UpdateTransactionDto } from './dto/update-transaction.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { Transaction } from './entities/transaction.entity'
import { Repository } from 'typeorm'
import { Category } from '../category/entities/category.entity'

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async create(createTransactionDto: CreateTransactionDto, id: number) {
    // Находим категорию по ID из объекта category
    const category = await this.categoryRepository.findOne({
      where: { id: createTransactionDto.category.id },
    })

    if (!category) {
      throw new NotFoundException('Category not found')
    }

    const newTransaction = {
      title: createTransactionDto.title,
      amount: createTransactionDto.amount,
      type: createTransactionDto.type,
      category: category, // Используем найденную категорию
      user: { id },
    }

    return await this.transactionRepository.save(newTransaction)
  }

  // остальные методы остаются без изменений
  async findAll(id: number) {
    const transactions = await this.transactionRepository.find({
      where: {
        user: { id },
      },
      relations: {
        category: true,
      },
      order: { createdAt: 'DESC' },
    })
    return transactions
  }

  async findOne(id: number) {
    const transaction = await this.transactionRepository.findOne({
      where: { id },
      relations: ['user', 'category'],
    })
    if (!transaction) throw new Error('Transaction not found')
    return transaction
  }

  async update(id: number, updateTransactionDto: UpdateTransactionDto) {
    const transaction = await this.transactionRepository.findOne({
      where: { id },
    })

    if (!transaction) throw new Error('Transaction not found')

    return await this.transactionRepository.update(id, updateTransactionDto)
  }

  async remove(id: number) {
    const transaction = await this.transactionRepository.findOne({
      where: { id },
    })

    if (!transaction) throw new Error('Transaction not found')
    return await this.transactionRepository.delete(id)
  }

  async findAllWithPagination(id: number, page: number, limit: number) {
    const transactions = await this.transactionRepository.find({
      where: {
        user: { id },
      },
      relations: {
        category: true, // Отображение категорий
      },
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    })
    return transactions
  }

  async findOneAllByType(id: number, type: string) {
    const transactions = await this.transactionRepository.find({
      where: {
        user: { id },
        type,
      },
    })

    const total = transactions.reduce((acc, transaction) => {
      return acc + transaction.amount
    }, 0)
    return total
  }
}
