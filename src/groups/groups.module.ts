import { Module } from '@nestjs/common';
import { GroupService } from './groups.service';
import { GroupResolver } from './groups.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Group } from './groups.entity';
import { User } from '../users/users.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Group, User])],
  providers: [GroupResolver, GroupService],
})
export class GroupsModule {}
