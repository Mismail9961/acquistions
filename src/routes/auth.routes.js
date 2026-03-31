import express from 'express';

const router = express.Router();

router.post('/sign-up', (req, res) => {
  res.send('Sign Up endpoint');
});
router.post('/sign-in', (req, res) => {
  res.send('Sign In endpoint');
});
router.post('/sign-out', (req, res) => {
  res.send('Sign Out endpoint');
});

export default router;