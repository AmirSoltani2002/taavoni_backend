import type { TransformFnParams } from 'class-transformer';

export function transformBooleanString({
  value,
  obj,
  key,
}: TransformFnParams): unknown {
  const originalValue = (obj as Record<string, unknown>)[key];
  if (originalValue === 'true') return true;
  if (originalValue === 'false') return false;
  return value as unknown;
}
