import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { User } from './users.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  /**
   *
   * @param number userId
   * @returns User user
   */
  async findUserById(userId: number): Promise<User> {
    return await this.userRepository.findOne({ where: { id: userId } });
  }

  /**
   *
   * @param number[] userIds
   * @returns User[] users
   */
  async findUsersByIds(userIds: number[]): Promise<User[]> {
    return await this.userRepository.find({ where: { id: In(userIds) } });
  }
}
