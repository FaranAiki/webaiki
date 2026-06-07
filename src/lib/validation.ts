import { Static } from '@sinclair/typebox';
import { FormatRegistry } from '@sinclair/typebox';
import { Value } from '@sinclair/typebox/value';

// Register email format
const EmailRegex = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i;
FormatRegistry.Set('email', (value) => EmailRegex.test(value));

export function validateData<T extends import('@sinclair/typebox').TSchema>(schema: T, data: unknown): { success: true; data: Static<T> } | { success: false; error: string } {
  const check = Value.Check(schema, data);
  if (check) {
    return { success: true, data: data as Static<T> };
  }
  
  const errors = [...Value.Errors(schema, data)];
  const firstError = errors[0];
  let message = 'Invalid input data';
  
  if (firstError) {
    const path = firstError.path.slice(1) || firstError.type;
    message = `${path}: ${firstError.message}`;
  }
  
  return { success: false, error: message };
}
