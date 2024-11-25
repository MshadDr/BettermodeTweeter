import { Field, InputType, Int } from '@nestjs/graphql';
import {
  ArrayNotEmpty,
  IsArray,
  IsBoolean,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';
import { TweetCategoriesEnum } from '../../../tweets/enums/tweets.categories.enum';

@InputType()
export class TweetCreateRequestDto {
  @Field(() => Int)
  @IsNumber()
  @IsNotEmpty()
  authorId: number;

  @Field()
  @IsString()
  @IsNotEmpty()
  content: string;

  @Field(() => Int, { nullable: true })
  @IsNumber()
  parentId?: number;

  @Field(() => [String])
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  hashtags: string[];

  @Field(() => [String], { nullable: true })
  @IsArray()
  @IsString({ each: true })
  @IsIn([
    TweetCategoriesEnum.NEWS,
    TweetCategoriesEnum.FINANCE,
    TweetCategoriesEnum.SPORT,
    TweetCategoriesEnum.TECH,
  ])
  category?: TweetCategoriesEnum[];

  @Field({ nullable: true })
  @IsString()
  location?: string;

  //==============================permission==============================
  @Field(() => [Int], { nullable: true })
  @IsArray()
  @ArrayNotEmpty()
  @IsNumber({}, { each: true })
  usersViewPermissions: number[];

  @Field(() => [Int], { nullable: true })
  @IsArray()
  @ArrayNotEmpty()
  @IsNumber({}, { each: true })
  groupViewPermissions?: number[];

  @Field(() => Boolean, { nullable: true, defaultValue: true })
  @IsBoolean()
  publicViewPermission: boolean;

  @Field(() => [Int], { nullable: true })
  @IsArray()
  @ArrayNotEmpty()
  @IsNumber({}, { each: true })
  usersEditPermissions: number[];

  @Field(() => [Int], { nullable: true })
  @IsArray()
  @IsNumber({}, { each: true })
  groupEditPermissions?: number[];
}
