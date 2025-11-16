import express from 'express';
import consign from 'consign';

const app = express();

consign()
    .include('libs/middleware.js')
    .then('routes')
    .then('libs/boots.js')
    .into(app);

