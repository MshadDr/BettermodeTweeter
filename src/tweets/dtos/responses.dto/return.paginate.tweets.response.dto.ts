import { Field, Int, ObjectType } from '@nestjs/graphql';
import { baseResponseType } from '../../../base/responses/base.response.dto';
import { Tweet } from '../../tweets.entity';
import { IsBoolean, IsNumber, IsOptional } from 'class-validator';

@ObjectType()
export class ReturnPaginateTweetsResponseDto extends baseResponseType(Tweet) {
  @Field(() => [Tweet], { nullable: true })
  @IsOptional()
  data?: Tweet[];

  @Field(() => Int, { nullable: true })
  @IsNumber()
  @IsOptional()
  total?: number;

  @Field(() => Int, { nullable: true })
  @IsNumber()
  @IsOptional()
  pages?: number;

  @Field(() => Boolean, { nullable: true, defaultValue: false })
  @IsBoolean()
  @IsOptional()
  hasNextPage?: boolean;
}
