import { Field, InputType, Int } from '@nestjs/graphql';
import {
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

@InputType()
export class CreateGroupDto {
  @Field()
  @IsNotEmpty()
  @IsString()
  name: string;

  @Field(() => [Int])
  @ArrayNotEmpty()
  @IsArray()
  @IsNumber({}, { each: true })
  userIds: number[];

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsNumber()
  parentGroupId?: number;
}
