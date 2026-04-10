import arcjet, { shield, detectBot, tokenBucket } from '@arcjet/node';

const botRule = process.env.ARCJET_BOT_MODE === 'off'
  ? null
  : detectBot({
    mode: process.env.ARCJET_BOT_MODE === 'dry_run' ? 'DRY_RUN' : 'LIVE',
    deny: ['CATEGORY:BOTNET'],
  });

const aj = arcjet({
  key: process.env.ARCJET_KEY,
  rules: [
    shield({ mode: 'LIVE' }),
    ...(botRule ? [botRule] : []),
    tokenBucket({
      mode: 'LIVE',
      refillRate: 5,
      interval: 10,
      capacity: 10,
    }),
  ],
});

export default aj;
