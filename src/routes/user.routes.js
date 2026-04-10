import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
  res.send('GET /users');
});

router.get('/:id', (req, res) => {
  res.send('GET /users/:id');
});

router.put('/:_id', (req, res) => {
  res.send('PUT /users/:_id');
});

router.delete('/:_id', (req, res) => {
  res.send('DELETE /users/:_id');
});

export default router;
