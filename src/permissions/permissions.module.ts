import { Module } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { Permission } from './permissions.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tweet } from '../tweets/tweets.entity';
import { Group } from '../groups/groups.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Permission, Tweet, Group])],
  providers: [PermissionsService],
})
export class PermissionsModule {}
