import type { TransformFnParams } from 'class-transformer';

export function transformNullableString({ value }: TransformFnParams): unknown {
  const input: unknown = value;
  return typeof input === 'string' && input.trim() === '' ? null : input;
}

export function transformNullableDate({ value }: TransformFnParams): unknown {
  const input: unknown = value;
  if (typeof input === 'string' && input.trim() === '') {
    return null;
  }
  if (input === null || input === undefined || input instanceof Date) {
    return input;
  }
  if (typeof input === 'string' || typeof input === 'number') {
    return new Date(input);
  }
  return input;
}
