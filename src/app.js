import express from 'express';

const app = express();

app.get('/', (req, res) => {
  res.status(200).send('Hello for Acquistions API');
});

export default app;
