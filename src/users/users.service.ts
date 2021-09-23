import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(data: CreateUserDto) {
    const { name, email, password } = data;
    await this.validateDuplicateEmail(email);

    const newUser = new User();
    newUser.name = name;
    newUser.email = email;
    newUser.password = this.hashPassword(password);

    await this.userRepository.save(newUser);

    const { password: newUserPassword, ...rest } = newUser;

    return rest;
  }

  async validateDuplicateEmail(email: string) {
    const user = await this.findByEmail(email);
    if (user) throw new ConflictException(email);
  }

  async findByEmail(email: string) {
    return await this.userRepository.findOne({ email });
  }

  hashPassword(password: string) {
    return bcrypt.hashSync(password, 12);
  }
}
