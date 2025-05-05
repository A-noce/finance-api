import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@user/entity/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly repository: Repository<User>,
  ) {}

  public async findById(id: number) {
    return await this.repository.findOneBy({ id });
  }

  public async findByEmail(email: string) {
    return await this.repository.findOneBy({ email });
  }

  public async createUser(email: string, password: string) {
    const newUser = this.repository.create({
      email,
      password,
    });
    return this.repository.save(newUser);
  }
}
