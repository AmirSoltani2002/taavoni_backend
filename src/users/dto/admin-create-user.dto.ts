import { Transform, type TransformFnParams } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';
import { CreateUserDto } from './create-user.dto';

export class AdminCreateUserDto extends CreateUserDto {
  // Preserve the JSON value: implicit conversion would turn false/'' into 0.
  @Transform(
    ({ obj, key }: TransformFnParams) => (obj as Record<string, unknown>)[key],
  )
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(2147483647)
  identifier?: number | null;
}
