import express from 'express';
import  {signUp} from '../controllers/auth.controller.js';

const router = express.Router();

router.post('/sign-up', signUp);

router.post('/sign-in', (req, res) => {
  res.send('Sign In endpoint');
});

router.post('/sign-out', (req, res) => {
  res.send('Sign Out endpoint');
});

export default router;