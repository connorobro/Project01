const { validateUser, validatePassword, createUser, findUser } = require('../utils/userUtils');

describe('User Utilities', () => {
  
  test('validateUser should return valid for correct input', () => {
    const result = validateUser('john', 'password123');
    expect(result.valid).toBe(true);
    expect(result.message).toBe('Valid');
  });

  test('validateUser should return invalid for empty username', () => {
    const result = validateUser('', 'password123');
    expect(result.valid).toBe(false);
    expect(result.message).toBe('Username is required');
  });

  test('validateUser should return invalid for empty password', () => {
    const result = validateUser('john', '');
    expect(result.valid).toBe(false);
    expect(result.message).toBe('Password is required');
  });

  test('validatePassword should return valid for matching passwords', () => {
    const result = validatePassword('password123', 'password123');
    expect(result.valid).toBe(true);
    expect(result.message).toBe('Valid password');
  });

  test('validatePassword should return invalid for non-matching passwords', () => {
    const result = validatePassword('password123', 'different');
    expect(result.valid).toBe(false);
    expect(result.message).toBe('Passwords do not match');
  });

  test('validatePassword should return invalid for short passwords', () => {
    const result = validatePassword('123', '123');
    expect(result.valid).toBe(false);
    expect(result.message).toBe('Password must be at least 6 characters');
  });

  test('createUser should create user object with correct properties', () => {
    const user = createUser('john', 'password123');
    expect(user.username).toBe('john');
    expect(user.password).toBe('password123');
    expect(user.id).toBeDefined();
    expect(user.createdAt).toBeDefined();
  });

  test('findUser should find existing user', () => {
    const users = [
      { username: 'john', password: 'pass123' },
      { username: 'jane', password: 'pass456' }
    ];
    const found = findUser(users, 'jane', 'pass456');
    expect(found).toBeDefined();
    expect(found.username).toBe('jane');
  });

  test('findUser should return undefined for non-existing user', () => {
    const users = [
      { username: 'john', password: 'pass123' }
    ];
    const found = findUser(users, 'jane', 'wrongpass');
    expect(found).toBeUndefined();
  });

});