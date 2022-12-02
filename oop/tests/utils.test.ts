import { describe, test, expect } from 'vitest';
import { utilStringTodoCount } from '@/utils/stringUtils';

describe('tests', () => {
  test('utilStringTodoCount', async () => {
    expect(utilStringTodoCount(0, 1)).toBe('0 | 1');
    expect(utilStringTodoCount(1, 2)).toBe('1 | 2');
  });
});
