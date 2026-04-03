import { signUpSchema, signInSchema } from '../validations/auth.validation.js';
import { formatValidationErrors } from '../utils/format.js';
import logger from '../config/logger.js';
import { createUser, authenticateUser } from '../services/auth.service.js';
import { jwtToken } from '../utils/jwt.js';
import { cookies } from '../utils/cookies.js';


export const signUp = async (req, res,next) => {
  try {
    let requestBody = req.body;
    if (typeof requestBody === 'string') {
      try {
        requestBody = JSON.parse(requestBody);
      } catch (err) {
        return res.status(400).json({ errors: 'Invalid JSON body', details: 'Could not parse request body as JSON' });
      }
    }

    if (requestBody == null || typeof requestBody !== 'object') {
      return res.status(400).json({ errors: 'Invalid request body', details: 'Request body must be a JSON object' });
    }

    const validationResult = signUpSchema.safeParse(requestBody);
    if(!validationResult.success){
        return res.status(400).json({ errors:"Validation failed", details: formatValidationErrors(validationResult.error) });
    }

    const { email, name, password, role } = validationResult.data;

    const user = await createUser(name, email, password, role);

    const token = jwtToken().sign({ userId: user.id, role: user.role });
    cookies.set(res, {}, 'token', token);

    logger.info(`User signed up with email: ${email}, name: ${name}, role: ${role}`);
    res.status(201).json({ message: 'User created successfully', user: { id: user.id, email: user.email, name: user.name, role: user.role } });
  } catch (err) {
    logger.error('Error during sign-up', err);
    if (err.message === "User with this email already exists") {
      return res.status(409).json({ error: 'Email already exist' });
    }
    next(err);
  }
}

export const signIn = async (req, res, next) => {
  try {
    let requestBody = req.body;
    if (typeof requestBody === 'string') {
      try {
        requestBody = JSON.parse(requestBody);
      } catch (err) {
        return res.status(400).json({ errors: 'Invalid JSON body', details: 'Could not parse request body as JSON' });
      }
    }

    if (requestBody == null || typeof requestBody !== 'object') {
      return res.status(400).json({ errors: 'Invalid request body', details: 'Request body must be a JSON object' });
    }

    const validationResult = signInSchema.safeParse(requestBody);
    if (!validationResult.success) {
      return res.status(400).json({ errors: 'Validation failed', details: formatValidationErrors(validationResult.error) });
    }

    const { email, password } = validationResult.data;
    const user = await authenticateUser(email, password);

    const token = jwtToken().sign({ userId: user.id, role: user.role });
    cookies.set(res, {}, 'token', token);

    logger.info(`User signed in with email: ${email}`);
    res.status(200).json({ message: 'User Signed in Successfully', user: { id: user.id, email: user.email, name: user.name, role: user.role } });
  } catch (err) {
    logger.error('Error during sign-in', err);
    if (err.message === 'Invalid credentials') {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    next(err);
  }
}

export const signOut = async (req, res, next) => {
  try {
    cookies.clear(res, {}, 'token');
    logger.info('User signed out');
    res.status(200).json({ message: 'Signed out successfully' });
  } catch (err) {
    logger.error('Error during sign-out', err);
    next(err);
  }
}
