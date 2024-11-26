import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Type } from '@nestjs/common';
import { IsOptional } from 'class-validator';

export function baseResponseType<T>(TClass: Type<T>) {
  @ObjectType({ isAbstract: true })
  class BaseResponseDtoClass {
    @Field(() => Int)
    statusCode: number;

    @Field(() => Boolean)
    success: boolean;

    @Field(() => String)
    message: string;

    @Field(() => [TClass], { nullable: true })
    @IsOptional()
    data?: T | T[];

    @Field(() => String, { nullable: true })
    @IsOptional()
    stack?: string;
  }
  return BaseResponseDtoClass;
}
