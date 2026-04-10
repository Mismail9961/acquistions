import logger from '../config/logger.js';
import bcrypt from 'bcrypt';
import database from '../config/database.js';

export const hashPassword = async (password) => {
  try {
    return await bcrypt.hash(password, 10);
  } catch (err) {
    logger.error('Error hashing password', err);
    throw new Error('Failed to hash password', { cause: err });
  }
};

export const comparePassword = async (password, hashedPassword) => {
  try {
    return await bcrypt.compare(password, hashedPassword);
  } catch (err) {
    logger.error('Error comparing password', err);
    throw new Error('Failed to compare password', { cause: err });
  }
};

export const authenticateUser = async (email, password) => {
  try {
    const existingUsers = await database.sql.query(
      'select id, name, email, password, role from users where email = $1 limit 1',
      [email]
    );
    if (existingUsers.length === 0) {
      throw new Error('Invalid credentials');
    }

    const user = existingUsers[0];
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    return user;
  } catch (err) {
    logger.error('Error authenticating user', err);
    if (err.message === 'Invalid credentials') {
      throw err;
    }
    throw new Error('Failed to authenticate user', { cause: err });
  }
};

export const createUser = async (name, email, password, role = 'user') => {
  try {
    const existingUsers = await database.sql.query(
      'select id from users where email = $1 limit 1',
      [email]
    );
    if (existingUsers.length > 0) {
      throw new Error('User with this email already exists');
    }

    const hashedPassword = await hashPassword(password);
    const insertedUsers = await database.sql.query(
      'insert into users (name, email, password, role) values ($1, $2, $3, $4) returning id, name, email, role, created_at',
      [name, email, hashedPassword, role]
    );

    const newUser = insertedUsers[0];
    logger.info(`User created with email: ${email}, name: ${name}, role: ${role}`);
    return newUser;
  } catch (err) {
    logger.error('Error creating user', err);
    if (err.message === 'User with this email already exists') {
      throw err;
    }
    throw new Error('Failed to create user', { cause: err });
  }
};
