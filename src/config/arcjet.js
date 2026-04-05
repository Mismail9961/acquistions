import arcjet, { shield, detectBot, slidingWindow, tokenBucket } from '@arcjet/node';

// Allow-list with only SEARCH_ENGINE blocks Postman, HTTP clients, mobile apps, etc.
// Deny-list: block clearly abusive bot classes; everything else (including TOOL/PROGRAMMATIC) passes.
// See https://docs.arcjet.com/bot-protection/identifying-bots
const botRule =
  process.env.ARCJET_BOT_MODE === 'off'
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
    slidingWindow({
      mode: 'LIVE',
      interval: '2s',
      max: 5,
    }),
  ],
});


export default aj;