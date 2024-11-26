import { Module } from '@nestjs/common';
import { TweetsResolver } from './tweets.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tweet } from './tweets.entity';
import { User } from '../users/users.entity';
import { Permission } from '../permissions/permissions.entity';
import { Group } from '../groups/groups.entity';
import { TweetsService } from './services/tweets.service';
import { PermissionsModule } from '../permissions/permissions.module';
import { PermissionsService } from '../permissions/permissions.service';
import { TweetPermissionService } from './services/tweet-permission.service';
import { UsersService } from '../users/users.service';
import { GroupService } from '../groups/groups.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Tweet, User, Permission, Group]),
    PermissionsModule,
  ],
  providers: [
    TweetsResolver,
    TweetsService,
    TweetPermissionService,
    PermissionsService,
    UsersService,
    GroupService,
  ],
})
export class TweetsModule {}
