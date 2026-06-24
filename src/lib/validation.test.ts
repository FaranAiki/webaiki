import { expect, test, describe } from 'vitest';
import { Type } from '@sinclair/typebox';
import { validateData } from './validation';

describe('Validation Logic', () => {
  test('validates valid data correctly', () => {
    const schema = Type.Object({ name: Type.String() });
    const result = validateData(schema, { name: 'Alice' });
    
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.name).toBe('Alice');
    }
  });

  test('returns error for invalid data', () => {
    const schema = Type.Object({ name: Type.String() });
    const result = validateData(schema, { name: 123 });
    
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toContain('name: Expected string');
    }
  });
});
