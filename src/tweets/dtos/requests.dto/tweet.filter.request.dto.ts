import { Field, InputType, Int } from '@nestjs/graphql';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

import { TweetCategoriesEnum } from '../../../tweets/enums/tweets.categories.enum';

const TweetCategory = TweetCategoriesEnum;

@InputType()
export class FilterTweetDto {
  @Field(() => Int, { nullable: true })
  @IsNumber()
  @IsOptional()
  authorId?: number;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  hashtag?: string;

  @Field(() => Int, { nullable: true })
  @IsNumber()
  @IsOptional()
  parentTweetId?: number;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  @IsEnum(TweetCategory)
  category?: string;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  location?: string;
}
