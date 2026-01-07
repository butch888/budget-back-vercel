import { IsEmail, Matches, MinLength } from 'class-validator'

export class CreateUserDto {
  @IsEmail(
    { allow_display_name: true, require_tld: true },
    { message: 'Invalid email format' },
  )
  email: string

  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string
}
