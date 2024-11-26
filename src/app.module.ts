import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { GroupsModule } from './groups/groups.module';
import { TweetsModule } from './tweets/tweets.module';
import { PermissionsModule } from './permissions/permissions.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { dbConnectionConfig } from './configs/db.config';
import { AppResolver } from './base/app.resolver';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
    }),

    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: 'src/schema.gql',
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (confiService: ConfigService) =>
        dbConnectionConfig(confiService),
      inject: [ConfigService],
    }),
    UsersModule,
    GroupsModule,
    TweetsModule,
    PermissionsModule,
  ],
  providers: [AppResolver],
})
export class AppModule {}
