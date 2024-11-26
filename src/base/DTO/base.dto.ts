import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';

export class BaseDto {
  @ValidateNested()
  @Type(() => Object)
  data?: Record<string, any>;
}
