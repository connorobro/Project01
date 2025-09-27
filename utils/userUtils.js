// Simple utility functions for user operations
export function validateUser(username, password) {
  if (!username || !username.trim()) {
    return { valid: false, message: 'Username is required' };
  }
  if (!password || !password.trim()) {
    return { valid: false, message: 'Password is required' };
  }
  return { valid: true, message: 'Valid' };
}

export function validatePassword(password, confirmPassword) {
  if (password !== confirmPassword) {
    return { valid: false, message: 'Passwords do not match' };
  }
  if (password.length < 6) {
    return { valid: false, message: 'Password must be at least 6 characters' };
  }
  return { valid: true, message: 'Valid password' };
}

export function createUser(username, password) {
  return {
    id: Date.now().toString(),
    username: username,
    password: password,
    createdAt: new Date().toISOString()
  };
}

export function findUser(users, username, password) {
  return users.find(user => 
    user.username === username && user.password === password
  );
}