import { Field, InputType, Int } from '@nestjs/graphql';
import {
  ArrayNotEmpty,
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
} from 'class-validator';

@InputType()
export class PermissionCreateRequestDto {
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
