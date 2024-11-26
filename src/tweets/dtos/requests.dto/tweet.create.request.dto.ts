import { Field, InputType, Int } from '@nestjs/graphql';
import {
  ArrayNotEmpty,
  IsArray,
  IsBoolean,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { TweetCategoriesEnum } from '../../../tweets/enums/tweets.categories.enum';
import { BaseDto } from '../../../base/DTO/base.dto';

@InputType()
export class TweetCreateRequestDto extends BaseDto {
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
  @IsOptional()
  parentId?: number;

  @Field(() => [String])
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  hashtags: string[];

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  @IsIn([
    TweetCategoriesEnum.NEWS,
    TweetCategoriesEnum.FINANCE,
    TweetCategoriesEnum.SPORT,
    TweetCategoriesEnum.TECH,
  ])
  category?: TweetCategoriesEnum;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
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
  @IsOptional()
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
  @IsOptional()
  groupEditPermissions?: number[];
}
