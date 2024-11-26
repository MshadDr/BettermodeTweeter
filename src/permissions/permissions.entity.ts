import { Field, Int, ObjectType } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('permissions')
@ObjectType()
@Index(['publicViewPermission'])
@Index(['usersViewPermissions'])
@Index(['groupsViewPermissions'])
export class Permission {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;

  @Field(() => [Int])
  @Column({ type: 'integer', array: true })
  usersViewPermissions: number[];

  @Field(() => [Int], { nullable: true })
  @Column({ type: 'integer', array: true, nullable: true })
  @IsOptional()
  groupsViewPermissions?: number[];

  @Field(() => Boolean, { defaultValue: false })
  @Column({ nullable: true, default: false })
  @IsOptional()
  publicViewPermission?: boolean;

  @Field(() => [Int])
  @Column({ type: 'integer', array: true })
  usersEditPermissions: number[];

  @Field(() => [Int], { nullable: true })
  @Column({ type: 'integer', array: true, nullable: true })
  @IsOptional()
  groupEditPermissions?: number[];

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;
}
